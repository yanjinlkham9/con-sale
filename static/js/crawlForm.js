// public/static/js/crawlForm.js

document.getElementById("crawl-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const progressDiv = document.getElementById("progress");
  const formDiv = document.getElementById("crawl-form");
  const errorDiv = document.querySelector(".error");

  // 입력 검증
  if (password.length !== 6) {
    if (errorDiv) {
      errorDiv.textContent = "비밀번호는 6자리여야 합니다.";
    } else {
      alert("비밀번호는 6자리여야 합니다.");
    }
    return;
  }

  // 진행 상태 표시
  progressDiv.style.display = "block";
  formDiv.style.display = "none";
  if (errorDiv) {
    errorDiv.textContent = "";
  }

  // 크롤링 시작 AJAX 요청
  fetch("/products/crawl/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  })
    .then((response) => {
      if (response.status === 401) {
        return response.text().then((text) => {
          throw new Error("비밀번호가 올바르지 않습니다.");
        });
      }
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error("크롤링 작업 중 오류가 발생했습니다.");
        });
      }
      return response.text(); // 성공 시 'index.ejs' 렌더링된 HTML 반환
    })
    .then((html) => {
      // 현재 페이지를 크롤링 결과 페이지로 대체
      document.open();
      document.write(html);
      document.close();
    })
    .catch((error) => {
      // 에러 발생 시 에러 메시지 표시 및 폼 복구
      if (errorDiv) {
        errorDiv.textContent = error.message;
      } else {
        alert(error.message);
      }
      progressDiv.style.display = "none";
      formDiv.style.display = "block";
    });
});
