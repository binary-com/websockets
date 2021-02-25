window.onload = function () {
  setSideBarActive();
  setNavbarActive();
  setMobileNavbarActive();
  setAccordionActive();
  handleMobileNav();
  handleMobileNavDropdown();
  setCopyButton();
};

window.onhashchange = (e) => {
  setSideBarPlaygroundActive();
};

const setAccordionActive = () => {
  let acc = document.getElementsByClassName("accordion-header");
  if (!acc) return;

  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
      this.classList.toggle("active");

      let img = this.children[1];
      if (!this.classList.contains("active")) {
        img.src = "/img/plus.svg";
        img.style.transform = `rotate(0deg)`;
      } else {
        img.src = "/img/minus.svg";
        img.style.transform = `rotate(90deg)`;
      }

      let panel = this.nextElementSibling;
      panel.style.display = panel.style.display === "block" ? "none" : "block";
    });
  }
};

const setNavbarActive = () => {
  let navbarLinks = document.getElementById("navbar");
  if (!navbarLinks) return;

  let currentPage = window.location.pathname.split("/")[1].replaceAll("/", "");
  for (let i = 0; i < navbarLinks.children.length; i++) {
    if (currentPage === "") {
      navbarLinks.children[0].classList.add("selected");
      break;
    }
    if (navbarLinks.children[i].id === currentPage) {
      navbarLinks.children[i].classList.add("selected");
      break;
    }
  }
};

const setMobileNavbarActive = () => {
  const canvas_menu = document.getElementById('canvas-menu');
  if (!canvas_menu) return;

  let current_element;
  let current_page = window.location.pathname.split("/")[1].replaceAll("/", "");
  if (current_page === 'docs') {
    openMobileDropdown();
    let sub_page = window.location.pathname.split("/")[2].replaceAll("/", "");
    if (sub_page) {
      current_element = sub_page;
    } else {
      current_element = "quickstart";
    }
  } else if (current_page === "playground") {
    current_element = "playground_link";
  } else {
    current_element = "home";
  }
  const target_element = document.getElementById(current_element);
  target_element.classList.add("selected");
}

function openMobileDropdown() {
  const dropdown = document.getElementById("doc-menu-header")
  .nextElementSibling;
  dropdown.classList.add("show-dropdown");
}

const setSideBarActive = () => {
  let sidebarLinks = document.getElementById("sidebar");
  if (!sidebarLinks) return;

  let currentPage = window.location.pathname
    .replace("docs", "")
    .replaceAll("/", "");
  for (let i = 0; i < sidebarLinks.children.length; i++) {
    if (currentPage === "") {
      sidebarLinks.children[1].classList.add("selected");
      break;
    }
    if (sidebarLinks.children[i].id === currentPage) {
      let child = sidebarLinks.children[i];
      child.classList.add("selected");
      break;
    }
  }
};

const setSideBarPlaygroundActive = () => {
  let sidebarLinks = document.getElementById("playground-sidebar");
  if (!sidebarLinks) return;

  for (let i = 0; i < sidebarLinks.children.length; i++) {
    let child = sidebarLinks.children[i];
    child.classList.remove("selected");
  }

  let currentHash = window.location.hash.substr(1);
  for (let i = 0; i < sidebarLinks.children.length; i++) {
    if (sidebarLinks.children[i].getAttribute("value") === currentHash) {
      let child = sidebarLinks.children[i];
      child.classList.add("selected");
      break;
    }
  }
};

const addPlaygroundLinkEventHandler = () => {
  let links = document.getElementById("playground-sidebar");
  if (!links) return;

  for (let i = 1; i < links.children.length; i++) {
    let child = links.children[i];
    child.removeEventListener("click", (e) => updateSelect(e));
    child.addEventListener("click", (e) => updateSelect(e));
  }
};

const updateSelect = (e) => {
  $("#api-call-selector").val(e.srcElement.getAttribute("value"));
  $("#api-call-selector").trigger("change");
  setSideBarPlaygroundActive();
};

const handleMobileNav = () => {
  const hamburger = document.getElementById("hamburger");
  if (!hamburger) return;
  hamburger.removeEventListener("click", handleHamburgerClick);
  hamburger.addEventListener("click", handleHamburgerClick);
};

function handleHamburgerClick() {
  const canvas = document.getElementById("canvas-menu");
  if (!canvas) return;
  canvas.classList.toggle("show-canvas");

  if (canvas.classList.contains("show-canvas")) {
    document.addEventListener("click", handleOutsideCanvasClick);
    this.src = "/img/close.svg";
  } else {
    document.removeEventListener("click", handleOutsideCanvasClick);
    this.src = "/img/hamburger_menu.svg";
  }
}

function handleOutsideCanvasClick(e) {
  const canvas = document.getElementById("canvas-menu");
  const navigation = document.getElementById("main-nav");
  if (!canvas.contains(e.target) && !navigation.contains(e.target)) {
    canvas.classList.remove("show-canvas");
    document.getElementById("hamburger").src = "/img/hamburger_menu.svg";
    document.removeEventListener("click", handleOutsideCanvasClick);
  }
}

const handleMobileNavDropdown = () => {
  let dropdown = document.getElementById("doc-menu-header");
  if (!dropdown) return;
  dropdown.removeEventListener("click", handleDropdownClick);
  dropdown.addEventListener("click", handleDropdownClick);
};

function handleDropdownClick(e) {
  const dropdown = document.getElementById("doc-menu-header")
    .nextElementSibling;
  dropdown.classList.toggle("show-dropdown");
}

function setCopyButton() {
  const code_headers = document.getElementsByClassName("copy-button");
  if (!code_headers) return;
  for (let i = 0; i < code_headers.length; i++) {
    code_headers[i].removeEventListener("click", handleDropdownClick);
    code_headers[i].addEventListener("click", handleCodeCopyClick);
  }
}

function handleCodeCopyClick() {
  let code_box = this.parentNode;
  if (!code_box) return;

  let code_text;
  if (code_box.className === "card-light") {
    code_text = code_box.children[0].textContent.trim();
  } else {
    code_box = code_box.nextElementSibling;
    if (code_box.children.length === 14) {
      code_box = code_box.children;
      let select_value = document.getElementById("demo-language").value;
      for (let i = 0; i < code_box.length; i++) {
        if (code_box[i].attributes[0].value === select_value) {
          code_text = code_box[i].textContent;
        }
      }
    } else {
      code_text = code_box.textContent;
    }
  }

  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = code_text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
