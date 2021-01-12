window.onload = function() {
    setSideBarActive();
    setSideBarPlaygroundActive();
    setNavbarActive();
    setAccordionActive();
}

// Set or Unsets Accordion Active Links
const setAccordionActive = () => {
    let acc = document.getElementsByClassName("accordion");
    if (!acc) return;

    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");

            let img = this.children[0];
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
}

// Main Navigation Active Links
const setNavbarActive = () => {
    let navbarLinks = document.getElementById('navbar');
    if (!navbarLinks) return;

    let currentPage = window.location.pathname.replaceAll('/','');
    for (let i = 0; i < navbarLinks.children.length; i++) {
        if (currentPage === "") {
            navbarLinks.children[0].classList.add('selected');
            break;
        }

        if (navbarLinks.children[i].id === currentPage) {
            navbarLinks.children[i].classList.add('selected');
            break;
        }
    }
}

// Side-bar Active Links
const setSideBarActive = () => {
    let sidebarLinks = document.getElementById('sidebar');
    if (!sidebarLinks) return;

    let currentPage = window.location.pathname.replace('docs','').replaceAll('/','');
    for (let i = 0; i < sidebarLinks.children.length; i++) {
        if(currentPage === "") {
            sidebarLinks.children[1].classList.add('selected');
            break;
        }

        if (sidebarLinks.children[i].id === currentPage) {
            let child = sidebarLinks.children[i];
            child.classList.add('selected');
            break;
        }
    }
}

const setSideBarPlaygroundActive = () => {
    let sidebarLinks = document.getElementById('playground-sidebar');
    if (!sidebarLinks) return;

    for (let i = 0; i < sidebarLinks.children.length; i++) {
        let child = sidebarLinks.children[i];
        child.classList.remove('selected');
    }

    let currentHash = window.location.hash.substr(1);
    for (let i = 0; i < sidebarLinks.children.length; i++) {
        if (sidebarLinks.children[i].id === currentHash) {
            let child = sidebarLinks.children[i];
            child.classList.add('selected');
            break;
        }
    }
}

window.onhashchange = (e) => {
    e.preventDefault();
    setSideBarPlaygroundActive();
}
