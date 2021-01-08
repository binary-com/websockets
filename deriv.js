window.onload = function() {
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
}