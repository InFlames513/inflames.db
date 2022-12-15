declare module "inflames.db" {
  class Database {
  constructor();
  private addSubtract;
  private setArray;
  private math;
  public all(): [{ id: string, value: any }];
  public get(key: string | number): any;
  public fetch(key: string | number): any;
  public set(key: string, value: any): boolean;
  public has(key: string): boolean;
  public delete(key: string): boolean;
  public deleteAll(): boolean;
  public add(key: string, value: number): number;
  public sub(key: string, value: number): number;
  public push(key: string, value: any | any[]): [];
  public pull(key: string, value: any | any[] | ((data: any) => boolean)): [];
}
export function bson(): Database
export function sqlite(): Database
}