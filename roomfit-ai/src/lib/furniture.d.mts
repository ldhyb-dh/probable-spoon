import type {FurnitureItem,FurniturePoint,FurniturePreset} from './furniture-types';
export const furniturePresets:FurniturePreset[];
export function furnitureCorners(item:FurnitureItem):FurniturePoint[];
export function validFurniture(item:FurnitureItem):boolean;
export function pointInside(point:FurniturePoint,outline:FurniturePoint[]):boolean;
export function fitsRoom(item:FurnitureItem,outline:FurniturePoint[]):boolean;
export function furnitureOverlap(a:FurnitureItem,b:FurnitureItem):boolean;
export function furnitureIssues(item:FurnitureItem,items:FurnitureItem[],outline:FurniturePoint[]):string[];
export function reflectFurniture(items:FurnitureItem[],axis:'horizontal'|'vertical',outline:FurniturePoint[]):FurnitureItem[];
