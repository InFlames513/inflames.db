declare module "inflames.db" {
    export class DB {
      constructor(file?: string);
      private file: string;
      public set(veri: string, değer: any): void;
      public push(veri: string, değer: any): void;
      public fetch(veri: string): any;
      public get(veri: string): any;
      public has(veri: string): boolean;
      public delete(veri: string): void;
      public remove(veri: string): void;
      public backup(veri: string, değer: any): void;
      public fetchAll(): object;
      public all(): object;
      public add(veri: string, değer: number): void;
      public substr(veri: string, değer: number): void;
      public yaz(veri: string, değer: any): void;
      public depola(veri: string, değer: any): void;
      public bul(veri: string): any;
      public kontrol(veri: string): boolean;
      public sil(veri: string): void;
      public yedekle(veri: string, değer: any): void;
      public hepsi(): object;
      public ekle(veri: string, değer: number): void;
      public topla(veri: string, değer: number): void;
      public çıkar(veri: string, değer: number): void;
      public sıfırla(): void;
      }
    }