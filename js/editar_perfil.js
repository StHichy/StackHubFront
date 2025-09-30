document.addEventListener("DOMContentLoaded", () => {

    // --- toggle portfólio ---
    const toggleBtn = document.getElementById("togglePortfolio");
    const closeBtn = document.getElementById("closePortfolio");
    const portfolioCard = document.querySelector(".portfolio-card");
    const cardPrincipal = document.querySelector(".card-principal");

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // não é estritamente necessário aqui, mas mantém seguro
        portfolioCard.hidden = true;
        cardPrincipal.hidden = false;
    });

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // mantém apenas no toggle
        portfolioCard.hidden = !portfolioCard.hidden;
        cardPrincipal.hidden = !portfolioCard.hidden;
    });

    const conversaBtn = document.getElementById("conversa");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    sidebar.classList.toggle("active");
    
    conversaBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        mainContent.classList.toggle("shrink");
    });

});