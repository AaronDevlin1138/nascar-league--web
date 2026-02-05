
import os
import time
import secrets
import random
import threading
import json
import requests
from datetime import datetime
from flask import Flask, render_template, send_from_directory, redirect, request, session, url_for, jsonify, Response
from flask_socketio import SocketIO, emit

PORT = int(os.environ.get("PORT", 10000))

# --- PIT CREW CONFIGURATION ---
DISCORD_CLIENT_ID = "1468354316850171988"
DISCORD_CLIENT_SECRET = "2dd17b6db16b8d24ea9eca31901c78cc8131805095c0ce1b05971c8c0d3beb38"
DISCORD_REDIRECT_URI = "https://nascar-hub.onrender.com/callback"
DISCORD_AUTH_URL = "https://discord.com/oauth2/authorize"
DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token"

app = Flask(__name__, static_folder='.', static_url_path='', template_folder='templates')
app.secret_key = 'nascar_super_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# Global Race State
race_state = {
    "flag": "Green",
    "isMaintenance": False,
    "mainStreamId": "v8N9SOnX9Yk",
    "crashCamId": "7R5A0UIdXN0",
    "sessionStatus": "QUALIFYING",
    "lap": 1,
    "totalLaps": 100
}

drivers_list = [
    {"name": "JOEY LOGANO", "number": "22", "id": "driver-1", "manufacturer": "Ford", "color": "#facc15"},
    {"name": "KYLE BUSCH", "number": "8", "id": "driver-2", "manufacturer": "Chevy", "color": "#ef4444"},
    {"name": "CHASE ELLIOTT", "number": "9", "id": "driver-3", "manufacturer": "Chevy", "color": "#3b82f6"},
    {"name": "DENNY HAMLIN", "number": "11", "id": "driver-4", "manufacturer": "Toyota", "color": "#ffffff"},
]

def telemetry_simulator():
    states = {d['id']: {
        'speed': 185.0,
        'lap_dist': random.random(),
        'pit_status': False,
        'fuel': 100
    } for d in drivers_list}

    while True:
        time.sleep(0.1)
        if race_state["isMaintenance"]:
            continue

        for d in drivers_list:
            d_id = d['id']
            curr = states[d_id]
            target_speed = 185 if race_state["flag"] == "Green" else 55
            curr['speed'] = curr['speed'] + (target_speed - curr['speed']) * 0.1 + (random.random() - 0.5) * 2
            curr['lap_dist'] = (curr['lap_dist'] + (curr['speed'] / 10000)) % 1.0
            curr['fuel'] = max(0, curr['fuel'] - 0.001)
            
            if curr['fuel'] < 20 and not curr['pit_status']:
                curr['pit_status'] = True
            if curr['pit_status']:
                curr['speed'] = 45
                curr['fuel'] += 2
                if curr['fuel'] >= 100:
                    curr['pit_status'] = False

            payload = {
                "car": d['number'],
                "driver": d['name'],
                "telemetry": {
                    "speed": round(curr['speed'], 1),
                    "rpm": int((curr['speed']/200) * 9000),
                    "throttle": 100 if curr['speed'] < target_speed else 70,
                    "brake": 0 if curr['speed'] > target_speed - 5 else 40,
                    "gear": 4 if curr['speed'] > 100 else 2,
                    "fuel": round(curr['fuel'], 1),
                    "lapDistPct": curr['lap_dist'],
                    "pitStatus": curr['pit_status'],
                    "tires": {"fl": 210, "fr": 215, "rl": 205, "rr": 208},
                    "gForce": {"lat": 1.2 if curr['speed'] > 150 else 0.4, "long": 0.1}
                },
            }
            socketio.emit("telemetry", payload)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login/discord")
def login_discord():
    scope = "identify email"
    auth_url = f"{DISCORD_AUTH_URL}?client_id={DISCORD_CLIENT_ID}&redirect_uri={DISCORD_REDIRECT_URI}&response_type=code&scope={scope}"
    return redirect(auth_url)

@app.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return redirect("/")

    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    
    try:
        r = requests.post(DISCORD_TOKEN_URL, data=data, headers=headers, timeout=10)
        token_data = r.json()
        
        if 'access_token' not in token_data:
            return redirect("/")
            
        access_token = token_data['access_token']
        user_r = requests.get("https://discord.com/api/users/@me", headers={'Authorization': f"Bearer {access_token}"}, timeout=10)
        user_info = user_r.json()
        
        session['user'] = {
            'id': user_info.get('id'),
            'username': user_info.get('username'),
            'avatar': f"https://cdn.discordapp.com/avatars/{user_info['id']}/{user_info['avatar']}.png" if user_info.get('avatar') else f"https://cdn.discordapp.com/embed/avatars/{int(user_info.get('id', 0)) % 5}.png",
            'isManager': True 
        }
    except Exception as e:
        print(f"OAuth Error: {e}")
    
    return redirect(url_for('dashboard'))

@app.route("/dashboard")
def dashboard():
    if 'user' not in session:
        return redirect(url_for('index'))
    return f"<h1>Welcome to the Pits, {session['user']['username']}!</h1>"

@app.route("/api/user")
def get_user():
    user_data = session.get('user')
    response_data = {"user": user_data}
    return Response(
        json.dumps(response_data),
        mimetype='application/json'
    )

@app.route("/logout")
def logout():
    session.pop('user', None)
    return redirect("/")

@app.route("/<path:path>")
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

@socketio.on('connect')
def handle_connect():
    emit('sync_race_state', race_state)

@socketio.on('update_flag')
def handle_flag(data):
    race_state["flag"] = data["flag"]
    socketio.emit('sync_race_state', race_state)

@socketio.on('toggle_maintenance')
def handle_maintenance(data):
    race_state["isMaintenance"] = data["value"]
    socketio.emit('sync_race_state', race_state)

if __name__ == "__main__":
    sim_thread = threading.Thread(target=telemetry_simulator, daemon=True)
    sim_thread.start()
    socketio.run(app, host="0.0.0.0", port=PORT)
