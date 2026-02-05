
export interface User {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  email?: string;
  phone?: string;
  dob?: string;
  steamId?: string;
  isManager?: boolean;
  isDriver?: boolean;
}

export interface PerformanceMetric {
  type: 'CORRECT' | 'WRONG' | 'INFO';
  message: string;
  timestamp: number;
}

export interface Telemetry {
  rpm: number;
  speed: number;
  gear: number;
  throttle: number;
  brake: number;
  fuel: number;
  lastLap: string;
  incidents: number;
  lapDistPct: number;
  pitStatus: boolean;
  gForce: { lat: number; long: number; };
  tires: { fl: number; fr: number; rl: number; rr: number; };
}

export interface Driver {
  id: string;
  name: string;
  number: string;
  manufacturer: 'Chevy' | 'Ford' | 'Toyota' | 'Custom';
  color: string;
  gap: string;
  position: number;
  status: 'Pit' | 'Active' | 'Out';
  telemetry?: Telemetry;
  logoUrl?: string;
  steamId?: string;
  streamUrl?: string;
  teamName?: string;
  bio?: string;
  hometown?: string;
}

export interface RaceEvent {
  name: string;
  track: string;
  date: string;
  isExhibition?: boolean;
  themeColor?: string;
}

export interface RaceStats {
  lap: number;
  totalLaps: number;
  flag: 'Green' | 'Yellow' | 'Red' | 'White' | 'Checkered';
  trackTemp: string;
  airTemp: string;
  sessionStatus: string;
  currentEvent?: RaceEvent;
  isMaintenance?: boolean;
}

export interface NBAScore {
  id: string;
  homeTeam: { name: string; score: string; logo: string; short: string; record?: string; };
  awayTeam: { name: string; score: string; logo: string; short: string; record?: string; };
  status: string;
  isLive: boolean;
}

export interface SportsFeed {
  nba: NBAScore[];
  ncaa: any[];
  nflNews: string[];
  nbaDraftOrder: string[];
}
