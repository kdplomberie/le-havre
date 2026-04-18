// --- GESTION DE LA MODAL ---
const modal = document.getElementById("quoteModal");
const openBtn = document.getElementById("openQuote");
const closeBtn = document.querySelector(".close");

if(openBtn) {
    openBtn.onclick = () => modal.style.display = "block";
}

if(closeBtn) {
    closeBtn.onclick = () => modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

// --- CALCULATEUR DE PRIX ---
const serviceSelect = document.getElementById("serviceType");
const dayBtn = document.getElementById("dayBtn");
const nightBtn = document.getElementById("nightBtn");
const priceDisplay = document.getElementById("totalPrice");

let multiplier = 1;

if(dayBtn && nightBtn) {
    dayBtn.onclick = () => {
        multiplier = 1;
        dayBtn.classList.add("active");
        nightBtn.classList.remove("active");
        updatePrice();
    };

    nightBtn.onclick = () => {
        multiplier = 1.5; // +50% pour la nuit/we
        nightBtn.classList.add("active");
        dayBtn.classList.remove("active");
        updatePrice();
    };
}

if(serviceSelect) {
    serviceSelect.onchange = updatePrice;
}

function updatePrice() {
    const base = parseInt(serviceSelect.value);
    const final = Math.round(base * multiplier);
    
    // Petite animation de défilement du chiffre
    animateValue(priceDisplay, parseInt(priceDisplay.innerText), final, 400);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + "€";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- ANIMATION D'APPARITION AU SCROLL (Intersection Observer) ---
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// --- GESTION DE L'ENVOI RÉEL DU MAIL (via Formspree) ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        
        const status = document.querySelector(".btn-primary");
        const originalText = status.innerText;
        status.innerText = "Envoi en cours...";
        status.disabled = true;

        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                alert("Merci ! KD Plomberie a bien reçu votre demande. Je vous rappelle très rapidement.");
                contactForm.reset();
            } else {
                alert("Oups ! Il y a eu un problème. Merci de m'appeler directement au 07 43 57 65 78.");
            }
        } catch (error) {
            alert("Erreur de connexion. Merci de m'appeler directement.");
        } finally {
            status.innerText = originalText;
            status.disabled = false;
        }
    });
}
// --- LOGIQUE DU SLIDER D'AVIS ---
const slides = document.querySelectorAll('.review-card');
let currentSlide = 0;

function nextReview() {
    // 1. On prépare la sortie de l'avis actuel
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('exit');

    // On retire la classe 'exit' après l'animation pour le remettre à droite (invisible)
    const previous = currentSlide;
    setTimeout(() => {
        slides[previous].classList.remove('exit');
    }, 800);

    // 2. On passe à l'index suivant
    currentSlide = (currentSlide + 1) % slides.length;

    // 3. On affiche le nouvel avis
    slides[currentSlide].classList.add('active');
}

// On lance la rotation toutes les 2000ms (2 secondes)
setInterval(nextReview, 3000);
// --- LOGIQUE DE LA GALERIE (LIGHTBOX) ---
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightboxClose = document.querySelector(".lightbox-close");

galleryItems.forEach(item => {
    item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const caption = item.querySelector(".gallery-overlay span");
        
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = caption.innerHTML;
    });
});

lightboxClose.onclick = () => {
    lightbox.style.display = "none";
};

// Fermer aussi en cliquant n'importe où sur le fond noir
lightbox.onclick = (e) => {
    if (e.target !== lightboxImg && e.target !== lightboxCaption) {
        lightbox.style.display = "none";
    }
};
