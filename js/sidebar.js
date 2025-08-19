const conversaBtn = document.getElementById("conversa");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
sidebar.classList.toggle("active");

conversaBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("shrink");
});