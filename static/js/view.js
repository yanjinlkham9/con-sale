function deletePost(postId) {
  if (!confirm("글을 삭제하시겠습니까?")) {
    return;
  }

  fetch(`/board/view/${postId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("글이 삭제되었습니다.");
        window.location.href = "/board";
      } else {
        alert(data.message || "글 삭제 실패. 다시 시도하세요.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("서버 오류가 발생했습니다. 다시 시도하세요.");
    });
}

function editComment(commentId) {
  const newContent = prompt("댓글을 수정하세요:");
  if (newContent) {
    fetch(`/board/comment/${commentId}/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bcDetail: newContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        } else {
          alert("댓글 수정 실패!");
        }
      });
  }
}

function deleteComment(commentId) {
  if (confirm("댓글을 삭제하시겠습니까?")) {
    fetch(`/board/comment/${commentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        } else {
          alert("댓글 삭제 실패!");
        }
      });
  }
}
