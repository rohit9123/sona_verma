const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.set("views", "views");
class Restro {
  constructor(g, a, f, r, n, p) {
    this.gender = g;
    this.age = a;
    this.food = f;
    this.rating = r;
    this.name = n;
    this.pricing = p;
  }
}
var processor;
class Processor {
  constructor(src) {
    this.list = new Map();
    let fs = require("fs");
    let g, a, f, r, n, p;
    let data = fs.readFileSync(src).toString();
    const lines = data.split("\n").slice(1);
    for (let line of lines) {
      const words = line.split(",");
      if (words.length != 7) continue;
      g = words[1].charAt(0);
      a = parseInt(words[2]);
      f = words[3].toLowerCase();
      r = parseFloat(words[4]);
      n = words[5];
      p = parseFloat(words[6]);
      if (!this.list.has(f)) this.list.set(f, new Array());
      this.list.get(f).push(new Restro(g, a, f, r, n, p));
    }
  }
  findMatch(age, gender, food, rating, pricing) {
    let food_type;
    if (this.list.has(food)) food_type = this.list.get(food);
    else food_type = [];
    let ar = [];
    let score = 0;
    for (let r of food_type) {
      score = 0;
      if (Math.abs(r.pricing - pricing) < 200) score++;
      if (Math.abs(r.age - age) < 5) score++;
      if (r.gender == gender) score++;
      if (Math.abs(r.rating - rating) < 1) score++;
      ar.push([score, r]);
    }
    ar.sort((x, y) => {
      if (x[0] != y[0]) return y[0] - x[0];
      return y[1].rating - x[1].rating;
    });
    let ret = [];
    for (let i = 0, size = ar.length; i <= 5 && i < size; i++)
      ret.push(ar[i][1]);
    console.log(ret);
    return ret;
  }
}

// console.log("Here");
function ShowMatch(age, gender, food, rating, pricing) {
  // console.log(processor.findMatch(20, "M", "traditional food", 4.1, 900));
  console.log(age, gender, food, rating, pricing);
  const res = processor.findMatch(age, gender, food, rating, pricing);
  return res;
}

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/search", (req, res) => {
  const age = parseInt(req.body.Age);
  const gender = req.body.gender;
  const rating = parseFloat(req.body.Rating);
  const food = req.body.foodType.toLowerCase();
  const pricing = parseFloat(req.body.Pricing);
  const data = ShowMatch(age, gender, food, rating, pricing);
  res.render("result.ejs", { data: data });
});

app.listen(3003, () => {
  processor = new Processor("restro.csv");
  console.log(processor);
});
