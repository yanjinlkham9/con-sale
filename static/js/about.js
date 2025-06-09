// about.js

const CommentsModule = (function () {
  // 댓글 팝업 열기
  const openCommentsPopup = async function (productId) {
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
    const newCommentForm = document.getElementById("new-comment-form"); // 댓글 작성 폼
    const loginPrompt = document.getElementById("login-prompt"); // 로그인 유도 메시지

    // 팝업에 현재 제품 ID 설정
    popup.setAttribute("data-product-id", productId);

    // 팝업 열기
    popup.classList.add("active");

    // 로딩 스피너 표시
    loadingSpinner.classList.add("active");

    try {
      // 제품 정보 가져오기
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
            const commentDiv = createCommentElement(comment);
            commentsList.appendChild(commentDiv);
          });
        }
      } else {
        commentsList.innerHTML = `<p>Error: ${data.message}</p>`;
      }

      // 댓글 작성 폼과 로그인 유도 메시지 표시 여부 설정
      if (window.userId) {
        if (newCommentForm) {
          newCommentForm.classList.add("active");
        }
        if (loginPrompt) {
          loginPrompt.classList.remove("active");
        }
      } else {
        if (newCommentForm) {
          newCommentForm.classList.remove("active");
        }
        if (loginPrompt) {
          loginPrompt.classList.add("active");
        }
      }
    } catch (error) {
      commentsList.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
      // 로딩 스피너 숨기기
      loadingSpinner.classList.remove("active");
    }
  };

  // 댓글 요소 생성
  const createCommentElement = (comment) => {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");

    const authorDiv = document.createElement("div");
    authorDiv.classList.add("comment-author");
    authorDiv.innerText = comment.user.nickname; // 사용자 닉네임

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("comment-content");
    contentDiv.innerText = comment.commentDetail;

    // 댓글 작성자와 현재 사용자가 동일한 경우에만 수정/삭제 버튼 표시
    if (window.userId && window.userId === comment.user.userId) {
      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("comment-actions");

      const editBtn = document.createElement("span");
      editBtn.classList.add("edit-comment");
      editBtn.innerText = "수정";
      editBtn.onclick = () => editComment(comment.commentId, contentDiv);

      const deleteBtn = document.createElement("span");
      deleteBtn.classList.add("delete-comment");
      deleteBtn.innerText = "삭제";
      deleteBtn.onclick = () => deleteComment(comment.commentId, commentDiv);

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);
      commentDiv.appendChild(actionsDiv);
    }

    commentDiv.appendChild(authorDiv);
    commentDiv.appendChild(contentDiv);
    return commentDiv;
  };

  // 댓글 제출
  const submitComment = async function () {
    if (!window.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

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
        const commentDiv = createCommentElement(data);

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

  // 댓글 수정
  const editComment = async function (commentId, contentDiv) {
    const newContent = prompt(
      "수정할 댓글을 입력하세요:",
      contentDiv.innerText,
    );
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

  // 댓글 삭제
  const deleteComment = async function (commentId, commentDiv) {
    if (!window.userId) {
      alert("로그인이 필요합니다.");
      return;
    }

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

  // 댓글 팝업 닫기
  const closeCommentsPopup = function () {
    const popup = document.getElementById("comments-popup");
    const commentsList = document.getElementById("comments-list");

    popup.classList.remove("active");
    commentsList.innerHTML = "";

    const newCommentContent = document.getElementById("new-comment-content");
    if (newCommentContent) {
      newCommentContent.value = "";
    }
  };

  // 필터 적용 함수 (카테고리 포함)
  const applyFilters = function () {
    const convenienceFilter =
      document.getElementById("convenience-filter").value;
    const eventFilter = document.getElementById("event-filter").value;
    const categoryFilter = document.getElementById("category-filter").value; // 카테고리 필터
    const sortFilter = document.getElementById("sort-filter").value;

    const params = new URLSearchParams();

    if (convenienceFilter) params.append("convenience", convenienceFilter);
    if (eventFilter) params.append("event", eventFilter);
    if (categoryFilter) params.append("category", categoryFilter); // 카테고리 파라미터 추가
    if (sortFilter) params.append("sortBy", sortFilter);

    window.location.search = params.toString();
  };

  // 상품 목록 업데이트 함수 (필요 시 추가)
  const updateProductList = function (products) {
    const productList = document.querySelector(".product-list");
    productList.innerHTML = "";

    if (products.length === 0) {
      productList.innerHTML = "<p>해당 조건에 맞는 상품이 없습니다.</p>";
      return;
    }

    products.forEach(function (product) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product-item");
      productDiv.setAttribute("data-product-id", product.id);
      productDiv.setAttribute("data-tags", JSON.stringify(product.tags));
      productDiv.setAttribute("data-price", product.price);
      productDiv.setAttribute("data-convenience", product.convenienceName);
      productDiv.setAttribute("data-event", product.event);

      // 이미지 경로 처리 (정규 표현식 사용)
      const regex = /^(GD_\d+_\d+|\d+(\.\d+)?)\.(png|jpg|jpeg|gif|bmp|svg)$/i;
      const imageSrc = regex.test(product.imageUrl)
        ? "/static/image/product/" + product.imageUrl
        : product.imageUrl;

      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = product.name;
      img.classList.add("product-image");
      img.onerror = function () {
        this.src = "/static/image/product/default.png";
      };

      const name = document.createElement("h3");
      name.classList.add("product-name");
      name.innerText = product.name;

      const price = document.createElement("p");
      price.classList.add("product-price");
      price.innerText = `${product.price}원`;

      const button = document.createElement("button");
      button.classList.add("btn", "show-comments-button");
      button.innerText = "댓글 보기";
      button.onclick = () => openCommentsPopup(product.id); // 항상 팝업 열기

      productDiv.appendChild(img);
      productDiv.appendChild(name);
      productDiv.appendChild(price);
      productDiv.appendChild(button);

      productList.appendChild(productDiv);
    });
  };

  // 공개 API
  return {
    openCommentsPopup: openCommentsPopup,
    submitComment: submitComment,
    editComment: editComment,
    deleteComment: deleteComment,
    closeCommentsPopup: closeCommentsPopup,
    applyFilters: applyFilters,
    updateProductList: updateProductList,
  };
})();

// 글로벌 객체에 모듈 할당
window.CommentsModule = CommentsModule;

// 폼 제출 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector(".submit-comment-button");
  if (submitButton) {
    submitButton.addEventListener("click", CommentsModule.submitComment);
  }

  const closeButton = document.querySelector(".popup-close");
  if (closeButton) {
    closeButton.addEventListener("click", CommentsModule.closeCommentsPopup);
  }

  // 팝업이 이미 열려있는 경우 로그인 상태에 따라 폼 표시 여부 설정
  const popup = document.getElementById("comments-popup");
  if (popup && popup.classList.contains("active")) {
    const newCommentForm = document.getElementById("new-comment-form");
    const loginPrompt = document.getElementById("login-prompt");

    if (window.userId) {
      if (newCommentForm) {
        newCommentForm.classList.add("active");
      }
      if (loginPrompt) {
        loginPrompt.classList.remove("active");
      }
    } else {
      if (newCommentForm) {
        newCommentForm.classList.remove("active");
      }
      if (loginPrompt) {
        loginPrompt.classList.add("active");
      }
    }
  }
});
