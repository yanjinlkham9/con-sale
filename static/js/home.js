// section2
const detail = document.querySelector(".section2 .detail");
detail.addEventListener("click", () => {
  const width = window.innerWidth;
  if (width < 468) {
    window.scrollTo({
      top: 1280,
      behavior: "smooth",
    });
  } else if (468 <= width && width < 768) {
    window.scrollTo({
      top: 1280,
      behavior: "smooth",
    });
  } else if (768 <= width && width < 1024) {
    window.scrollTo({
      top: 952,
      behavior: "smooth",
    });
  } else if (1024 < width) {
    window.scrollTo({
      top: 977,
      behavior: "smooth",
    });
  }
});

const arrow = document.querySelector(".section2 > .part2 > .arrow");
arrow.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
});

//  section3
const swiper = new Swiper(".swiper", {
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    bulletActiveClass: "on",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },

    768: { slidesPerView: 2, centeredSlides: true },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
});

const stopBtn = document.querySelector(".stopBtn");
stopBtn.addEventListener("click", () => {
  const running = swiper.autoplay.running;

  if (running) {
    swiper.autoplay.stop();
    stopBtn.src = "./static/image/stopbtn1.png";
  } else if (!running) {
    swiper.autoplay.start();
    stopBtn.src = "./static/image/stopbtn2.png";
  }
});

swiper.on("slideChange", () => {
  const active = swiper.activeIndex;
  const slide = swiper.slides[active];
  const allView = document.querySelectorAll(".section3 .view");
  allView.forEach((el) => {
    el.style.opacity = "0";
  });
  const view = slide.querySelector(".view");
  view.style.opacity = "1";
  swiper.slides.forEach((el) => (el.style.opacity = "0.3"));

  slide.style.opacity = "1";
});

for (let i = 1; i < 5; i++) {
  const slide = document.querySelector(`.section3 .slide${i}`);
  const view = slide.querySelector(".view");
  const modal = document.querySelector(`.section3 .modal${i}`);
  const modalBtn = document.querySelector(`.section3 .modalCloseBtn${i}`);
  slide.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";
  });
  view.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    document.body.style.overflow = "hidden";
  });
  modalBtn.addEventListener("click", () => {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
    document.body.style.removeProperty("overflow");
  });
}

// section5
// cu배너
const product = document.querySelector(".section5 > .container > .product");
const container = document.querySelector(".section5 > .container");
// const clone = product.cloneNode(true);
product.classList.add("rolling1");
// clone.classList.add("rolling2");
// container.appendChild(clone);
// gs배너
const product2 = document.querySelector(".section6 > .container > .product");
const container2 = document.querySelector(".section6 > .container");
// const clone2 = product2.cloneNode(true);
product2.classList.add("rolling1");
// clone2.classList.add("rolling2");
// container2.appendChild(clone2);
// 세븐배너
const product3 = document.querySelector(".section7 > .container > .product");
const container3 = document.querySelector(".section7 > .container");
// const clone3 = product3.cloneNode(true);
product3.classList.add("rolling1");
// clone3.classList.add("rolling2");
// container3.appendChild(clone3);

// section4
const allBtn = document.querySelector(
  ".section4 >.container > .part2 >ul >.all ",
);
const oneBtn = document.querySelector(
  ".section4 >.container  >.part2 >ul >.one ",
);
const twoBtn = document.querySelector(
  ".section4 >.container  >.part2 >ul >.two ",
);

const menu = document.querySelectorAll(
  ".section5 > .container > .product >.menu",
);
const menu2 = document.querySelectorAll(
  ".section5 > .container > .rolling2 >.menu",
);
const menu3 = document.querySelectorAll(
  ".section6 > .container > .product >.menu",
);
const menu4 = document.querySelectorAll(
  ".section6 > .container > .rolling2 >.menu",
);
const menu5 = document.querySelectorAll(
  ".section7 > .container > .product >.menu",
);
const menu6 = document.querySelectorAll(
  ".section7 > .container > .rolling2 >.menu",
);

allBtn.addEventListener("click", () => {
  product.classList.remove("rolling3");
  product.classList.add("rolling1");
  clone.classList.remove("rolling4");
  clone.classList.add("rolling2");
  product2.classList.remove("rolling3");
  product2.classList.add("rolling1");
  clone2.classList.remove("rolling4");
  clone2.classList.add("rolling2");
  product3.classList.remove("rolling3");
  product3.classList.add("rolling1");
  clone3.classList.remove("rolling4");
  clone3.classList.add("rolling2");

  menu.forEach((el) => {
    el.style.display = "block";
  });
  menu2.forEach((el) => {
    el.style.display = "block";
  });
  menu3.forEach((el) => {
    el.style.display = "block";
  });
  menu4.forEach((el) => {
    el.style.display = "block";
  });
  menu5.forEach((el) => {
    el.style.display = "block";
  });
  menu6.forEach((el) => {
    el.style.display = "block";
  });
});

oneBtn.addEventListener("click", () => {
  product.classList.remove("rolling1");
  product.classList.add("rolling3");
  clone.classList.remove("rolling2");
  clone.classList.add("rolling4");
  product2.classList.remove("rolling1");
  product2.classList.add("rolling3");
  clone2.classList.remove("rolling2");
  clone2.classList.add("rolling4");
  product3.classList.remove("rolling1");
  product3.classList.add("rolling3");
  clone3.classList.remove("rolling2");
  clone3.classList.add("rolling4");

  menu.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu2.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu3.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu4.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu5.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu6.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "1+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
});

twoBtn.addEventListener("click", () => {
  product.classList.remove("rolling1");
  product.classList.add("rolling3");
  clone.classList.remove("rolling2");
  clone.classList.add("rolling4");
  product2.classList.remove("rolling1");
  product2.classList.add("rolling3");
  clone2.classList.remove("rolling2");
  clone2.classList.add("rolling4");
  product3.classList.remove("rolling1");
  product3.classList.add("rolling3");
  clone3.classList.remove("rolling2");
  clone3.classList.add("rolling4");

  menu.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu2.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu3.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu4.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu5.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
  menu6.forEach((el) => {
    const sale = el.querySelector(".event").textContent.trim();
    if (sale == "2+1") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
});

// section8

const search = document.querySelector(
  ".section8 > .container > .part1 > .searchBox> .search",
);
const searchText = document.querySelector(
  ".section8 > .container > .part1 > .searchBox> .searchText",
);
search.addEventListener("click", async () => {
  try {
    if (!searchText.checkValidity()) {
      alert("제품의 한글명을 입력해주세요");

      return;
    }
    if (searchText.value.trim() === "" || searchText.value.trim().length > 10) {
      alert("검색어를 입력해주세요!");

      return;
    } else {
      const productName = searchText.value;
      const result = await axios({
        url: "/search",
        method: "get",
        params: {
          productName,
        },
      });
      document.location.href = `/search?productName=${productName}`;
    }
  } catch (err) {
    console.error(err);
  }
});

searchText.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    try {
      if (!searchText.checkValidity()) {
        alert("제품의 한글명을 입력해주세요");
        return;
      }
      if (
        searchText.value.trim() === "" ||
        searchText.value.trim().length > 10
      ) {
        alert("검색어를 입력해주세요!");
        return;
      } else {
        const productName = searchText.value;
        const result = await axios({
          url: "/search",
          method: "get",
          params: {
            productName,
          },
        });
        document.location.href = `/search?productName=${productName}`;
      }
    } catch (err) {
      console.error(err);
    }
  }
});

// section9
async function emailVerify() {
  try {
    const email = document
      .querySelector(".section9 > .container> .inner> .email")
      .value.trim();
    const email2 = document.querySelector(
      ".section9 > .container> .inner> .email",
    );

    if (!email2.checkValidity()) {
      alert("example@naver.com 형식에 맞게 이메일을 작성해주세요");
      return;
    }

    if (email2 === "" || email2.length > 50) {
      alert("형식에 맞게 이메일을 작성해주세요");
      return;
    }
    const result = await axios({
      url: "/email",
      method: "post",
      data: {
        email,
      },
    });
    const { message } = result.data;
    alert(message);
  } catch (err) {
    console.error(err);
  }
}

const emailInput = document.querySelector(
  ".section9 > .container > .inner >.email",
);
emailInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    try {
      const email = document
        .querySelector(".section9 > .container> .inner> .email")
        .value.trim();
      const email2 = document.querySelector(
        ".section9 > .container> .inner> .email",
      );

      if (!email2.checkValidity()) {
        alert("example@naver.com 형식에 맞게 이메일을 작성해주세요");
        return;
      }

      if (email2 === "" || email2.length > 50) {
        alert("형식에 맞게 이메일을 작성해주세요");
        return;
      }
      const result = await axios({
        url: "/email",
        method: "post",
        data: {
          email,
        },
      });
      const { message } = result.data;
      alert(message);
    } catch (err) {
      console.error(err);
    }
  }
});

window.addEventListener("scroll", () => {
  let scroll = window.scrollY;
  const width = window.innerWidth;
  const menu1 = document.querySelector(
    ".section8 > .container > .part2 > .menu1",
  );
  const menu2 = document.querySelector(
    ".section8 > .container > .part2 > .menu2",
  );
  const menu3 = document.querySelector(
    ".section8 > .container > .part2 > .menu3",
  );
  const menu4 = document.querySelector(
    ".section8 > .container > .part2 > .menu4",
  );

  if (width < 480) {
    if (scroll > 1780) {
      menu1.style.animation = "opacity1 0.5s forwards";
      menu2.style.animation = "opacity1 0.5s 0.5s forwards";
      menu3.style.animation = "opacity1 0.5s 1s forwards";
      menu4.style.animation = "opacity1 0.5s 1.5s forwards";
    } else {
      menu1.style.animation = "unOpacity 0.5s forwards";
      menu2.style.animation = "unOpacity 0.5s 0.5s forwards";
      menu3.style.animation = "unOpacity 0.5s 1s forwards";
      menu4.style.animation = "unOpacity 0.5s 1.5s forwards";
    }
  } else if (480 <= width && width < 768) {
    if (scroll > 1830) {
      menu1.style.animation = "opacity1 0.5s forwards";
      menu2.style.animation = "opacity1 0.5s 0.5s forwards";
      menu3.style.animation = "opacity1 0.5s 1s forwards";
      menu4.style.animation = "opacity1 0.5s 1.5s forwards";
    } else {
      menu1.style.animation = "unOpacity 0.5s forwards";
      menu2.style.animation = "unOpacity 0.5s 0.5s forwards";
      menu3.style.animation = "unOpacity 0.5s 1s forwards";
      menu4.style.animation = "unOpacity 0.5s 1.5s forwards";
    }
  } else if (768 <= width && width < 1024) {
    if (scroll > 1450) {
      menu1.style.animation = "opacity1 0.5s forwards";
      menu2.style.animation = "opacity1 0.5s 0.5s forwards";
      menu3.style.animation = "opacity1 0.5s 1s forwards";
      menu4.style.animation = "opacity1 0.5s 1.5s forwards";
    } else {
      menu1.style.animation = "unOpacity 0.5s forwards";
      menu2.style.animation = "unOpacity 0.5s 0.5s forwards";
      menu3.style.animation = "unOpacity 0.5s 1s forwards";
      menu4.style.animation = "unOpacity 0.5s 1.5s forwards";
    }
  } else if (1024 < width) {
    if (scroll > 1480) {
      menu1.style.animation = "opacity1 0.5s forwards";
      menu2.style.animation = "opacity1 0.5s 0.5s forwards";
      menu3.style.animation = "opacity1 0.5s 1s forwards";
      menu4.style.animation = "opacity1 0.5s 1.5s forwards";
    } else {
      menu1.style.animation = "unOpacity 0.5s forwards";
      menu2.style.animation = "unOpacity 0.5s 0.5s forwards";
      menu3.style.animation = "unOpacity 0.5s 1s forwards";
      menu4.style.animation = "unOpacity 0.5s 1.5s forwards";
    }
  }
});
window.addEventListener("scroll", () => {
  const scroll = window.scrollY;
  const section9 = document.querySelector(".section9 > .container ");
  const width = window.innerWidth;
  if (width < 480) {
    if (scroll > 2140) {
      section9.style.opacity = "1";
    } else {
      section9.style.opacity = "0";
    }
  } else if (480 <= width && width < 768) {
    if (scroll > 2185) {
      section9.style.opacity = "1";
    } else {
      section9.style.opacity = "0";
    }
  } else if (768 <= width && width < 1024) {
    if (scroll > 1720) {
      section9.style.opacity = "1";
    } else {
      section9.style.opacity = "0";
    }
  } else if (1024 < width) {
    if (scroll > 1757) {
      section9.style.opacity = "1";
    } else {
      section9.style.opacity = "0";
    }
  }
});

window.addEventListener("scroll", () => {
  const scroll = window.scrollY;
  const width = window.innerWidth;
  const emailInput = document.querySelector(".section9 > .container > .inner ");
  if (width < 480) {
    if (scroll > 2330) {
      emailInput.style.bottom = "-200px";
      emailInput.style.opacity = "1";
    } else {
      emailInput.style.bottom = "-20%";
      emailInput.style.opacity = "0";
    }
  } else if (480 <= width && width < 768) {
    if (scroll > 2360) {
      emailInput.style.bottom = "-266px";
      emailInput.style.opacity = "1";
    } else {
      emailInput.style.bottom = "-20%";
      emailInput.style.opacity = "0";
    }
  } else if (768 <= width && width < 1024) {
    if (scroll > 1870) {
      emailInput.style.bottom = "-200px";
      emailInput.style.opacity = "1";
    } else {
      emailInput.style.bottom = "-20%";
      emailInput.style.opacity = "0";
    }
  } else if (1024 < width) {
    if (scroll > 1984) {
      emailInput.style.bottom = "-250px";
      emailInput.style.opacity = "1";
    } else {
      emailInput.style.bottom = "-20%";
      emailInput.style.opacity = "0";
    }
  }
});
