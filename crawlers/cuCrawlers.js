const cheerio = require("cheerio");
const { URLSearchParams } = require("url");
const config = require("./crawlfig");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePrice(priceText) {
  const priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  return isNaN(priceNumber) ? 0 : priceNumber;
}

async function crawlCU() {
  let pageIndex = config.CU.BODY_DATA.pageIndex;
  let hasMoreProducts = true;
  const allProducts = [];
  let productIdCounter = 1;

  while (hasMoreProducts) {
    try {
      const response = await fetch(
        `${config.CU.BASE_URL}${config.CU.INITIAL_URL}`,
        {
          method: "POST",
          headers: {
            ...config.CU.HEADERS.common,
            ...config.CU.HEADERS.initial,
          },
          body: new URLSearchParams(config.CU.BODY_DATA).toString(),
        },
      );

      if (!response.ok) break;

      const text = await response.text();
      const $ = cheerio.load(text);
      const productList = $(".prod_list");

      if (productList.length > 0) {
        for (let i = 0; i < productList.length; i++) {
          const product = productList[i];
          const name = $(product).find(".name p").text().trim();
          const priceText = $(product).find(".price strong").text().trim();
          const price = parsePrice(priceText);
          const imgSrc = $(product).find(".prod_img img").attr("src") || "";

          // const fullImageUrl = imgSrc.startsWith("http")
          //   ? imgSrc
          //   : `https://cu.bgfretail.com${imgSrc}`;

          // const imageFileName = path.basename(fullImageUrl);
          // await downloadImage(fullImageUrl, imageFileName);

          allProducts.push({
            id: `cu-${productIdCounter++}`,
            convini: "cu",
            name,
            price,
            imageUrl: imgSrc,
          });
        }

        pageIndex++;
        config.CU.BODY_DATA.pageIndex = pageIndex;
      } else {
        hasMoreProducts = false;
      }

      await sleep(500);
    } catch (error) {
      console.error("CU 크롤링 오류:", error);
      break;
    }
  }

  return allProducts;
}
// async function crawlCU() {
//   let pageIndex = config.CU.BODY_DATA.pageIndex;
//   let hasMoreProducts = true;
//   const allProducts = [];
//   let productIdCounter = 1;

//   while (hasMoreProducts) {
//     try {
//       const response = await fetch(
//         `${config.CU.BASE_URL}${config.CU.INITIAL_URL}`,
//         {
//           credentials: "include",
//           headers: {
//             ...config.CU.HEADERS.common,
//             ...config.CU.HEADERS.initial,
//           },
//           referrer:
//             "https://cu.bgfretail.com/product/product.do?category=product&depth2=4&sf=N",
//           body: new URLSearchParams(config.CU.BODY_DATA).toString(),
//           method: "POST",
//           mode: "cors",
//         },
//       );

//       if (!response.ok) {
//         console.error(`CU 요청 실패: 상태 코드 ${response.status}`);
//         break;
//       }

//       const text = await response.text();
//       const $ = cheerio.load(text);
//       const productList = $(".prod_list");

//       if (productList.length > 0) {
//         const products = productList
//           .map((i, product) => {
//             let imgSrc = $(product).find(".prod_img img").attr("src") || "";
//             // 절대경로 조합 제거
//             // if (!imgSrc.startsWith("http")) {
//             //   imgSrc = `${config.CU.BASE_URL}${imgSrc}`;
//             // }

//             const name = $(product).find(".name p").text().trim();
//             const priceText = $(product).find(".price strong").text().trim();
//             const price = parsePrice(priceText);

//             return {
//               id: `cu-${productIdCounter++}`,
//               convini: "cu",
//               name,
//               price,
//               imageUrl: imgSrc,
//             };
//           })
//           .get();

//         allProducts.push(...products);
//         console.log(
//           `CU 페이지 ${pageIndex} 크롤링 완료. 총 제품 수: ${allProducts.length}`,
//         );
//         pageIndex++;
//         config.CU.BODY_DATA.pageIndex = pageIndex;
//       } else {
//         hasMoreProducts = false;
//         console.log("CU 더 이상 제품이 없습니다.");
//       }

//       await sleep(1000); // 1초 대기
//     } catch (error) {
//       console.error(`CU 크롤링 중 오류 발생:`, error);
//       break;
//     }
//   }
//   return allProducts;
// }

module.exports = { crawlCU };
