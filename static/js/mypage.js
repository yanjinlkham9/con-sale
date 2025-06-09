//static\js\mypage.js
//이 함수는 화살표를 눌렀을 때
//1. 화살표를 아래방향으로 바꾼다.
//2. 목록을 보여주기 위해 새로운 박스를 보여준다..

function showList(arrow) {
  // 아래로 화살표 모양이 향합니다.

  //1. 화살표 아래방향으로 바꾸는 것은 CSS에서 미리 클래스를 선언해줌
  // 눌렀을 때 on이라는 클래스를 버튼에다가 추가해준다.
  arrow.classList.toggle("on");

  //2.목록을 보여주기 위해 새로운 박스를 보여준다.
  const contentContainer = arrow.parentElement.nextElementSibling;
  //   console.log(contentContainer);
  contentContainer.classList.toggle("hide");
}

// I don't
function confirmDelete() {
  const isConfirmed = confirm("정말로 탈퇴하시겠습니까?");
  if (isConfirmed) {
    // 비밀번호 입력 모달 표시
    document.querySelector("#passwordModal").style.display = "block";
  }
}

//
function submitPassword() {
  const password = document.querySelector("#passwordInput").value;

  if (!password) {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  // 서버에 탈퇴 요청
  axios
    .post("/deleteAccount", { password })
    .then((response) => {
      if (response.status === 200) {
        alert("탈퇴가 완료되었습니다.");
        window.location.href = "/"; // 탈퇴 후 메인 페이지로 이동
      } else {
        alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.response && error.response.status === 401) {
        alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
      } else {
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    });
}

function closeModal() {
  document.querySelector("#passwordModal").style.display = "none";
}

// 페이지 로드 시 상품 리뷰 데이터를 가져오는 함수
async function fetchProductReviews() {
  try {
    const response = await axios.get("/api/mycomments");
    const comments = response.data.comments;
    const reviewList = document.getElementById("product-review-list");
    const reviewCount = document.getElementById("product-review-count");

    reviewCount.textContent = comments.length;

    comments.forEach((comment, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span>${index + 1}</span>
        <span>${comment.commentDetail}</span>
        <span>${comment.product.name}</span>
        <span>${new Date(comment.createdAt).toLocaleDateString()}</span>
      `;
      reviewList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }
}

// mypage 로드 시 fetchProductReviews 함수 실행
window.onload = fetchProductReviews;
