const search = document.querySelector(".section4 > .container > div > .search");
const searchBtn = document.querySelector(
  ".section4 > .container > div > .searchBtn",
);
// console.log(searchBtn);

searchBtn.addEventListener("click", async () => {
  const productName = search.value.trim();
  try {
    if (!search.checkValidity()) {
      alert("제품의 한글명을 입력해주세요");
      return;
    }
    if (search.value.trim() === "" || search.value.trim().length > 10) {
      alert("검색어를 입력해주세요!");
      return;
    }

    const product = await axios({
      url: "/search",
      method: "get",
      params: {
        productName,
      },
    });
    document.location.href = `/search?productName=${productName}`;
  } catch (err) {
    console.error("err!", err);
  }
});

search.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const productName = search.value.trim();

    try {
      if (!search.checkValidity()) {
        alert("제품의 한글명을 입력해주세요");
        return;
      }
      if (search.value.trim() === "" || search.value.trim().length > 10) {
        alert("검색어를 입력해주세요!");
        return;
      }
      const product = await axios({
        url: "/search",
        method: "get",
        params: {
          productName,
        },
      });
      document.location.href = `/search?productName=${productName}`;
    } catch (err) {
      console.error("err!", err);
    }
  }
});
