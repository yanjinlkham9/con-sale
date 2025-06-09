//crawlers/crawlfig.js
module.exports = {
  CU: {
    BASE_URL: "https://cu.bgfretail.com",
    INITIAL_URL: "/product/productAjax.do",
    HEADERS: {
      common: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Accept: "text/html, */*; q=0.01",
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      initial: {
        Referer:
          "https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N",
      },
    },
    BODY_DATA: {
      pageIndex: 1,
      searchMainCategory: "10",
      searchSubCategory: "",
      listType: "",
      searchCondition: "setA",
      searchUseYn: "",
      gdIdx: "0",
      codeParent: "10",
      user_id: "",
      search1: "",
      search2: "",
      searchKeyword: "",
    },
  },

  SEVENELEVEN: {
    BASE_URL: "https://www.7-eleven.co.kr",
    INITIAL_URL: "/product/bestdosirakList.asp",
    HEADERS: {
      common: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Accept: "*/*",
        "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        Referer: "https://www.7-eleven.co.kr/product/bestdosirakList.asp",
        Origin: "https://www.7-eleven.co.kr",
        Connection: "keep-alive",
      },
      data: {}, // Additional headers for data requests can be added here
    },
    BODY_DATA: {
      intPageSize: 4,
      pTab: "",
    },
  },

  GS25: {
    BASE_URL: "https://gs25.gsretail.com",
    INITIAL_URL: "/",
    DATA_URL: "/products/youus-freshfoodDetail-search",
    HEADERS: {
      common: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      initial: {
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      data: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        Referer: "http://gs25.gsretail.com/gscvs/ko/products/youus-freshfood",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
    BODY_DATA: {
      pageNum: 1,
      pageSize: 20, // Number of items to fetch per request
      searchWord: "",
      searchHPrice: "",
      searchTPrice: "",
      searchSrvFoodCK: "FreshFoodKey",
      searchSort: "searchALLSort",
      searchProduct: "productALL",
    },
    SCHEMA: {
      type: "object",
      properties: {
        SubPageListPagination: {
          type: "object",
          properties: {
            totalNumberOfResults: { type: "number" },
            _type: { type: "string" },
            sort: { type: ["string", "null"] },
            _classname: { type: "string" },
            pageSize: { type: "number" },
            class: { type: "string" },
            numberOfPages: { type: "number" },
            currentPage: { type: "number" },
          },
          additionalProperties: true, // Allow additional properties
        },
        MainManagementDetailViewList: {
          type: "array",
          items: {
            type: "object",
            properties: {
              // Define only necessary properties; types are flexible
              exposure: { type: ["boolean", "null"] },
              title: { type: ["string", "null"] },
              _type: { type: ["string", "null"] },
              _classname: { type: ["string", "null"] },
            },
            additionalProperties: true,
          },
        },
        SubPageListData: {
          type: "array",
          items: {
            type: "object",
            properties: {
              // Define only necessary properties; types are flexible
              attFileId: { type: ["string", "null"] },
              attFileNm: { type: ["string", "null"] },
              attFileNmOld: { type: ["string", "null"] },
              attFileIdOld: { type: ["string", "null"] },
              goodsNm: { type: ["string", "null"] },
              price: { type: ["number", "null"] },
            },
            additionalProperties: true,
          },
        },
      },
      additionalProperties: true,
    },
  },
};
