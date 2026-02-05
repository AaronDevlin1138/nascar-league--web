
import React from 'react';
import { RaceEvent } from './types';

export const TRACK_THEMES: Record<string, { primary: string, accent: string, bg: string }> = {
  'Daytona': { primary: '#0047AB', accent: '#FFD700', bg: 'bg-gradient-to-br from-blue-900 via-black to-blue-950' },
  'Pocono': { primary: '#B22222', accent: '#FFFFFF', bg: 'bg-gradient-to-br from-red-950 via-black to-zinc-900' },
  'Charlotte': { primary: '#FF8C00', accent: '#000000', bg: 'bg-gradient-to-br from-orange-950 via-black to-zinc-950' },
  'Talladega': { primary: '#228B22', accent: '#FFD700', bg: 'bg-gradient-to-br from-green-950 via-black to-zinc-900' },
  'Default': { primary: '#DC2626', accent: '#FFFFFF', bg: 'bg-black' }
};

export const TCR_PC_SCHEDULE: RaceEvent[] = [
  { name: "The Clash", track: "Daytona Road", date: "Feb 4", isExhibition: true, themeColor: '#0047AB' },
  { name: "Daytona 500", track: "Daytona", date: "Feb 18", themeColor: '#0047AB' },
  { name: "Pocono 400", track: "Pocono", date: "Feb 25", themeColor: '#B22222' },
  { name: "Coca-Cola 600", track: "Charlotte", date: "Mar 11", themeColor: '#FF8C00' },
];
