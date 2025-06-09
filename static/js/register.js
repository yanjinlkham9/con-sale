async function checkDuplication() {
  const userIdInput = document.getElementById("userId");
  const idDuplicationInput = document.getElementById("idDuplication");
  if (!userIdInput.value) {
    alert("아이디를 입력하세요.");
    return;
  }

  try {
    const response = await axios.post("/checkDuplication", {
      userId: userIdInput.value,
    });

    if (response.data.isDuplicate) {
      alert("이미 사용 중인 아이디입니다.");
      idDuplicationInput.value = "idUnCheck";
      document.getElementById("registerSubmit").disabled = true;
    } else {
      alert("사용 가능한 아이디입니다.");
      idDuplicationInput.value = "idChecked";
      document.getElementById("registerSubmit").disabled = false;
    }
  } catch (error) {
    console.error("Error during duplication check:", error);
    alert("중복확인 중 오류가 발생했습니다.");
  }
}
document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const registerForm = event.target;
    const idDuplication = document.getElementById("idDuplication").value;

    if (!registerForm.checkValidity()) {
      registerForm.reportValidity();
      return;
    }

    if (idDuplication !== "idChecked") {
      alert("아이디 중복확인을 진행하세요.");
      return;
    }

    try {
      const response = await axios.post("/register", {
        userId: registerForm.userId.value,
        userPw: registerForm.userPw.value,
        nickname: registerForm.nickname.value,
      });
      alert("회원가입 성공");
      window.location.href = "/login";
    } catch (error) {
      console.error("error: ", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  });
