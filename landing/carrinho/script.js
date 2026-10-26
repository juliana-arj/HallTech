
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

document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "halltech_cart";
    const container = document.getElementById("cart-items-container");
    const emptyMessage = document.getElementById("cart-empty");
    const title = document.getElementById("cart-items-title");
    const summaryCount = document.getElementById("cart-summary-count");
    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("cart-checkout");

    const money = value => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch {
            return [];
        }
    }

    function renderCart() {
        const cart = getCart();

        const validItems = cart.filter(item =>
            item &&
            Number.isFinite(Number(item.total)) &&
            Number(item.total) >= 0 &&
            (
                (item.type === "hospedagem" && typeof item.name === "string") ||
                (typeof item.domain === "string")
            )
        );

        const subtotal = validItems.reduce((sum, item) => sum + Number(item.total), 0);
        const count = validItems.length;

        title.textContent = `${count} ${count === 1 ? "item no carrinho" : "itens no carrinho"}`;
        summaryCount.textContent = count;
        subtotalElement.textContent = money(subtotal);
        totalElement.textContent = money(subtotal);

        emptyMessage.hidden = count !== 0;
        container.hidden = count === 0;
        checkoutButton.style.pointerEvents = count === 0 ? "none" : "";
        checkoutButton.style.opacity = count === 0 ? "0.5" : "";
        checkoutButton.setAttribute("aria-disabled", String(count === 0));

        if (count === 0) {
            container.innerHTML = "";
            return;
        }

        container.innerHTML = validItems.map(item => {
            const index = cart.indexOf(item);
            const isHosting = item.type === "hospedagem";
            const name = isHosting ? item.name : item.domain;
            const description = isHosting ? "Hospedagem Cloud" : "Registro de domínio";
            const detail = isHosting
                ? (item.period === "anual" ? "Plano anual" : "Plano trimestral")
                : `${Number(item.years) || 1} ${(Number(item.years) || 1) === 1 ? "ano" : "anos"}`;
            const price = Number(item.total) || 0;

            return `
            <article class="card card-pad cart-product" style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:16px; min-width:0;">
                    <div style="width:48px; height:48px; flex-shrink:0; border-radius:12px; background:var(--blue-50); color:var(--blue-700); display:flex; align-items:center; justify-content:center;">
                        ${isHosting
                    ? `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></svg>`
                    : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
                }
                    </div>
                    <div style="min-width:0; overflow-wrap:anywhere;">
                        <div style="font-size:16px; font-weight:700;">${escapeHTML(name)}</div>
                        <div class="small muted">${description}</div>
                        <div class="small muted">${detail}</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:16px; flex-shrink:0;">
                    <div style="font-size:16px; font-weight:700; text-align:right;">${money(price)}</div>
                    <button type="button" class="icon-btn cart-remove-button" data-remove-index="${index}" aria-label="Remover ${escapeHTML(name)}" style="background:var(--danger-bg); color:var(--danger);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/>
                        </svg>
                    </button>
                </div>
            </article>
        `;
        }).join("");
    }

    function removeItem(index) {
        const cart = getCart();

        if (index < 0 || index >= cart.length) {
            return;
        }

        cart.splice(index, 1);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));

        renderCart();
        window.dispatchEvent(new Event("halltech:cart-changed"));
    }

    container.addEventListener("click", event => {
        const button = event.target.closest("[data-remove-index]");

        if (button) {
            removeItem(Number(button.dataset.removeIndex));
        }
    });

    window.addEventListener("storage", event => {
        if (event.key === CART_KEY) {
            renderCart();
        }
    });

    window.addEventListener("halltech:cart-changed", renderCart);

    renderCart();
});


document.addEventListener("DOMContentLoaded", async () => {
    const CART_KEY = "halltech_cart";
    const client = typeof supabaseClient !== "undefined" ? supabaseClient : null;

    const fields = {
        nome: document.getElementById("cliente-nome"),
        documento: document.getElementById("cliente-documento"),
        email: document.getElementById("cliente-email"),
        telefone: document.getElementById("cliente-telefone"),
        cep: document.getElementById("cobranca-cep"),
        endereco: document.getElementById("cobranca-endereco"),
        bairro: document.getElementById("cobranca-bairro"),
        cidade: document.getElementById("cobranca-cidade"),
        estado: document.getElementById("cobranca-estado")
    };

    const money = value => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    function getValue(profile, keys) {
        for (const key of keys) {
            const value = profile?.[key];

            if (value !== null && value !== undefined && String(value).trim() !== "") {
                return String(value);
            }
        }

        return "";
    }

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
            return Array.isArray(cart) ? cart : [];
        } catch {
            return [];
        }
    }

    function renderCart() {
        const container = document.getElementById("checkout-items");
        const totalElement = document.getElementById("checkout-total");
        const confirmButton = document.getElementById("checkout-confirm");

        if (!container || !totalElement || !confirmButton) {
            return;
        }

        const cart = getCart().filter(item =>
            item &&
            Number.isFinite(Number(item.total)) &&
            Number(item.total) >= 0 &&
            (
                (item.type === "hospedagem" && typeof item.name === "string") ||
                typeof item.domain === "string"
            )
        );

        const total = cart.reduce((sum, item) => sum + Number(item.total), 0);

        container.innerHTML = cart.length
            ? cart.map(item => {
                const isHosting = item.type === "hospedagem";
                const name = isHosting ? item.name : item.domain;
                const detail = isHosting
                    ? (item.period === "anual" ? "Plano anual" : "Plano trimestral")
                    : `${Number(item.years) || 1} ${(Number(item.years) || 1) === 1 ? "ano" : "anos"}`;

                return `
                <div class="row-between small" style="margin-bottom:12px; gap:16px;">
                    <span class="muted">${escapeHTML(name)} — ${isHosting ? "Hospedagem Cloud" : "Domínio"} (${detail})</span>
                    <span>${money(Number(item.total))}</span>
                </div>
            `;
            }).join("")
            : '<p class="small muted" style="margin-bottom:16px;">Seu carrinho está vazio.</p>';

        totalElement.textContent = money(total);
        confirmButton.style.pointerEvents = cart.length ? "" : "none";
        confirmButton.style.opacity = cart.length ? "" : "0.5";
        confirmButton.setAttribute("aria-disabled", String(cart.length === 0));
    }

    async function loadProfile() {
        if (!client) {
            alert("Não foi possível conectar ao sistema. Atualize a página e tente novamente.");
            return;
        }

        const { data: sessionData, error: sessionError } = await client.auth.getSession();

        if (sessionError || !sessionData.session) {
            window.location.href = "../../login/index.html";
            return;
        }

        const user = sessionData.session.user;

        const { data: profile, error } = await client
            .from("usuarios")
            .select("*")
            .eq("id_usuario", user.id)
            .maybeSingle();

        if (error) {
            console.error("Erro ao buscar perfil:", error);
            alert("Não foi possível carregar os dados do seu perfil.");
            return;
        }

        const values = {
            nome: getValue(profile, ["nome_completo", "nome", "name", "full_name"]),
            documento: getValue(profile, ["cpf_cnpj", "cpf", "cnpj", "documento"]),
            email: getValue(profile, ["email"]) || user.email || "",
            telefone: getValue(profile, ["telefone", "celular", "telefone_contato"]),
            cep: getValue(profile, ["cep", "codigo_postal"]),
            endereco: getValue(profile, ["endereco", "logradouro", "endereco_completo"]),
            bairro: getValue(profile, ["bairro"]),
            cidade: getValue(profile, ["cidade", "municipio"]),
            estado: getValue(profile, ["estado", "uf"])
        };

        Object.entries(fields).forEach(([key, input]) => {
            if (input) {
                input.value = values[key];
            }
        });
    }

    renderCart();
    await loadProfile();
});

document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "halltech_cart";
    const ORDER_KEY = "halltech_last_order";

    if (window.location.pathname.endsWith("pagamento-aprovado.html")) {
        localStorage.setItem("halltech_cart", JSON.stringify([]));
        window.dispatchEvent(new Event("halltech:cart-changed"));
    }

    const orderNumber = document.getElementById("pedido-numero");
    const orderItems = document.getElementById("pedido-itens");
    const orderTotal = document.getElementById("pedido-total");
    const orderMessage = document.getElementById("pedido-mensagem");
    const receiptButton = document.getElementById("pedido-comprovante");

    const money = value => new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

    function readStorage(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value;
        } catch {
            return null;
        }
    }

    function getCartItems(cart) {
        if (!Array.isArray(cart)) {
            return [];
        }

        return cart.filter(item =>
            item &&
            Number.isFinite(Number(item.total)) &&
            Number(item.total) >= 0 &&
            (
                (item.type === "hospedagem" && typeof item.name === "string") ||
                typeof item.domain === "string"
            )
        );
    }

    function generateOrderNumber() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return "HT-" + window.crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
        }

        return "HT-" + Date.now().toString(36).toUpperCase();
    }

    function clearCart() {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
        window.dispatchEvent(new Event("halltech:cart-changed"));
    }

    function renderOrder() {
        const savedOrder = readStorage(ORDER_KEY);

        if (savedOrder && savedOrder.id && Array.isArray(savedOrder.items)) {
            orderNumber.textContent = savedOrder.id;

            orderItems.innerHTML = cart.map(item => {
                const isHosting = item.type === "hospedagem";
                const name = isHosting ? item.name : item.domain;
                const detail = isHosting
                    ? (item.period === "anual" ? "Plano anual" : "Plano trimestral")
                    : `${Number(item.years) || 1} ${(Number(item.years) || 1) === 1 ? "ano" : "anos"}`;

                            return `
                    <div style="display:flex; justify-content:space-between; gap:16px; margin-bottom:10px;">
                        <span>${escapeHTML(name)} — ${isHosting ? "Hospedagem Cloud" : "Domínio"} (${detail})</span>
                        <span>${money(Number(item.total) || 0)}</span>
                    </div>
                `;
            }).join("");

            orderTotal.textContent = money(Number(savedOrder.total) || 0);

            if (savedOrder.status === "aprovado") {
                clearCart();
                orderMessage.textContent = "Pedido confirmado.";
            } else {
                orderMessage.textContent = "Resumo do pedido. O pagamento ainda precisa ser confirmado pelo sistema de pagamento.";
            }

            return;
        }

        const cart = getCartItems(readStorage(CART_KEY));

        if (!cart.length) {
            orderNumber.textContent = "Não disponível";
            orderItems.textContent = "Nenhum pedido encontrado.";
            orderTotal.textContent = money(0);
            orderMessage.textContent = "Não há um pedido salvo para exibir. Acesse o carrinho para iniciar uma nova compra.";
            return;
        }

        const total = cart.reduce((sum, item) => sum + Number(item.total), 0);
        const id = generateOrderNumber();

        const order = {
            id,
            items: cart,
            total,
            status: "pendente",
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(ORDER_KEY, JSON.stringify(order));

        orderNumber.textContent = id;

        orderItems.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; gap:16px; margin-bottom:10px;">
            <span>${escapeHTML(item.domain)} (${Number(item.years) || 1} ${(Number(item.years) || 1) === 1 ? "ano" : "anos"})</span>
            <span>${money(Number(item.total))}</span>
        </div>
    `).join("");

        orderTotal.textContent = money(total);
        orderMessage.textContent = "Resumo do pedido. O pagamento ainda precisa ser confirmado pelo sistema de pagamento.";
    }

    receiptButton.addEventListener("click", () => {
        window.print();
    });

    renderOrder();
});