$(document).ready(function () {
  // Carregar sidebar externa
  $("#sidebar-container").load("sidebar.html", function () {
    const $sidebar = $(".sidebar");
    const $mainContent = $(".main-content");

    $sidebar.addClass("active"); 

    $("#conversa").on("click", function () {
      $sidebar.toggleClass("active");
      $mainContent.toggleClass("shrink");
    });
  });
});

const conversaBtn = document.getElementById("conversa");
const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
sidebar.classList.toggle("active");

conversaBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    mainContent.classList.toggle("shrink");
});
