window.onload = function() {
    // Side-bar Active Links
    let sidebarLinks = document.getElementById('sidebar');
    let currentPage = window.location.pathname.replaceAll('/','');
    if (!sidebarLinks) return;
    for (let i = 0; i < sidebarLinks.children.length; i++) {
        console.log(sidebarLinks.children[i]);
        if (sidebarLinks.children[i].id === currentPage) {
            let child = sidebarLinks.children[i];
            child.classList.add('selected');
            break;
        }
    }

    // Accordion Active Links
    let acc = document.getElementsByClassName("accordion");
    if (!acc) return;
    let i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");

            let panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }
}