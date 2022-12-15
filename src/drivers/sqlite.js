const database = require('better-sqlite3');
const lodash = require("lodash");

class Database {
  constructor(type) {
    if(type === "sqlite")
    this.table = "inflames";
    this.db = database('inflames.db');
    this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.table} (ID TEXT, json TEXT)`).run();
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

    let row;
    if(key.includes(".")) {
      let keySplit = key.split(".")
      key = keySplit[0]
      row = this.db.prepare(`SELECT json FROM ${this.table} WHERE ID = @key`).get({ key });
      row = lodash.get(row ? JSON.parse(row?.json) : {}, keySplit.slice(1).join("."));
      return row != null ? !isNaN(row) ? parseInt(row) : row : null;
    };

    row = this.db.prepare(`SELECT json FROM ${this.table} WHERE ID = @key`).get({ key });
    return row != null ? !isNaN(row.json) ? parseInt(row.json) : JSON.parse(row.json) : null;
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
   * @returns {[{ id: string, value: any }]} Returns true after the operation is complete.
   * @example
   * db.all();
   */
  all() {
    const all = this.db.prepare(`SELECT * FROM ${this.table}`);
    const data = [];
    for (const row of all.iterate()) {
        data.push({
            ID: row.ID,
            value: !isNaN(row.json) ? parseInt(row.json) : JSON.parse(row.json),
        });
    }
    return data;
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
    
    key = key.split(".");
    let valueSet;
    if(key.length > 1) valueSet = lodash.set(this.get(key[0]) ? this.get(key[0]) : {}, key.slice(1).join("."), value);
    else valueSet = value;
    
    let exists = this.get(key[0]);
    exists == 0 ? exists = true : ""
    if(exists) this.db.prepare(`UPDATE ${this.table} SET json = (?) WHERE ID = (?)`).run(JSON.stringify(valueSet), key[0]);
    else this.db.prepare(`INSERT INTO ${this.table} (ID,json) VALUES (?,?)`).run(key[0], JSON.stringify(valueSet));
    return value;
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
    this.db.prepare(`DELETE FROM ${this.table} WHERE ID=@key`).run({
      key,
    });
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
    if(key == null) throw new Error("Missing first argument (value)");
    this.db.prepare(`DELETE FROM ${this.table} WHERE json=@value`).run({
      value,
    });
    return true;
  }

    /**
   * Deletes all data.
   * @returns {true} Returns true after datas is deleted.
   * @example
   * db.delerAll();
   */
  deleteAll() {
    this.db.prepare(`DELETE FROM ${this.table}`).run();
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
    let arr = this.get(key.split(".")[0]) ?? [];
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
    let arr = this.get(key.split(".")[0]) ?? [];
    arr = arr.filter(x => {
     return Array.isArray(value) ? !value.includes(x) : JSON.stringify(x) !== JSON.stringify(value)
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