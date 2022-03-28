const fs = require("fs");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const write = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 4));
const extension = (filePath) => {
  let parts = filePath.split(".");
  return parts[parts.length - 1];
};

class DB {
  constructor(file) {
    this.file = file || "database.json";
    if (this.file === "database.json") {
      try {
        load(this.file);
      } catch {
        write(this.file, {});
      }
    } else {
      if (!this.file.includes("./")) this.file = "./" + this.file;
      if (extension(this.file) !== "json")
        throw Error("[err] the database file must end with .json");
      try {
        load(this.file);
      } catch {
        write(this.file, {});
      }
    }
  }

  /*
    yaz => set
    db.set('prefix', '!')
    <DB>.yaz('prefix', '!')
    */

  yaz(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (değer === 0) {
      const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
      dosya[veri] = 0;
      return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
    }
    if (!değer) throw new TypeError("Bir değer belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    dosya[veri] = değer;
    return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
  }

  /*
    depola => push
    db.push('prefix')
    <DB>.depola('prefix')
    */

  depola(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir değer belirtilmedi!");
    let dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (dosya[veri] && Array.isArray(dosya[veri])) {
      dosya[veri].push(değer)
      fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1))
    } else if (!dosya[veri]) {
      this.yaz(veri, [değer])
    }
    return
  }

  /*
    pushsil => -
    <DB>.pushsil('prefix', ".")
    */

    pushsil(veri, pushdeğer) {
    if (!veri) throw Error("[err] No array to index/value delete")
    if (pushdeğer === undefined) throw Error("[err] No index/value to delete from the array")
    let dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri] && !Array.isArray(dosya[veri])) throw Error("[err] The array to index/value delete dosen't exist or it's not array")
    if (typeof pushdeğer === "number") {
      dosya[veri].splice(pushdeğer, 1)
      fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1))
      } else if(isNaN(pushdeğer)) {
        if(dosya[veri].includes(pushdeğer)) {
          dosya[veri].splice(dosya[veri].indexOf(pushdeğer), 1)
          fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1))
       } else { throw Error("[err] Unable to find a value with the provided index/value to delete"); }
      }
      return;
  }

  /*
    bul => fetch/get
    db.fetch('prefix')
    <DB>.bul('prefix')
    */

  bul(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) dosya[veri] = null;
    return dosya[veri];
  }

  /*
    kontrol => has
    db.has('prefix')
    <DB>.kontrol('prefix')
    */

  kontrol(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    return Boolean(dosya[veri]);
  }

  /*
    sil => delete/remove
    db.delete('prefix')
    <DB>.sil('prefix')
    */

  sil(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) throw new TypeError("Silinecek veri bulunamadı!");
    delete dosya[veri];
    return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
  }

  /*
    yedekle => backup
    db.backup('veri.json')
    <DB>.yedekle('veri')
    */

  yedekle(dosyaAdı) {
    if (!dosyaAdı) throw new TypeError("Bir Dosya Adı belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    return fs.writeFileSync(`${dosyaAdı}.json`, JSON.stringify(dosya, null, 1));
  }

  /*
    hepsi => all/fetchAll
    db.add('puan', 5)
    <DB>.topla('puan', 5)
    */

  hepsi() {
    return JSON.parse(fs.readFileSync("database.json", "utf8"));
  }

  /*
    topla => add
    db.add('puan', 5)
    <DB>.topla('puan', 5)
    */

  ekle(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir sayı değeri belirtilmedi!");
    if (typeof değer !== 'number') throw new TypeError("Değer olarak bir sayı giriniz!");
    if (!this.has(veri)) return this.yaz(veri, değer);
    if (typeof this.bul(veri) !== 'number') throw new TypeError("Girilen verinin bir sayı değeri yok!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (this.bul(veri) === 0) return this.yaz(veri, değer);
    dosya[veri] += değer
    return fs.writeFileSync(`database.json`, JSON.stringify(dosya, null, 1));
  }

  /*
      topla => add
      db.add('puan', 5)
      <DB>.topla('puan', 5)
      */

  topla(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir sayı değeri belirtilmedi!");
    if (typeof değer !== 'number') throw new TypeError("Değer olarak bir sayı giriniz!");
    if (!this.has(veri)) return this.yaz(veri, değer);
    if (typeof this.bul(veri) !== 'number') throw new TypeError("Girilen verinin bir sayı değeri yok!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (this.bul(veri) === 0) return this.yaz(veri, değer);
    dosya[veri] += değer
    return fs.writeFileSync(`database.json`, JSON.stringify(dosya, null, 1));
  }

  /*
    çıkar => substr
    db.substr('puan', 5)
    <DB>.çıkar('puan', 5)
    */

  çıkar(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir sayı değeri belirtilmedi!");
    if (typeof değer !== 'number') throw new TypeError("Değer olarak bir sayı giriniz!");
    if (!this.has(veri)) return this.yaz(veri, değer);
    if (typeof this.bul(veri) !== 'number') throw new TypeError("Girilen verinin bir sayı değeri yok!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (this.bul(veri) === 0) return this.yaz(veri, -değer);
    dosya[veri]-= değer
    return fs.writeFileSync(`database.json`, JSON.stringify(dosya, null, 1));
  }

  /*
    sıfırla => -
    <DB>.sıfırla()
    */

  sıfırla() {
    return fs.writeFileSync("database.json", JSON.stringify({}, null, 1));
  }
  /*
    yaz => set
    db.set('prefix', '!')
    <DB>.yaz('prefix', '!')
    */

  set(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (değer === 0) {
      const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
      dosya[veri] = 0;
      return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
    }
    if (!değer) throw new TypeError("Bir değer belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    dosya[veri] = değer;
    return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
  }

  /*
    depola => push
    db.push('prefix')
    <DB>.depola('prefix')
    */

  push(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir değer belirtilmedi!");
    let dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (dosya[veri] && Array.isArray(dosya[veri])) {
      dosya[veri].push(değer)
      fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1))
    } else if (!dosya[veri]) {
      this.yaz(veri, [değer])
    }
    return
  }

  /*
    bul => fetch/get
    db.fetch('prefix')
    <DB>.bul('prefix')
    */

  fetch(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) dosya[veri] = null;
    return dosya[veri];
  }

  get(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) dosya[veri] = null;
    return dosya[veri];
  }

  /*
    kontrol => has
    db.has('prefix')
    <DB>.kontrol('prefix')
    */

  has(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    return Boolean(dosya[veri]);
  }

  /*
    sil => delete/remove
    db.delete('prefix')
    <DB>.sil('prefix')
    */

  delete(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) throw new TypeError("Silinecek veri bulunamadı!");
    delete dosya[veri];
    return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
  }

  remove(veri) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (!dosya[veri]) throw new TypeError("Silinecek veri bulunamadı!");
    delete dosya[veri];
    return fs.writeFileSync("database.json", JSON.stringify(dosya, null, 1));
  }

  /*
    yedekle => backup
    db.backup('veri.json')
    <DB>.yedekle('veri')
    */

  backup(dosyaAdı) {
    if (!dosyaAdı) throw new TypeError("Bir Dosya Adı belirtilmedi!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    return fs.writeFileSync(`${dosyaAdı}.json`, JSON.stringify(dosya, null, 1));
  }

  /*
    hepsi => all/fetchAll
    db.add('puan', 5)
    <DB>.topla('puan', 5)
    */

  all() {
    return JSON.parse(fs.readFileSync("database.json", "utf8"));
  }

  fetchAll() {
    return JSON.parse(fs.readFileSync("database.json", "utf8"));
  }

  /*
    topla => add
    db.add('puan', 5)
    <DB>.topla('puan', 5)
    */

  add(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir sayı değeri belirtilmedi!");
    if (typeof değer !== 'number') throw new TypeError("Değer olarak bir sayı giriniz!");
    if (!this.has(veri)) return this.yaz(veri, değer);
    if (typeof this.bul(veri) !== 'number') throw new TypeError("Girilen verinin bir sayı değeri yok!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (this.bul(veri) === 0) return this.yaz(veri, değer);
    dosya[veri] += değer
    return fs.writeFileSync(`database.json`, JSON.stringify(dosya, null, 1));
  }

  /*
    çıkar => substr
    db.substr('puan', 5)
    <DB>.çıkar('puan', 5)
    */

  substr(veri, değer) {
    if (!veri) throw new TypeError("Bir veri belirtilmedi!");
    if (!değer) throw new TypeError("Bir sayı değeri belirtilmedi!");
    if (typeof değer !== 'number') throw new TypeError("Değer olarak bir sayı giriniz!");
    if (!this.has(veri)) return this.yaz(veri, -değer);
    if (typeof this.bul(veri) !== 'number') throw new TypeError("Girilen verinin bir sayı değeri yok!");
    const dosya = JSON.parse(fs.readFileSync("database.json", "utf8"));
    if (this.bul(veri) === 0) return this.yaz(veri, değer);
    dosya[veri] -= değer
    return fs.writeFileSync(`database.json`, JSON.stringify(dosya, null, 1));
  }
}

module.exports = new DB();