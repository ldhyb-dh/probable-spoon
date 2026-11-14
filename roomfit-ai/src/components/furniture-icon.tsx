import type {FurnitureKind} from '@/lib/furniture-types';

// Each drawing is a small furniture silhouette; labels remain available beside it.
export function FurnitureIcon({kind}:{kind:FurnitureKind}) {
 const shapes:Partial<Record<FurnitureKind,React.ReactNode>>={
  bed:<><path d="M4 14V7M4 21v5M28 21v5M4 20h24v-6H4zM4 17h24M7 14V9h7v5M14 11h10a4 4 0 0 1 4 4"/></>,
  chair:<><rect x="9" y="4" width="14" height="12" rx="2"/><path d="M7 20h18v4H7zM9 24v4M23 24v4M10 16v4M22 16v4"/></>,
  sofa:<><path d="M6 15V9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6M6 13a3 3 0 0 0-3 3v7h26v-7a3 3 0 0 0-6 0v2H9v-2a3 3 0 0 0-3-3ZM7 23v3M25 23v3M16 6v12"/></>,
  desk:<><path d="M4 12h24v4H4zM7 16v11M25 16v11M19 16v5h6"/><path d="M21 18h2"/></>,
  wardrobe:<><rect x="7" y="3" width="18" height="25" rx="1"/><path d="M16 3v25M13 14v3M19 14v3M9 28v2M23 28v2"/></>,
  bookshelf:<><rect x="6" y="3" width="20" height="25" rx="1"/><path d="M6 11h20M6 19h20M10 5v5M13 6v4M20 13v5M23 14v4M10 21v5M14 22v4"/></>,
  drawer:<><rect x="6" y="4" width="20" height="23" rx="2"/><path d="M6 12h20M6 20h20M13 8h6M13 16h6M13 24h6M9 27v2M23 27v2"/></>,
  'shoe-cabinet':<><rect x="5" y="5" width="22" height="22" rx="1"/><path d="M5 12h22M5 19h22M12 8h8M12 15h8M12 22h8M8 27v2M24 27v2"/></>,
  hanger:<><path d="M5 28h22M9 28V6h14v22M6 6h20M13 7v3l-4 4 7 3 7-3-4-4V7M16 10v1"/></>,
  table:<><ellipse cx="16" cy="10" rx="11" ry="4"/><path d="M5 10v3c0 2 5 4 11 4s11-2 11-4v-3M10 16v11M22 16v11"/></>,
  tv:<><rect x="3" y="5" width="26" height="17" rx="2"/><path d="M13 22v4M19 22v4M9 27h14"/></>,
  fridge:<><rect x="7" y="3" width="18" height="26" rx="2"/><path d="M7 13h18M11 7v3M11 17v5"/></>,
  sink:<><path d="M4 12h24v16H4zM10 12V8a4 4 0 0 1 8 0v1M8 16h16a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5ZM7 24h18"/></>,
  'dining-table':<><path d="M6 13h20v4H6zM9 17v11M23 17v11M4 8v6M2 8h4M28 8v6M26 8h4M11 6h10"/><circle cx="16" cy="10" r="2"/></>,
  stove:<><rect x="5" y="5" width="22" height="23" rx="2"/><path d="M5 21h22M10 25h2M15 25h2M20 25h2"/><circle cx="11" cy="12" r="3"/><circle cx="21" cy="12" r="3"/></>,
  washer:<><rect x="5" y="3" width="22" height="26" rx="2"/><path d="M5 9h22M9 6h2M23 6h1"/><circle cx="16" cy="19" r="6"/><path d="M12 20c3-3 5 3 8-1"/></>,
  microwave:<><rect x="3" y="7" width="26" height="19" rx="2"/><rect x="6" y="10" width="15" height="12" rx="1"/><path d="M24 11v5M24 20h1M7 28h3M22 28h3"/></>,
  custom:<><circle cx="16" cy="16" r="11"/><path d="M16 10v12M10 16h12"/></>
 };
 return <svg aria-hidden="true" className="furniture-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{shapes[kind]}</svg>;
}
