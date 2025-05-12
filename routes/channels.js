// express 모듈 셋팅
const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    next();
  } else {
    return res.status(400).json(err.array());
  }
};

router
  .route("/")
  .get(
    [body("userId").notEmpty().isInt().withMessage("숫자 입력 필요"), validate],
    (req, res) => {
      let { userId } = req.body;
      const sql = "SELECT * FROM `channels` WHERE user_id = ?";
      conn.query(sql, userId, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) res.status(200).json(results);
        else
          res.status(404).json({
            message: "채널 정보를 찾을 수 없습니다.",
          });
      });
    }
  )
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("숫자 입력 필요"),
      body("name").notEmpty().isString().withMessage("문자 입력 필요"),
      validate,
    ],
    (req, res) => {
      const { name, userId } = req.body;
      const sql = "INSERT INTO channels (name, user_id) VALUES (?, ?)";
      const values = [name, userId];
      conn.query(sql, values, function (err, results) {
        if (err) return res.status(400).end();
        res.status(201).send(`${name}채널을 응원합니다.`);
      });
    }
  );

router
  .route("/:id")
  .get(
    [param("id").notEmpty().withMessage("채널ID 필요"), validate],
    (req, res) => {
      const id = parseInt(req.params.id);
      const sql = "SELECT * FROM `channels` WHERE id = ?";
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) res.status(200).json(results);
        else
          res.status(404).json({
            message: "채널 정보를 찾을 수 없습니다.",
          });
      });
    }
  )
  .put(
    [
      param("id").notEmpty().withMessage("채널ID 필요"),
      body("name").notEmpty().isString().withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      const id = parseInt(req.params.id);
      const { name } = req.body;

      const sql = "UPDATE channels SET name=? WHERE id=?";
      const values = [name, id];
      conn.query(sql, values, function (err, results) {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        if (results.affectedRows == 0) {
          res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )
  .delete(
    [param("id").notEmpty().withMessage("채널ID 필요"), validate],
    (req, res) => {
      const id = parseInt(req.params.id);
      const sql = "DELETE FROM channels WHERE id = ?";
      conn.query(sql, id, function (err, results) {
        if (err) {
          console.log(err);
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
