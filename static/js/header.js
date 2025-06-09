for (let i = 1; i < 6; i++) {
  const store = document.querySelector(`.section1 .part2 .store${i}`);
  const menu = document.querySelector(`.section1 .part2 .menu${i}`);
  const storeDetail = document.querySelector(
    `.section1 > .container > .part2 > .navbar > .store${i} > li:nth-of-type(1)`,
  );
  store.addEventListener("mouseover", () => {
    store.style.backgroundColor = "var(--color-600)";
    storeDetail.style.textDecoration = "underline";
    menu.style.backgroundColor = "var(--color-600)";
    menu.style.height = "150px";
    menu.for;
  });
  store.addEventListener("mouseleave", () => {
    store.style.backgroundColor = "";
    storeDetail.style.textDecoration = "none";
    menu.style.backgroundColor = "";
    menu.style.height = "0px";
  });
}

const logout = document.querySelector(".part1 .logout");
if (logout) {
  logout.addEventListener("click", async () => {
    try {
      const result = await axios({
        url: "/logout",
        method: "get",
      });
    } catch (err) {
      console.error("err", err);
    }
  });
}

const burger = document.querySelector(
  ".section1 > .container > .part1 .burger",
);
const body = document.querySelector("body");
const navbar = document.querySelector(".section1 > .container > .part2");
// const section2 = document.querySelector(".section2 ");
const section2 = document.querySelector(".sectionContainer ");
burger.addEventListener("click", () => {
  navbar.classList.toggle("navbarHidden");
  navbar.classList.toggle("navbarVisible");
  // section2.classList.toggle("top1");
  // section2.classList.toggle("top2");

  section2.classList.toggle("top1");
  section2.classList.toggle("top2");
});
