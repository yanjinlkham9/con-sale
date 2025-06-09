// comments.js

// 댓글 팝업 열기 함수
window.openCommentsPopup = async function (productId) {
  const popup = document.getElementById("comments-popup");
  const productName = document.getElementById("popup-product-name");
  const productImage = document.getElementById("popup-product-image");
  const productPrice = document.getElementById("popup-product-price");
  const productConvenience = document.getElementById(
    "popup-product-convenience",
  );
  const productEvent = document.getElementById("popup-product-event");
  const commentsList = document.getElementById("comments-list");
  const loadingSpinner = document.getElementById("loading-spinner");

  // 팝업에 현재 제품 ID 설정
  popup.setAttribute("data-product-id", productId);

  // 팝업 열기
  popup.classList.add("active");

  // 로딩 스피너 표시
  loadingSpinner.classList.add("active");

  try {
    // 제품 정보 가져오기 (클라이언트 사이드에서 이미 알고 있으므로 EJS에서 전달)
    const productItem = document.querySelector(
      `.product-item[data-product-id="${productId}"]`,
    );
    const name = productItem.querySelector(".product-name").innerText;
    const imageUrl = productItem.querySelector("img").src;
    const price = productItem.querySelector(".product-price").innerText;
    const convenience = productItem.getAttribute("data-convenience");
    const event = productItem.getAttribute("data-event");

    productName.innerText = name;
    productImage.src = imageUrl;
    productImage.alt = name;
    productPrice.innerText = price;
    productConvenience.innerText = `편의점: ${convenience}`;
    productEvent.innerText = `이벤트: ${event}`;

    // 댓글 가져오기
    const response = await fetch(`/api/pcomments?productId=${productId}`);
    const data = await response.json();

    if (response.ok) {
      // 댓글 목록 초기화
      commentsList.innerHTML = "";

      if (data.comments.length === 0) {
        commentsList.innerHTML = "<p>댓글이 없습니다.</p>";
      } else {
        data.comments.forEach((comment) => {
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment");

          const authorDiv = document.createElement("div");
          authorDiv.classList.add("comment-author");
          authorDiv.innerText = comment.user.nickname; // 사용자 닉네임

          const contentDiv = document.createElement("div");
          contentDiv.classList.add("comment-content");
          contentDiv.innerText = comment.commentDetail;

          // 댓글 작성자와 현재 사용자가 동일한 경우에만 수정/삭제 버튼 표시
          if (window.userId === comment.user.userId) {
            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("comment-actions");

            const editBtn = document.createElement("span");
            editBtn.classList.add("edit-comment");
            editBtn.innerText = "수정";
            editBtn.onclick = () => editComment(comment.commentId, contentDiv);

            const deleteBtn = document.createElement("span");
            deleteBtn.classList.add("delete-comment");
            deleteBtn.innerText = "삭제";
            deleteBtn.onclick = () =>
              deleteComment(comment.commentId, commentDiv);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            commentDiv.appendChild(actionsDiv);
          }

          commentDiv.appendChild(authorDiv);
          commentDiv.appendChild(contentDiv);
          commentsList.appendChild(commentDiv);
        });
      }
    } else {
      commentsList.innerHTML = `<p>Error: ${data.message}</p>`;
    }
  } catch (error) {
    commentsList.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    // 로딩 스피너 숨기기
    loadingSpinner.classList.remove("active");
  }
};

// 댓글 제출 함수
window.submitComment = async function () {
  const popup = document.getElementById("comments-popup");
  const productId = popup.getAttribute("data-product-id");
  const commentContent = document
    .getElementById("new-comment-content")
    .value.trim();

  if (!commentContent) {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch("/api/pcomments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pId: productId,
        commentDetail: commentContent,
        userId: window.userId, // 전역 userId 사용
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // 댓글 목록에 새 댓글 추가
      const commentsList = document.getElementById("comments-list");
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const authorDiv = document.createElement("div");
      authorDiv.classList.add("comment-author");
      authorDiv.innerText = data.user.nickname; // 사용자 닉네임

      const contentDiv = document.createElement("div");
      contentDiv.classList.add("comment-content");
      contentDiv.innerText = data.commentDetail;

      // 댓글 작성자와 현재 사용자가 동일한 경우에만 수정/삭제 버튼 표시
      if (window.userId === data.user.userId) {
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("comment-actions");

        const editBtn = document.createElement("span");
        editBtn.classList.add("edit-comment");
        editBtn.innerText = "수정";
        editBtn.onclick = () => editComment(data.commentId, contentDiv);

        const deleteBtn = document.createElement("span");
        deleteBtn.classList.add("delete-comment");
        deleteBtn.innerText = "삭제";
        deleteBtn.onclick = () => deleteComment(data.commentId, commentDiv);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        commentDiv.appendChild(actionsDiv);
      }

      commentDiv.appendChild(authorDiv);
      commentDiv.appendChild(contentDiv);
      commentsList.appendChild(commentDiv);

      // 댓글 작성 폼 초기화
      document.getElementById("new-comment-content").value = "";
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

// 댓글 수정 함수
window.editComment = async function (commentId, contentDiv) {
  const newContent = prompt("수정할 댓글을 입력하세요:", contentDiv.innerText);
  if (newContent === null) return; // 취소 버튼 클릭 시 종료

  if (!newContent.trim()) {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`/api/pcomments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentDetail: newContent.trim(),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      contentDiv.innerText = data.commentDetail;
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

// 댓글 삭제 함수
window.deleteComment = async function (commentId, commentDiv) {
  if (!confirm("댓글을 삭제하시겠습니까?")) return;

  try {
    const response = await fetch(`/api/pcomments/${commentId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      commentDiv.remove();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

// 댓글 팝업 닫기 함수
window.closeCommentsPopup = function () {
  const popup = document.getElementById("comments-popup");
  const commentsList = document.getElementById("comments-list");

  popup.classList.remove("active");
  commentsList.innerHTML = "";

  const newCommentContent = document.getElementById("new-comment-content");
  if (newCommentContent) {
    newCommentContent.value = "";
  }
};
