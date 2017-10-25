/*
  Redux store types -- if you have only one Redux store, this is the shape
  of your store state. Otherwise, each Redux store state should be a subset
  of this type (it exists to ensure consistent keys for shared domain logic).
*/
declare interface StoreT {
  count: number;
  name: string;
}
