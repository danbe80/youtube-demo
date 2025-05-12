const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const conn = require("../mariadb");

// jwt module
const jwt = require("jsonwebtoken");

// dotenv module
require("dotenv").config();

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    next();
  } else {
    return res.status(400).json(err.array());
  }
};

// 로그인
router.post(
  "/login",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 입력 필요"),
    validate,
  ],
  (req, res) => {
    const { email, password } = req.body;

    let sql = "SELECT * FROM `users` WHERE email = ?";
    conn.query(sql, email, function (err, results) {
      let loginUser = results[0];
      if (err) {
        return res.status(400).end();
      }
      if (loginUser && loginUser.password == password) {
        // token 발급
        const token = jwt.sign(
          {
            email: loginUser.email,
            name: loginUser.name,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m",
            issuer: "hyerin",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json({
          message: `로그인 되었습니다. 어서오세요. ${loginUser.name}님`,
        });
      } else {
        res.status(403).json({
          message: "이메일 또는 비밀번호가 틀렸습니다.",
        });
      }
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("name").notEmpty().isString().withMessage("이름 필요"),
    body("password").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    body("contact").isString().withMessage("연락처 확인 필요"),
    validate,
  ],
  (req, res) => {
    const { email, name, password, contact } = req.body;

    let sql =
      "INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)";
    let values = [email, name, password, contact];
    conn.query(sql, values, function (err, results) {
      if (err) {
        return res.status(400).end();
      }
      res.status(201).send(`${name}님, 환영합니다.`);
    });
  }
);

router
  .route("/users")
  .get(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;

      let sql = "SELECT * FROM `users` Where email = ?";
      conn.query(sql, email, function (err, results) {
        if (err) {
          return res.status(400).end();
        }
        res.status(200).json(results);
      });
    }
  )
  .delete(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;

      let sql = "DELETE FROM users WHERE email = ?";
      conn.query(sql, email, function (err, results) {
        if (err) {
          return res.status(400).end();
        }
        if (results.affectedRows == 0) {
          res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

module.exports = router;
