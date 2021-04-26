const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/db.js');

const register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
      if(error) {
        console.log(error);
      }

      if(results.length > 0) {
        return res.render('register', {
          message: 'Email already exists'
        });
      } else if(password !== passwordConfirm) {
        return res.render('register', {
          message: 'Passwords do not match'
        });
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      db.query("INSERT INTO users SET ?", {name: name, email: email, password: hashedPassword}, (error, results) => {
        if(error) {
          console.log(error);
        } else {
          console.log(results);
          return res.render('register', {
            message: 'User registered'
          });
        }
      })
    });
}


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(400).render('login', {
        message: "Email and Password are required"
      });
    }

    db.query("SELECT name, email, password FROM users WHERE email = ?", [email], async (error, results) => {
      if(!results || !(await bcrypt.compare(password, results[0].password))) {
        return res.status(401).render("login", {
          message: "Email or password is incorrect"
        });
      } else {
        const id = results[0].id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie("jwt", token, cookieOptions);
        res.status(200).redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
    register,
    login
}
