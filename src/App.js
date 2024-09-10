const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});

const header = document.querySelector("header");
window.addEventListener("scroll", function () {
  // header.classList.toggle("sticky", window.scrollY > 100);

  if (window.scrollY > 100) {
    header.classList.toggle("sticky", window.scrollY > 0);
    header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  } else {
    header.style.backgroundColor = "transparent";
  }
});

const btnTheme = document.getElementById("themeButton");

btnTheme.addEventListener("Click", () => {
  document.body.classList.toggle("light");
});

/* const button = document.getElemtenById('change-color-button');
   button.addEventListener('click', () => {
   document.body.style.backgroundColor = document.body.style.backgroundColor === 'black' ? 'white' : 'black';
        });
}*/
