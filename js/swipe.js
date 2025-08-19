document.addEventListener("DOMContentLoaded", () => {
    // --- toggle portfólio ---
    const toggleBtn = document.getElementById("togglePortfolio");
    const closeBtn = document.getElementById("closePortfolio");
    const portfolioCard = document.querySelector(".portfolio-card");

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        portfolioCard.toggleAttribute("hidden");
    });
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        portfolioCard.toggleAttribute("hidden");
    });

    const conversaBtn = document.getElementById("conversa");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    sidebar.classList.toggle("active");
    
    conversaBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        mainContent.classList.toggle("shrink");
    });

    // --- Swipe estilo Tinder ---
    const card = document.getElementById("swipeCard");
    const chooseBar = document.querySelector(".card-choose");
    const actionButtons = chooseBar ? chooseBar.querySelectorAll("[data-action]") : [];

    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let dragging = false;

    const ROTATION_FACTOR = 0.05;
    const EXIT_DURATION = 300;

    // evita drag em botões internos
    card.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("pointerdown", e => e.stopPropagation(), true);
        btn.addEventListener("mousedown", e => e.stopPropagation(), true);
        btn.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
    });

    const pointerDown = (clientX, clientY) => {
        dragging = true;
        startX = clientX;
        startY = clientY;
        currentX = 0;
        currentY = 0;
        card.classList.add("swiping");
    };

    const pointerMove = (clientX, clientY) => {
        if (!dragging) return;
        currentX = clientX - startX;
        currentY = clientY - startY;
        const rot = currentX * ROTATION_FACTOR;
        card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rot}deg)`;
    };

    const dispatchSwipeEvent = (dir) => {
        const ev = new CustomEvent("cardswipe", { detail: { direction: dir } });
        card.dispatchEvent(ev);
    };

    const resetCard = () => {
        card.classList.remove("exiting");
        card.style.transform = "";
        card.style.opacity = "";
    };

    const animateExit = (dir) => {
        card.classList.remove("swiping");
        card.classList.add("exiting");

        const vw = Math.max(window.innerWidth, card.offsetWidth);
        const rot = (dir === "right" ? 30 : dir === "left" ? -30 : 0);

        let endX = 0, endY = 0;
        if (dir === "right") endX = vw;
        if (dir === "left")  endX = -vw;
        if (dir === "up")    endY = -vw;

        card.style.transform = `translate(${endX}px, ${endY || currentY * 1.2}px) rotate(${rot}deg)`;
        card.style.opacity = "0";

        dispatchSwipeEvent(dir);

        setTimeout(() => resetCard(), EXIT_DURATION);
    };

    const pointerUp = () => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove("swiping");

        const threshold = card.offsetWidth * 0.25;
        const absX = Math.abs(currentX);
        const absY = Math.abs(currentY);

        if (absX > threshold) {
            animateExit(currentX > 0 ? "right" : "left");
        } else if (absY > threshold * 1.1 && currentY < 0) {
            animateExit("up");
        } else {
            card.classList.add("exiting");
            card.style.transform = "";
            setTimeout(() => card.classList.remove("exiting"), EXIT_DURATION);
        }
    };

    // Pointer Events
    card.addEventListener("pointerdown", (e) => {
        card.setPointerCapture(e.pointerId);
        pointerDown(e.clientX, e.clientY);
    });
    card.addEventListener("pointermove", (e) => pointerMove(e.clientX, e.clientY));
    card.addEventListener("pointerup", pointerUp);
    card.addEventListener("pointercancel", pointerUp);
    card.addEventListener("pointerleave", () => dragging && pointerUp());

    // Botões
    const triggerSwipe = (dir) => {
        currentY = 0;
        currentX = dir === "right" ? card.offsetWidth : dir === "left" ? -card.offsetWidth : 0;
        animateExit(dir);
    };
    actionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            if (action === "like") triggerSwipe("right");
            if (action === "dislike") triggerSwipe("left");
            if (action === "superlike") triggerSwipe("up");
        });
    });

    // --- PERFIS + MENSAGEM ---
    const profiles = [
        { img: "imagens/programdor.jpg", name: "Carlinhos, 22" },
        { img: "imagens/dev2.jpg", name: "Alexandre, 25" },
        { img: "imagens/dev3.jpg", name: "Arthur, 28" }
    ];
    let profileIndex = 0;

    function loadProfile(index) {
        const photo = card.querySelector(".photo");
        const nameEl = card.querySelector(".name");
        photo.style.backgroundImage = `url(${profiles[index].img})`;
        nameEl.textContent = profiles[index].name;
    }

    // Modifique a função showMessage no JS
    function showMessage(type) {
        const msg = document.getElementById("swipeMessage");
        const centralMsg = document.getElementById("centralMessage");
        
        // Remove classes anteriores do body
        document.body.classList.remove('bg-dislike', 'bg-like', 'bg-superlike');
        
        if (type === "right") {
            centralMsg.textContent = "LIKE!";
            centralMsg.style.color = "#00ff00";
            document.body.classList.add('bg-like');
        } else if (type === "left") {
            centralMsg.textContent = "NOPE!";
            centralMsg.style.color = "#ff0000";
            document.body.classList.add('bg-dislike');
        } else if (type === "up") {
            centralMsg.textContent = "SUPER LIKE!";
            centralMsg.style.color = "#800080";
            document.body.classList.add('bg-superlike');
        }

        msg.classList.add("show");
        centralMsg.classList.add("show");

        setTimeout(() => {
            msg.classList.remove("show");
            centralMsg.classList.remove("show");
        }, 1500);
    }

    // inicia com o primeiro
    loadProfile(profileIndex);

    // agora sim: só trata swipe
    card.addEventListener("cardswipe", (e) => {
        const dir = e.detail.direction;
        showMessage(dir);

        profileIndex = (profileIndex + 1) % profiles.length;
        loadProfile(profileIndex);
    });
});
