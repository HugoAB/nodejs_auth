const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config({ path: './.env' });

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.set("view engine", "hbs");

db.connect((err) => {
  if(err) {
    console.log(err);
  } else {
    console.log("DB connected");
  }
})

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("App running on port 3000");
});
