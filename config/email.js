const nodemailer = require("nodemailer");
const { Email } = require("../models");

const smtpTransport = nodemailer.createTransport({
  pool: true,
  maxConnections: 1,
  service: "naver",
  host: "smtp.naver.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "wlsdnrhdwkd",
    pass: "LDNW5VEC8UW3",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

var generateRandomNumber = (min, max) => {
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random;
};

const emailAuth = async (req, res) => {
  console.log("emailAuth called");
  console.log("Request body:", req.body);

  const number = generateRandomNumber(111111, 999999);
  const { email } = req.body;

  const result = await Email.findOne({
    where: {
      userEmail: email,
    },
  });

  if (result) {
    console.log("이미 등록된 메일입니다.");
    res.send({ message: "이미 등록된 메일입니다" });
    return;
  }

  const mailOptions = {
    from: "wlsdnrhdwkd@naver.com",
    to: email,
    subject: "Fun pick 구독을 환영합니다",
    html: `<img src="https://i.imgur.com/03RyIN1.png">
           <p>자세한 사항은 <u>http://FunPick.com </u>에서 확인해보세요!</p>
           `,
  };

  smtpTransport.sendMail(mailOptions, async (err, response) => {
    if (err) {
      console.error("Error sending email:", err);
      res.json({ ok: false, msg: "메일 전송에 실패하였습니다." });
      return;
    } else {
      await Email.create({
        userEmail: email,
      });
      res.send({ message: "이메일 등록이 완료되었습니다!" });
    }
  });
};

module.exports = { smtpTransport, emailAuth };
