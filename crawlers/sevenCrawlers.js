const cheerio = require("cheerio");
const { CookieJar } = require("tough-cookie");
const config = require("./crawlfig");

function parsePrice(priceText) {
  const priceNumber = parseInt(priceText.replace(/[^0-9]/g, ""), 10);
  return isNaN(priceNumber) ? 0 : priceNumber;
}

function getRandomDelay(min = 500, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function crawlSeven() {
  const url = `${config.SEVENELEVEN.BASE_URL}${config.SEVENELEVEN.INITIAL_URL}`;
  const origin = config.SEVENELEVEN.BASE_URL;

  const cookieJar = new CookieJar();
  const processedProductIds = new Set();
  let intPageSize = config.SEVENELEVEN.BODY_DATA.intPageSize;
  const maxRequests = 10;
  const allProducts = [];
  let productIdCounter = 1;

  async function getCookieValue(url, name) {
    const cookies = await cookieJar.getCookies(url);
    return cookies.find((c) => c.key === name)?.value || null;
  }

  async function updateCookies(url, response) {
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      await cookieJar.setCookie(setCookie, url);
    }
  }

  for (let i = 0; i < maxRequests; i++) {
    const params = new URLSearchParams();
    params.append("intPageSize", intPageSize);
    params.append("pTab", "");

    const aspSession = await getCookieValue(origin, "ASPSESSIONIDAUQSQSQS");

    const headers = {
      ...config.SEVENELEVEN.HEADERS.common,
      Cookie: aspSession
        ? `ASPSESSIONIDAUQSQSQS=${aspSession}`
        : config.SEVENELEVEN.HEADERS.cookieFallback,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: params.toString(),
      });

      await updateCookies(origin, response);

      if (!response.ok) break;

      const html = await response.text();
      const $ = cheerio.load(html);

      $("li").each((_, el) => {
        const name = $(el).find(".infowrap .name").text().trim();
        const priceText = $(el).find(".infowrap .price span").text().trim();
        const price = parsePrice(priceText);
        let img = $(el).find(".pic_product img").attr("src") || "";
        if (!img.startsWith("http")) img = `https://www.7-eleven.co.kr${img}`;

        const href = $(el).find("a.btn_product_01").attr("href");
        const match = href?.match(/fncGoView\('(\d+)'\)/);
        const id = match?.[1];

        if (id && !processedProductIds.has(id)) {
          processedProductIds.add(id);
          allProducts.push({
            id: `seven-${productIdCounter++}`,
            convini: "seven",
            name,
            price,
            imageUrl: img,
          });
        }
      });

      intPageSize += 4;
      config.SEVENELEVEN.BODY_DATA.intPageSize = intPageSize;
      await delay(getRandomDelay());
    } catch (err) {
      console.error("Seven 크롤링 오류:", err);
      break;
    }
  }

  return allProducts;
}

module.exports = { crawlSeven };
