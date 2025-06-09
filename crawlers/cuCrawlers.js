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

async function downloadImage(imageUrl, filename) {
  const savePath = path.resolve(
    __dirname,
    "../public/static/image/product",
    filename,
  );
  fs.mkdirSync(path.dirname(savePath), { recursive: true });

  const writer = fs.createWriteStream(savePath);
  const response = await axios({
    url: imageUrl,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
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

          const fullImageUrl = imgSrc.startsWith("http")
            ? imgSrc
            : `https://cu.bgfretail.com${imgSrc}`;

          const imageFileName = path.basename(fullImageUrl);
          await downloadImage(fullImageUrl, imageFileName);

          allProducts.push({
            id: `cu-${productIdCounter++}`,
            convini: "cu",
            name,
            price,
            imageUrl: imageFileName,
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

module.exports = { crawlCU };
