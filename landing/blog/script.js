document.addEventListener("DOMContentLoaded", () => {
    const logged = localStorage.getItem("halltechLoggedIn") === "true";
    document.body.classList.toggle("logged-in", logged);

    const menuToggle = document.querySelector(".menu-toggle");
    const publicNav = document.querySelector(".public-nav");
    const loggedNav = document.querySelector(".logged-nav");
    const activeNav = logged ? loggedNav : publicNav;

    if (menuToggle && activeNav) {
        menuToggle.addEventListener("click", () => {
            const open = activeNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(open));
        });

        activeNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                activeNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const notificationButton = document.querySelector(".notification-trigger");
    const notificationPanel = document.querySelector(".notification-panel");

    if (notificationButton && notificationPanel) {
        notificationButton.addEventListener("click", event => {
            event.stopPropagation();
            const closed = notificationPanel.hasAttribute("hidden");
            if (closed) notificationPanel.removeAttribute("hidden");
            else notificationPanel.setAttribute("hidden", "");
            notificationButton.setAttribute("aria-expanded", String(closed));
        });

        document.addEventListener("click", event => {
            if (!notificationPanel.hasAttribute("hidden") &&
                !notificationPanel.contains(event.target) &&
                !notificationButton.contains(event.target)) {
                notificationPanel.setAttribute("hidden", "");
                notificationButton.setAttribute("aria-expanded", "false");
            }
        });
    }

    const billingButtons = document.querySelectorAll(".billing-option");
    const prices = document.querySelectorAll(".plan-price");
    const notes = document.querySelectorAll(".plan-note");

    billingButtons.forEach(button => {
        button.addEventListener("click", () => {
            billingButtons.forEach(item => item.classList.remove("active"));
            button.classList.add("active");
            const billing = button.dataset.billing;
            prices.forEach(price => {
                const value = price.dataset[billing];
                if (value) price.querySelector("span").textContent = `R$ ${value}`;
            });
            notes.forEach(note => {
                const value = note.dataset[`${billing}Note`];
                if (value) note.textContent = value;
            });
        });
    });
});
