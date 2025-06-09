document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginForm = event.target;

    if (!loginForm.checkValidity()) {
      loginForm.reportValidity();
      return;
    }

    try {
      const response = await axios.post("/login", {
        userId: loginForm.userId.value,
        userPw: loginForm.userPw.value,
      });
      if (response.data) {
        alert("로그인 성공");
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
      loginForm.reset();
    }
  });
