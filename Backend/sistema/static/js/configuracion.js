function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';

    const links = document.querySelectorAll('.settings-menu a');
    links.forEach((link) => {
        link.classList.remove('active');
    });
    const activeLink = Array.from(links).find(link => link.textContent.toLowerCase() === section);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}