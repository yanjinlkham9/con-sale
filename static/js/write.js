document.addEventListener("DOMContentLoaded", () => {
  console.log("write.js loaded.");
  const boardTitleInput = document.getElementById("boardTitle");
  const boardDetailInput = document.getElementById("boardDetail");
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (event) {
      if (!boardTitleInput.value.trim()) {
        alert("제목을 입력해주세요.");
        event.preventDefault();
        return;
      }
      if (!boardDetailInput.value.trim()) {
        alert("내용을 입력해주세요.");
        event.preventDefault();
        return;
      }
    });
  }
});
