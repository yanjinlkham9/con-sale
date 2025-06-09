const cheerio = require("cheerio");
const Ajv = require("ajv");
const cookie = require("cookie");
const config = require("./crawlfig");

// async function crawlGS25() {
//   const ajv = new Ajv();
//   const validate = ajv.compile(config.GS25.SCHEMA);

//   let allProducts = [];
//   let currentPage = config.GS25.BODY_DATA.pageNum;
//   let totalPages = 1;
//   let productIdCounter = 1;

//   try {
//     const initialResponse = await fetch(
//       `${config.GS25.BASE_URL}${config.GS25.INITIAL_URL}`,
//       {
//         headers: {
//           ...config.GS25.HEADERS.common,
//           ...config.GS25.HEADERS.initial,
//         },
//       },
//     );

//     const html = await initialResponse.text();
//     const csrf = html.match(/name="CSRFToken" value="([^"]+)"/)?.[1];
//     // set-cookie 헤더가 여러 개 있을 때도 get()은 문자열 한 개만 가져옴
//     // const rawCookies = initialResponse.headers.get("set-cookie");
//     // const jsessionId = rawCookies && cookie.parse(rawCookies).JSESSIONID;

//     // if (!csrf || !jsessionId) throw new Error("초기 토큰 또는 세션 없음");

//     // // 다중 Set-Cookie 처리
//     // // const rawCookies = initialResponse.headers.raw()["set-cookie"] || [];
//     // // let jsessionId = null;
//     // for (const c of rawCookies) {
//     //   const parsed = cookie.parse(c);
//     //   if (parsed.JSESSIONID) {
//     //     jsessionId = parsed.JSESSIONID;
//     //     break;
//     //   }
//     // }
//     const rawCookies = initialResponse.headers.get("set-cookie");
//     let jsessionId = null;

//     if (rawCookies) {
//       const parsed = cookie.parse(rawCookies);
//       if (parsed.JSESSIONID) {
//         jsessionId = parsed.JSESSIONID;
//       }
//     }

//     if (!csrf || !jsessionId) throw new Error("초기 토큰 또는 세션 없음");

//     do {
//       const body = new URLSearchParams({
//         ...config.GS25.BODY_DATA,
//         pageNum: currentPage,
//       });

//       const response = await fetch(
//         `${config.GS25.BASE_URL}${config.GS25.DATA_URL}?CSRFToken=${csrf}`,
//         {
//           method: "POST",
//           headers: {
//             ...config.GS25.HEADERS.common,
//             ...config.GS25.HEADERS.data,
//             Cookie: `JSESSIONID=${jsessionId}`,
//           },
//           body,
//         },
//       );

//       let json;
//       try {
//         json = await response.json();
//       } catch (err) {
//         console.error("GS25 JSON 파싱 실패:", err);
//         break;
//       }

//       if (!validate(json)) {
//         console.error("GS25 JSON validation failed:", validate.errors);
//         break;
//       }

//       totalPages = json.SubPageListPagination.numberOfPages;

//       json.SubPageListData.forEach((item) => {
//         let imageUrl = item.attFileNm || item.attFileNmOld || "";

//         if (imageUrl && !imageUrl.startsWith("http")) {
//           imageUrl = config.GS25.BASE_URL + imageUrl;
//         }
//         if (!imageUrl) {
//           imageUrl = "https://image.woodongs.com/default-image.jpg";
//         }

//         allProducts.push({
//           id: `gs25-${productIdCounter++}`,
//           name: item.goodsNm,
//           price: item.price ?? 0,
//           imageUrl,
//           convini: "gs25",
//         });
//       });

//       currentPage++;
//     } while (currentPage <= totalPages);
//   } catch (err) {
//     console.error("GS25 크롤링 오류:", err);
//   }

//   return allProducts;
// }
async function crawlGS25() {
  const ajv = new Ajv();
  const validate = ajv.compile(config.GS25.SCHEMA);

  let allProducts = [];
  let currentPage = config.GS25.BODY_DATA.pageNum;
  let totalPages = 1;
  let productIdCounter = 1;

  try {
    const initialResponse = await fetch(
      `${config.GS25.BASE_URL}${config.GS25.INITIAL_URL}`,
      {
        headers: {
          ...config.GS25.HEADERS.common,
          ...config.GS25.HEADERS.initial,
        },
      },
    );

    if (!initialResponse.ok) {
      throw new Error(
        `Failed to fetch initial page: ${initialResponse.status}`,
      );
    }

    const initialText = await initialResponse.text();
    const csrfTokenMatch = initialText.match(
      /<input type="hidden" name="CSRFToken" value="([^"]+)"\s*\/?>/,
    );

    if (!csrfTokenMatch) {
      throw new Error("CSRF token not found in the initial response.");
    }
    const csrfToken = csrfTokenMatch[1];

    const rawCookies = initialResponse.headers.get("set-cookie");
    if (!rawCookies) {
      throw new Error("Set-Cookie header not found in the initial response.");
    }

    let jsessionId = "";
    const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    cookies.forEach((cookieStr) => {
      const parsedCookie = cookie.parse(cookieStr);
      if (parsedCookie.JSESSIONID) {
        jsessionId = `JSESSIONID=${parsedCookie.JSESSIONID}`;
      }
    });

    if (!jsessionId) {
      throw new Error("JSESSIONID not found in the Set-Cookie headers.");
    }

    do {
      const response = await fetch(
        `${config.GS25.BASE_URL}${config.GS25.DATA_URL}?CSRFToken=${csrfToken}`,
        {
          method: "POST",
          headers: {
            ...config.GS25.HEADERS.common,
            ...config.GS25.HEADERS.data,
            Cookie: jsessionId,
          },
          body: new URLSearchParams({
            ...config.GS25.BODY_DATA,
            pageNum: currentPage,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("응답이 JSON이 아닙니다.");
      }

      const data = await response.json();
      let parsedData = data;

      if (typeof data === "string") {
        try {
          parsedData = JSON.parse(data);
        } catch (parseError) {
          throw new Error("중첩된 JSON 파싱 실패: " + parseError.message);
        }
      }

      const valid = validate(parsedData);
      if (!valid) {
        console.error(
          `JSON 데이터 검증 오류 (페이지 ${currentPage}):`,
          validate.errors,
        );
      }

      totalPages = parsedData.SubPageListPagination.numberOfPages;

      const normalizedProducts = extractProductInfo(
        parsedData,
        config.GS25.BASE_URL,
      );
      allProducts = allProducts.concat(normalizedProducts);

      console.log(
        `페이지 ${currentPage} 데이터 추출 완료. 총 제품 수: ${allProducts.length}`,
      );

      currentPage++;
      config.GS25.BODY_DATA.pageNum = currentPage;
    } while (currentPage <= totalPages);

    console.log(
      `총 ${allProducts.length}개의 GS25 상품 정보가 추출되었습니다.`,
    );
  } catch (error) {
    console.error("Error fetching GS25 data:", error);
  }

  return allProducts;

  function extractProductInfo(data, BASE_URL) {
    const products = [];

    if (data.SubPageListData && Array.isArray(data.SubPageListData)) {
      data.SubPageListData.forEach((item) => {
        const name = item.goodsNm || "이름 없음";
        const price =
          item.price !== undefined && item.price !== null ? item.price : 0;

        let imageUrl = "https://image.woodongs.com/default-image.jpg";
        if (item.attFileNm) {
          imageUrl = item.attFileNm;
        } else if (item.attFileNmOld) {
          imageUrl = item.attFileNmOld;
        } else if (item.attFileId) {
          imageUrl = item.attFileId;
        } else if (item.attFileIdOld) {
          imageUrl = item.attFileIdOld;
        }

        if (
          imageUrl !== "이미지 없음" &&
          imageUrl !== "https://image.woodongs.com/default-image.jpg"
        ) {
          const woodongsMatch = imageUrl.match(
            /(https:\/\/image\.woodongs\.com\/.*)/,
          );
          if (woodongsMatch) {
            imageUrl = woodongsMatch[1];
          } else {
            imageUrl = "https://image.woodongs.com/default-image.jpg";
          }
        }

        products.push({
          id: `gs25-${productIdCounter++}`,
          name,
          price,
          imageUrl,
          convini: "gs25",
        });
      });
    } else {
      console.warn("SubPageListData가 존재하지 않거나 배열이 아닙니다.");
    }

    return products;
  }
}
module.exports = { crawlGS25 };
