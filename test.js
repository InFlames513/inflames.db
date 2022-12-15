const db = require("./index").sqlite();

db.all()

db.get("hello", "hi!")

db.set("obj", { sa: "as" });
db.set("arr", ["sa", "as", "mrb", "slm"]);
db.set("number", 0);
db.set("string", "sa");
db.set("boolean", false);

// db.add("obj", 4010)
// db.add("arr", 4010)
db.add("number", 4010);
// db.add("string", 4010)
// db.add("boolean", 4010)

// db.sub("obj", 2005)
// db.sub("arr", 2005)
db.sub("number", 2005);
// db.sub("string", 2005)
// db.sub("boolean", 2005)

db.push("obj", ["arr", "deleteArr"]);
db.push("arr", ["arr", "deleteArr"]);
db.push("number", ["arr", "deleteArr"]);
db.push("string", ["arr", "deleteArr"]);
db.push("boolean", ["arr", "deleteArr"]);

db.pull("obj", "deleteArr");
db.pull("arr", "deleteArr");
db.pull("number", "deleteArr");
db.pull("string", "deleteArr");
db.pull("boolean", "deleteArr");



console.log(
  db.get("obj"),
  db.get("arr"),
  db.get("number"),
  db.get("string"),
  db.get("boolean"),
  db.has("obj"),
  db.all(),
);
