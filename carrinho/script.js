
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.querySelector(".main-nav");

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", () => {
            const opened = siteNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(opened));
        });

        siteNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                siteNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const notificationButton = document.querySelector(".notification-trigger");
    const notificationPanel = document.querySelector(".notification-panel");

    if (notificationButton && notificationPanel) {
        notificationButton.addEventListener("click", () => {
            const isHidden = notificationPanel.hasAttribute("hidden");
            if (isHidden) {
                notificationPanel.removeAttribute("hidden");
            } else {
                notificationPanel.setAttribute("hidden", "");
            }
            notificationButton.setAttribute("aria-expanded", String(isHidden));
        });

        document.addEventListener("click", event => {
            if (
                !notificationPanel.hasAttribute("hidden") &&
                !notificationPanel.contains(event.target) &&
                !notificationButton.contains(event.target)
            ) {
                notificationPanel.setAttribute("hidden", "");
                notificationButton.setAttribute("aria-expanded", "false");
            }
        });
    }
});
