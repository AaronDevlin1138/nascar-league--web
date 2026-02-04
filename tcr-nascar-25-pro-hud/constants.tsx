
import React from 'react';
import { Driver, RaceEvent } from './types';

export const MANUFACTURER_ICONS = {
  Chevy: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
    </svg>
  ),
  Ford: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12 15.31 6 12 6Z" opacity="0.5" />
    </svg>
  ),
  Toyota: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L1 21H23L12 2M12 6L19.53 19H4.47L12 6Z" />
    </svg>
  ),
  Custom: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13,2.05C11.39,1.18 9.5,1 7.83,1.55L7,2V4.5L7.83,4C9.41,3.53 11.2,3.7 12.71,4.58C13.24,4.89 13.5,5.48 13.5,6V7H11V9H13.5V11H11V13H13.5V22H15.5V13H18V11H15.5V9H18V7H15.5V6C15.5,4.35 14.5,2.91 13,2.05Z" />
    </svg>
  )
};

export const TCR_PC_SCHEDULE: RaceEvent[] = [
  { name: "The Clash", track: "Daytona Road", date: "Feb 4", isExhibition: true },
  { name: "The Duals", track: "Daytona", date: "Feb 11", isExhibition: true },
  { name: "Daytona 500", track: "Daytona", date: "Feb 18" },
  { name: "Pocono 400", track: "Pocono", date: "Feb 25" },
  { name: "COTA Grand Prix", track: "COTA", date: "Mar 4" },
  { name: "Coca-Cola 600", track: "Charlotte", date: "Mar 11" },
  { name: "Las Vegas 400", track: "Las Vegas", date: "Mar 18" },
  { name: "Southern 500", track: "Darlington", date: "Mar 25" },
  { name: "Atlanta 400", track: "Atlanta", date: "Apr 1" },
  { name: "Bristol Night Race", track: "Bristol", date: "Apr 15" },
  { name: "Sonoma GP", track: "Sonoma", date: "Apr 22" },
  { name: "Brickyard 400", track: "Indianapolis", date: "Apr 29" },
  { name: "TCR 500", track: "Talladega", date: "May 6" },
  { name: "Watkins Glen GP", track: "Watkins Glen", date: "May 13" },
  { name: "Dover 400", track: "Dover", date: "May 20" },
  { name: "Martinsville Night", track: "Martinsville", date: "June 3" },
  { name: "Homestead Finale", track: "Homestead", date: "June 10" },
];
