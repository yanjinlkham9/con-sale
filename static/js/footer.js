const git = document.querySelectorAll(".footer > .container > ul > li");
git.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    el.style.textDecoration = "underline";
    const Img = el.querySelector("img");
    Img.style.opacity = "1";
    Img.style.bottom = "100%";
  });

  el.addEventListener("mouseleave", () => {
    el.style.textDecoration = "none";
    const Img = el.querySelector("img");
    Img.style.opacity = "0";
    Img.style.bottom = "0%";
  });
});
