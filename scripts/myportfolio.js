
/* =========================================================
   CODE TITAN — YUSUF HABEEB
   Main portfolio JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -----------------------------------------
    // 1. MOBILE NAVIGATION
    // -----------------------------------------

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navItems = document.querySelectorAll(".nav-link");

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        document.body.classList.remove("menu-open");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-xmark", isOpen);
            }

            document.body.classList.toggle("menu-open", isOpen);
        });

        navItems.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", (event) => {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 850) {
                closeMenu();
            }
        });
    }

    // -----------------------------------------
    // 2. TYPING ANIMATION
    // -----------------------------------------

    const typingElement = document.getElementById("typingText");

    if (typingElement) {
        const phrases = [
            "Software Developer",
            "Backend Developer",
            "Web Developer",
            "Problem Solver"
        ];

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
            typingElement.textContent = phrases[0];
        } else {
            let phraseIndex = 0;
            let characterIndex = phrases[0].length;
            let deleting = true;

            function typeText() {
                const currentPhrase = phrases[phraseIndex];

                if (deleting) {
                    characterIndex--;
                } else {
                    characterIndex++;
                }

                typingElement.textContent = currentPhrase.substring(
                    0,
                    characterIndex
                );

                let delay = deleting ? 45 : 85;

                if (!deleting && characterIndex === currentPhrase.length) {
                    deleting = true;
                    delay = 1500;
                } else if (deleting && characterIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    delay = 350;
                }

                window.setTimeout(typeText, delay);
            }

            window.setTimeout(typeText, 1500);
        }
    }

    // -----------------------------------------
    // 3. SCROLL PROGRESS INDICATOR
    // -----------------------------------------

    const scrollProgress = document.getElementById("scrollProgress");

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight <= 0) {
            scrollProgress.style.width = "0%";
            return;
        }

        const progress =
            (window.scrollY / scrollableHeight) * 100;

        scrollProgress.style.width =
            `${Math.min(100, Math.max(0, progress))}%`;
    }

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    updateScrollProgress();

    // -----------------------------------------
    // 4. REVEAL ANIMATIONS
    // -----------------------------------------

    const revealElements = document.querySelectorAll(".reveal");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // -----------------------------------------
    // 5. ACTIVE NAVIGATION WHILE SCROLLING
    // -----------------------------------------

    const sections = document.querySelectorAll("main section[id]");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const currentId = entry.target.id;

                    navItems.forEach((link) => {
                        const matches =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", matches);
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // -----------------------------------------
    // 6. AUTOMATIC FOOTER YEAR
    // -----------------------------------------

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // -----------------------------------------
    // 7. SAFE EXTERNAL LINKS
    // -----------------------------------------

    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    // -----------------------------------------
    // 8. PREVENT EMPTY PLACEHOLDER LINKS
    // -----------------------------------------

    document.querySelectorAll('a[href="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

});
