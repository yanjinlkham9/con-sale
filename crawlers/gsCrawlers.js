const cheerio = require("cheerio");
const Ajv = require("ajv");
const cookie = require("cookie");
const config = require("./crawlfig");

function parsePrice(priceText) {
  const priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  return isNaN(priceNumber) ? 0 : priceNumber;
}

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

    const html = await initialResponse.text();
    const csrf = html.match(/name="CSRFToken" value="([^"]+)"/)?.[1];
    const cookieStr = initialResponse.headers.get("set-cookie");
    const session = cookieStr && cookie.parse(cookieStr).JSESSIONID;

    if (!csrf || !session) throw new Error("초기 토큰 또는 세션 없음");

    do {
      const body = new URLSearchParams({
        ...config.GS25.BODY_DATA,
        pageNum: currentPage,
      });

      const response = await fetch(
        `${config.GS25.BASE_URL}${config.GS25.DATA_URL}?CSRFToken=${csrf}`,
        {
          method: "POST",
          headers: {
            ...config.GS25.HEADERS.common,
            ...config.GS25.HEADERS.data,
            Cookie: `JSESSIONID=${session}`,
          },
          body,
        },
      );

      const json = await response.json();
      if (!validate(json)) {
        console.error("GS25 JSON validation failed:", validate.errors);
        break;
      }

      totalPages = json.SubPageListPagination.numberOfPages;

      json.SubPageListData.forEach((item) => {
        let imageUrl = item.attFileNm || item.attFileNmOld || "";
        if (!/^https?:\/\//.test(imageUrl)) {
          imageUrl = "https://image.woodongs.com/default-image.jpg";
        }

        allProducts.push({
          id: `gs25-${productIdCounter++}`,
          name: item.goodsNm,
          price: item.price ?? 0,
          imageUrl,
          convini: "gs25",
        });
      });

      currentPage++;
    } while (currentPage <= totalPages);
  } catch (err) {
    console.error("GS25 크롤링 오류:", err);
  }

  return allProducts;
}

module.exports = { crawlGS25 };
