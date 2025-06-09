const express = require("express");
const app = express();
const db = require("./models");
const session = require("express-session");

const PORT = 8080;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/static", express.static("static"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  }),
);
const indexRouter = require("./routes");
app.use("/", indexRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

app.post("/delete-account", async (req, res) => {
  const { password } = req.body;

  // 현재 로그인한 사용자 정보 가져오기 (예: req.session.userId)
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  // 사용자 비밀번호 확인 (예: 데이터베이스 조회)
  const user = await getUserById(userId); // 데이터베이스에서 사용자 정보 가져오기
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  // 탈퇴 처리 (예: 데이터베이스에서 사용자 삭제)
  await deleteUser(userId);

  // 세션 삭제 및 응답
  req.session.destroy(() => {
    res.status(200).send("탈퇴 완료");
  });
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("DB 연결 성공");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
