# inflames.db

inflames.db, açık kaynak kodlu sqlite database modülüdür bir database dosyasında olması 
gereken tüm özellikleri barındırmaktadır ve her geçen gün dahada geliştirilmektedir.

## Kurulum

Modülü kurmak için öncelikle konsola aşağıdaki kodu girin.

```shell
> npm i inflames.db@latest
```

Modül kurulunca db'yi kullanacağınız dosyanıza aşağıdaki kodu ekleyin.

Sqlite için:
```javascript
const db = require("inflames.db").sqlite();
```

Bson için:
```javascript
const db = require("inflames.db").bson();
```

Paket otomatik olarak `inflames.db` dosyası oluşturacak verileriniz bu dosyaya kayıt edilecek.

## Fonksiyonlar

Veri kaydı:
```javascript
  db.set("prefix", "!") //true
```

Veri çağırma:
```javascript
  db.get("prefix") //"!"
  db.fetch("prefix") //"!"
  db.all() // [ { ID: 'prefix', value: "!" } ]
```

Array işlemleri:
```javascript
    db.push("prefix", ["!", "."]) //["!", "."]
    db.pull("prefix", ".") //["!"]
```

Veri kontrol:
```javascript
   db.has("prefix") //true
   db.has("prefix") //true
```
    
Toplama-Çıkarma:
```javascript
    db.add("sayı", 50) //50
    db.sub("sayı", 10) //40
```

Veri silme:
```javascript
    db.delete('prefix') //true [Bulunan veriyi siler]
    db.deleteValue("!") //true [Veriler arasından ayarlanan değere sahip verileri siler]
    db.deleteAll() //true [Bütün verileri siler]
```

## Destek

Desteğe ihtiyacınız olursa [destek sunucumuzu](https://discord.gg/mztsyWR3QU) ziyaret edebilirsiniz.
Eğer bana özelden ulaşmak isterseniz [web sitemi](https://inflames.fun/) ziyaret edebilirsiniz.

## inflames.db

Discord Adresim: InFlames#2005