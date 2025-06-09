const axios = require("axios");

const renderAboutPage = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8080/products");
    const data = response.data;

    if (data.success) {
      let products = data.products;

      // 모든 제품이 'tags' 배열을 가지고 있는지 확인
      products = products.map((product) => ({
        ...product,
        tags: Array.isArray(product.tags) ? product.tags : [],
      }));

      // 편의점 이름을 정규화하여 중복 제거
      const normalizedConvinces = products.map((product) =>
        product.convenienceName.trim().toLowerCase(),
      );
      const uniqueConvinces = [...new Set(normalizedConvinces)];

      // 원본 편의점 이름을 보존하기 위해 Map 사용
      const convenienceMap = new Map();
      products.forEach((product) => {
        const normalized = product.convenienceName.trim().toLowerCase();
        if (!convenienceMap.has(normalized)) {
          convenienceMap.set(normalized, product.convenienceName.trim());
        }
      });
      const availableConvinces = Array.from(convenienceMap.values());

      // 가능한 모든 이벤트 목록 추출
      const availableEvents = [
        ...new Set(products.map((product) => product.event)),
      ];

      // 가능한 모든 카테고리 목록 추출
      const availableCategories = [
        ...new Set(
          products
            .flatMap((product) => product.tags)
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        ),
      ];

      // 필터링 처리
      const selectedConvenienceRaw = req.query.convenience;
      const selectedConvenience = selectedConvenienceRaw
        ? selectedConvenienceRaw.trim()
        : null;
      if (selectedConvenience) {
        products = products.filter(
          (product) => product.convenienceName === selectedConvenience,
        );
      }

      const selectedEventRaw = req.query.event;
      const selectedEvent = selectedEventRaw ? selectedEventRaw.trim() : null;
      if (selectedEvent) {
        products = products.filter(
          (product) => product.event === selectedEvent,
        );
      }

      const selectedCategoryRaw = req.query.category;
      const selectedCategory = selectedCategoryRaw
        ? selectedCategoryRaw.trim()
        : null;
      if (selectedCategory) {
        products = products.filter((product) =>
          product.tags.includes(selectedCategory),
        );
      }

      const sortBy = req.query.sortBy;
      if (sortBy === "priceAsc") {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        products.sort((a, b) => b.price - a.price);
      }

      const userId = res.locals.userId;

      res.render("about", {
        title: "FRESH FOOD",
        products,
        errorMessage: undefined,
        availableConvinces,
        availableEvents,
        availableCategories,
        selectedConvenience,
        selectedEvent,
        selectedCategory,
        sortBy,
        userId,
      });
    } else {
      console.error("API 호출 실패:", data);
      res.render("about", {
        title: "About Us",
        products: [],
        errorMessage: "상품 정보를 불러오는 데 실패했습니다.",
        availableConvinces: [],
        availableEvents: [],
        availableCategories: [],
        selectedConvenience: "",
        selectedEvent: "",
        selectedCategory: "",
        sortBy: "",
        userId: null,
      });
    }
  } catch (error) {
    console.error("상품 정보 로딩 중 오류 발생:", error.message || error);
    res.render("about", {
      title: "About Us",
      products: [],
      errorMessage: "상품 정보를 불러오는 중 오류가 발생했습니다.",
      availableConvinces: [],
      availableEvents: [],
      availableCategories: [],
      selectedConvenience: "",
      selectedEvent: "",
      selectedCategory: "",
      sortBy: "",
      userId: null,
    });
  }
};

module.exports = {
  renderAboutPage,
};
