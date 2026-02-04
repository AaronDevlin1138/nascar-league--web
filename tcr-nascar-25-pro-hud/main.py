
import os
import time
import secrets
import random
import threading
from datetime import datetime
from flask import Flask, send_from_directory, send_file
from flask_socketio import SocketIO

# Configuration with Environment Variable Support
# Render provides the PORT variable automatically.
PORT = int(os.environ.get("PORT", 10000))
# Ensure you set a custom SECRET_KEY in Render's Environment Variables for persistent sessions.
SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(32)

app = Flask(__name__, static_folder='.', static_url_path='')
app.config["SECRET_KEY"] = SECRET_KEY

# Production SocketIO setup with eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

drivers_list = [
    {"name": "JOEY LOGANO", "number": "22", "id": 1, "manufacturer": "Ford", "color": "#facc15"},
    {"name": "KYLE BUSCH", "number": "8", "id": 2, "manufacturer": "Chevy", "color": "#ef4444"},
    {"name": "CHASE ELLIOTT", "number": "9", "id": 3, "manufacturer": "Chevy", "color": "#3b82f6"},
    {"name": "DENNY HAMLIN", "number": "11", "id": 4, "manufacturer": "Toyota", "color": "#ffffff"},
    {"name": "RYAN BLANEY", "number": "12", "id": 5, "manufacturer": "Ford", "color": "#f97316"},
]

def telemetry_simulator():
    """Simulator emitting telemetry at 10Hz to keep the HUD alive without iRacing connected."""
    states = {d['id']: {
        'speed': 185.0,
        'incidents': 0,
        'lap_dist': random.random(),
        'throttle': 100.0,
        'brake': 0.0,
        'gear': 4,
        'tires': {'fl': 210, 'fr': 215, 'rl': 205, 'rr': 208},
    } for d in drivers_list}

    while True:
        time.sleep(0.1)
        for d in drivers_list:
            d_id = d['id']
            curr = states[d_id]
            jitter = (random.random() - 0.5)
            curr['speed'] = max(110, min(198, curr['speed'] + jitter * 5))
            curr['lap_dist'] = (curr['lap_dist'] + (curr['speed'] / 3600)) % 1.0

            if random.random() < 0.001:
                socketio.emit("incident_alert", {
                    "driver": d['name'],
                    "id": d_id,
                    "car": d['number'],
                    "points": 4,
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

            payload = {
                "id": f"driver-{d_id}",
                "driver": d['name'],
                "car": d['number'],
                "telemetry": {
                    "speed": round(curr['speed'], 1),
                    "rpm": int(7000 + jitter * 1000),
                    "throttle": round(100 if curr['speed'] < 190 else 80 + jitter * 10, 1),
                    "brake": round(5 if curr['speed'] > 195 else 0, 1),
                    "gear": 4 if curr['speed'] > 150 else 3,
                    "incidents": curr['incidents'],
                    "lapDistPct": round(curr['lap_dist'], 4),
                    "tires": {k: round(v + jitter * 2, 1) for k, v in curr['tires'].items()},
                    "gForce": {"lat": round(jitter * 1.5, 2), "long": round(jitter * 0.8, 2)}
                },
            }
            socketio.emit("telemetry", payload)

@app.route("/")
def serve_index():
    return send_file("index.html")

@app.route("/<path:path>")
def static_proxy(path):
    # This ensures CSS/JS and other assets are served correctly from the root
    return send_from_directory(".", path)

if __name__ == "__main__":
    # Start simulator in a background thread
    sim_thread = threading.Thread(target=telemetry_simulator, daemon=True)
    sim_thread.start()
    
    # Use the PORT environment variable for local testing or production
    socketio.run(app, host="0.0.0.0", port=PORT)
