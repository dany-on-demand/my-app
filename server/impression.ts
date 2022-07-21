import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.text());

const validatePw = (pw: string) => {
  // get database connection
  const db = [
    // "bongobongo"
    "n2Wy9v73H1eo/aicL9xb/wkt5coPXNLgKmbLqYx1ZDE=",
  ];
  // hash pw
  const hash = crypto.createHash("sha256").update(pw).digest("base64");
  console.log(hash);

  // check hash
  return hash === db[0];
};

app.post("/login", (req, res) => {
  console.log(req.body);
  const body = JSON.parse(req.body);

  let login = body.login;
  let pw = body.pw;

  if (login === "test@test.cz") {
    if (validatePw(pw)) res.json({ status: "ok" });
    else res.json({ status: "error", message: "password" }); // warning: security risk
  } else {
    res.json({ status: "error", message: "login" }); // warning: security risk
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
