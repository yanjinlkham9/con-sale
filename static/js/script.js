// script.js

// 태그 토글 함수 (클라이언트 측에서만 동작)
function toggleTag(button, productId, tag) {
  const productCard = document.querySelector(
    `.product-card[data-product-id="${productId}"]`,
  );
  const productTags = JSON.parse(productCard.dataset.productTags);

  // 태그 배열 업데이트
  if (productTags.includes(tag)) {
    productTags.splice(productTags.indexOf(tag), 1); // 태그 제거
  } else {
    productTags.push(tag); // 태그 추가
  }

  // 버튼 active 클래스 토글
  button.classList.toggle("active");

  // 업데이트된 태그 배열을 data-product-tags 속성에 저장
  productCard.dataset.productTags = JSON.stringify(productTags);

  // "태그 저장" 버튼 표시 (선택 사항)
  const updateTagsButton = productCard.querySelector(".update-tags-button");
  updateTagsButton.style.display = "inline-block";
}

// DB 전송 함수 (상품 정보와 태그 정보를 함께 전송)
function sendToDB(productId) {
  const productCard = document.querySelector(
    `.product-card[data-product-id="${productId}"]`,
  );
  const productTags = JSON.parse(productCard.dataset.productTags);

  const product = {
    id: productId,
    name: productCard.querySelector(".product-name").textContent,
    price: parseInt(
      productCard
        .querySelector(".product-price")
        .textContent.replace(/[^0-9]/g, ""),
    ), // 숫자만 추출
    imageUrl: productCard.querySelector("img").src,
    convini: productCard.querySelector(".product-convini").textContent,
    tags: productTags,
  };

  fetch(`/products/${productId}/send-db`, {
    // 수정된 부분: URL 수정
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // 제품 카드 상태 업데이트
        productCard.classList.add("sent");
        productCard.classList.add("duplicate");
        const sendButton = productCard.querySelector(".send-db-button");
        if (sendButton) sendButton.remove();

        // "이미 전송됨" 라벨 추가
        const sentLabel = document.createElement("div");
        sentLabel.classList.add("sent-label");
        sentLabel.textContent = "이미 전송됨";
        productCard.prepend(sentLabel);

        // "이미 DB에 저장된 상품입니다" 라벨 추가
        const duplicateLabel = document.createElement("div");
        duplicateLabel.classList.add("duplicate-label");
        duplicateLabel.textContent = "이미 DB에 저장된 상품입니다";
        productCard.prepend(duplicateLabel);

        // DB에서 삭제 버튼 추가
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-db-button");
        deleteButton.textContent = "DB에서 삭제";
        deleteButton.onclick = () => deleteFromDB(productId);
        productCard.appendChild(deleteButton);

        // "태그 저장" 버튼 숨기기 (선택 사항)
        const updateTagsButton = productCard.querySelector(
          ".update-tags-button",
        );
        if (updateTagsButton) {
          updateTagsButton.style.display = "none";
        }
      } else {
        console.error("DB 전송 실패:", data.error);
      }
    })
    .catch((error) => console.error("DB 전송 중 오류 발생:", error));
}

// 태그 업데이트 함수 (선택 사항)
function updateTags(productId) {
  const productCard = document.querySelector(
    `.product-card[data-product-id="${productId}"]`,
  );
  const productTags = JSON.parse(productCard.dataset.productTags);

  fetch(`/products/${productId}/update-tags`, {
    // 수정된 부분: URL 수정
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags: productTags }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("태그 업데이트 성공");

        // "태그 저장" 버튼 숨기기
        const updateTagsButton = productCard.querySelector(
          ".update-tags-button",
        );
        if (updateTagsButton) {
          updateTagsButton.style.display = "none";
        }
      } else {
        console.error("태그 업데이트 실패:", data.error);
      }
    })
    .catch((error) => console.error("태그 업데이트 중 오류 발생:", error));
}

// DB 삭제 함수 (이전과 동일)
function deleteFromDB(productId) {
  if (!confirm("정말 DB에서 삭제하시겠습니까?")) {
    return; // 취소 버튼 클릭 시 함수 종료
  }

  fetch(`/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // 제품 카드 제거
        const productCard = document.querySelector(
          `.product-card[data-product-id="${productId}"]`,
        );
        if (productCard) {
          productCard.remove();
        }
      } else {
        console.error("DB 삭제 실패:", data.error);
      }
    })
    .catch((error) => console.error("DB 삭제 중 오류 발생:", error));
}
// 댓글 로드 함수
function loadComments(productId) {
  fetch(`/products/${productId}/comments`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const commentList = document.getElementById(
          `comment-list-${productId}`,
        );
        commentList.innerHTML = ""; // Clear existing comments

        data.comments.forEach((comment) => {
          const commentElement = document.createElement("div");
          commentElement.classList.add("comment");
          commentElement.innerHTML = `
              <span class="comment-author">${
                comment.user ? comment.user.username : "익명"
              }</span>
              <p class="comment-content">${comment.commentDetail}</p>
              <button class="comment-delete" onclick="deleteComment('${
                comment.commentId
              }', '${productId}')"><i class="fas fa-trash"></i></button>
            `;
          commentList.appendChild(commentElement);
        });
      } else {
        console.error("댓글 로드 실패:", data.error);
      }
    })
    .catch((error) => console.error("댓글 로드 중 오류 발생:", error));
}

// 댓글 추가 함수
function addComment(productId) {
  const commentInput = document.getElementById(`comment-input-${productId}`);
  const commentDetail = commentInput.value;

  if (!commentDetail.trim()) {
    alert("댓글 내용을 입력해주세요!");
    return;
  }

  fetch(`/products/${productId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentDetail }), // Use commentDetail to match your model
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        commentInput.value = ""; // Clear input field
        loadComments(productId); // Reload comments
      } else {
        console.error("댓글 추가 실패:", data.error);
      }
    })
    .catch((error) => console.error("댓글 추가 중 오류 발생:", error));
}

// 댓글 삭제 함수
function deleteComment(commentId, productId) {
  if (!confirm("정말 댓글을 삭제하시겠습니까?")) {
    return;
  }

  fetch(`/products/comments/${commentId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        loadComments(productId); // Reload comments
      } else {
        console.error("댓글 삭제 실패:", data.error);
      }
    })
    .catch((error) => console.error("댓글 삭제 중 오류 발생:", error));
}

// 팝업 열기 함수
function showPopup(productId) {
  const popup = document.getElementById(`popup-${productId}`);
  popup.classList.add("active");
  loadComments(productId); // Load comments when popup is opened
}

// 팝업 닫기 함수
function closePopup(productId) {
  const popup = document.getElementById(`popup-${productId}`);
  popup.classList.remove("active");
}

// Event listeners for "댓글 보기" buttons
document.addEventListener("DOMContentLoaded", () => {
  const showCommentsButtons = document.querySelectorAll(
    ".show-comments-button",
  );
  showCommentsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.closest(".product-item").dataset.productId;
      showPopup(productId);
    });
  });
});
