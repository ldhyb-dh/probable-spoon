export type FurnitureKind='bed'|'desk'|'wardrobe'|'sofa'|'table'|'chair'|'fridge'|'sink'|'washer'|'microwave'|'tv'|'bookshelf'|'drawer'|'shoe-cabinet'|'hanger'|'dining-table'|'stove'|'custom';
export type FurnitureItem={id:string;kind:FurnitureKind;name:string;width:number;depth:number;x:number;y:number;rotation:number};
export type FurniturePoint={x:number;y:number};
export type FurniturePreset={kind:FurnitureKind;name:string;width:number;depth:number;icon:string;category:string};
