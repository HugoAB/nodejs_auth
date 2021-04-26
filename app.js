const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

dotenv.config({ path: './.env' });

// DB connection
const db = require('./db/db.js');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

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

// Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log("App running on port 3000");
});
