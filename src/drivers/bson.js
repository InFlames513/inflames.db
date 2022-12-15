const BSON = require('bson');
const fs = require("node:fs");
const lodash = require("lodash");

class Database {
  constructor() {
    this.write = txt => fs.writeFileSync(this.file, txt, 'utf8', () => {});
    this.file = "inflames.bson";
    try {
        this.database = BSON.deserialize(fs.readFileSync(this.file));
    } catch (e) {
        this.write("")
        this.database = {};
    }
  }


  math(key, value, sub = false) {
    if(value == null) throw new Error("İkinci bağımsız değişken 'value' eksik");
    if(typeof value != "number") throw new Error("İkinci bağımsız değişken 'sayı' türünde olmalıdır");
    let number = this.get(key);
    if(number == null) number = 0;
    if(typeof number != "number") throw new Error("First argument must be of type 'number'");
    sub ? number -= parseFloat(value) : number += parseFloat(value);
    this.set(key, number);
    return true;
  }

  setArray(value) {
    if(!Array.isArray(value)) return [value];
    else return value;
  }

  /**
   * Allows you to pull data from database.
   * @param {string | number} key The key to which the data is registered.
   * @returns {any} Data.
   * @example
   * db.get("prefix");
   */
  get(key) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    let row = lodash.get(this.database, key);
    return row;
  }

  /**
   * Allows you to pull data from database.
   * @param {string | number} key The key to which the data is registered.
   * @returns {any} Data.
   * @example
   * db.fetch("prefix");
   */
  fetch(key) {
    return this.get(key);
  }
  
  /**
   * Creates a new data record in the database file or overwrites the already existing data.
   * @param {string} key Data key to save.
   * @param {any} value Data to be saved.
   * @returns {true} Returns true after the operation is complete.
   * @example
   * db.set("prefix", "!");
   */
  set(key, value) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    if(value == null) throw new Error("Missing second argument (value)");
    
    lodash.set(this.database, key, value);
    this.write(BSON.serialize(this.database));
    return true;
  }
  
  /**
   * Creates a new data record in the database file or overwrites the already existing data.
   * @returns {[{ id: string, value: any }]} Returns true after the operation is complete.
   * @example
   * db.all();
   */
  all() {
    return Object.entries(BSON.deserialize(fs.readFileSync(this.file))).map(([ID, value]) => {
      return { ID, value };
    });
  }

  /**
   * Key value deletes entered data.
   * @param {string | number} key Data key to be deleted.
   * @returns {true} Returns true after data is deleted.
   * @example
   * db.delete("prefix");
   */
  delete(key) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    lodash.unset(this.database, key);
    return true;
  }

  /**
   * Deletes data whose value matches the entered value.
   * @param {any} value Data value to be deleted.
   * @returns {true} Returns true after data is deleted.
   * @example
   * db.deleteValue("!");
   */
  deleteValue(value) {
    if(value == null) throw new Error("Missing first argument (value)");

    this.all().filter(x => x.value === value).forEach(x => lodash.unset(this.database, x.ID));
    this.write(BSON.serialize(this.database));
    return true;
  }

  /**
   * Deletes all data.
   * @returns {true} Returns true after datas is deleted.
   * @example
   * db.delerAll();
   */
  deleteAll() {
    this.database = {};
    this.write(BSON.serialize(this.database));
    return true;
  }

  /**
   * Checks whether the searched data exists in the database.
   * @param {string | number} key Data to check.
   * @returns {boolean} Returns true if data exists, false otherwise.
   * @example
   * db.has("prefix");
   */
  has(key) {
    if(key == null) throw new Error("Missing first argument (key)");
    const exists = this.get(key);
    return exists ? true : false;
  }

  /**
   * Adds a new element to the array in the database, and creates new array if the array is not found.
   * @param {string | number} key Data key to add new element.
   * @param {any | Array} value Element to be added.
   * @returns {Array} The new value of the data whose key is entered.
   * @example
   * db.push("prefix", ["!", "."]);
   */
  push(key, value) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    if(value == null) throw new Error("Missing second argument (value)");

    let arr = this.get(key) ?? [];
    arr = this.setArray(arr)
    if(Array.isArray(value)) arr = arr.concat(value);
    else arr.push(value);
    this.set(key, arr);
    return arr;
  }

  /**
   * Deletes an element from the array whose key value is entered.
   * @param {string | number} key The data key from which the element will be deleted.
   * @param {any} value Element to be deleted.
   * @returns {Array} The new value of the data whose key is entered.
   * @example
   * db.pull("prefix", "!");
   */
  pull(key, value) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    if(value == null) throw new Error("Missing second argument (value)");
    let arr = this.get(key) ?? [];
    arr = arr.filter(x => {
     return Array.isArray(value) ? !value.includes(x) : JSON.stringify(x) !== JSON.stringify(value);
    });
    this.set(key, arr);
    return arr;
  }

  /**
   * Adds number to key value entered data.
   * @param {string | number} key Data key to add number.
   * @param {number} value number to be added.
   * @returns {true} Returns true after data is added.
   * @example
   * db.add("prefixs", 10);
   */
  add(key, value) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    if(value == null) throw new Error("Missing second argument (value)");
    return this.math(key, value);
  }

  /**
   * Key value subtract entered number from entered data.
   * @param {string | number} key Data key to subtract number.
   * @param {number} value number to be subtract.
   * @returns {true} Returns true after data is subtract.
   * @example
   * db.sub("prefixs", 10);
   */
  sub(key, value) {
    if(key == null) throw new Error("Missing first argument (key)");
    if(typeof key != "string") throw new Error("First argument (key) needs to be a string");
    if(value == null) throw new Error("Missing second argument (value)");
    return this.math(key, value, true);
  }

}

module.exports = new Database();