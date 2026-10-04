const groups = [".section", ".work-card", ".skill", ".contact-card"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add("show");
                // clear the stagger delay afterwards so hover isn't delayed
                clearTimeout(el._t);
                el._t = setTimeout(() => { el.style.transitionDelay = "0s"; }, 700);
            } else {
                el.classList.remove("show");
                el.style.transitionDelay = el._delay || "0s";
            }
        });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });

    groups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el._delay = selector === ".section" ? "0s" : `${(i % 3) * 0.06}s`;
            el.style.transitionDelay = el._delay;
            el.classList.add("reveal");
            observer.observe(el);
        });
    });
}


/* ===== Floating pill navbar ===== */
const navbar = document.getElementById("navbar");
const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 60);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== Day / night mode ===== */
const root = document.documentElement;
document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
});


/* ===== Scroll progress line ===== */
const progress = document.getElementById("progress");
const setProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty("--p", max > 0 ? window.scrollY / max : 0);
};
window.addEventListener("scroll", setProgress, { passive: true });
setProgress();

/* ===== Card spotlight + 3D tilt, magnetic buttons (mouse devices only) ===== */
if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    document.querySelectorAll(".work-card").forEach((card) => {
        card.addEventListener("pointermove", (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            card.style.setProperty("--mx", x + "px");
            card.style.setProperty("--my", y + "px");
            card.style.setProperty("--rx", ((y / r.height - 0.5) * -8).toFixed(2) + "deg");
            card.style.setProperty("--ry", ((x / r.width - 0.5) * 8).toFixed(2) + "deg");
        });
        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
        });
    });

    document.querySelectorAll(".hero-button, .about-button").forEach((btn) => {
        btn.classList.add("magnetic");
        btn.addEventListener("pointermove", (e) => {
            const r = btn.getBoundingClientRect();
            btn.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
            btn.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
        });
        btn.addEventListener("pointerleave", () => {
            btn.style.setProperty("--tx", "0px");
            btn.style.setProperty("--ty", "0px");
        });
    });
}


/* ===== Work tabs (Thumbnails / Video Edits / UGC Ads) ===== */
const tabs = document.querySelectorAll(".work-tab");
const panels = document.querySelectorAll(".work-panel");
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => {
            const on = t === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", on);
        });
        panels.forEach((p) => {
            const on = p.id === "panel-" + tab.dataset.tab;
            p.hidden = !on;
            p.classList.toggle("active", on);
        });
    });
});
