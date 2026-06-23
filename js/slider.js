const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0;
let autoPlayInterval;

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

// Función para avanzar
function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

// Función para retroceder
function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

// Lógica de botones
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay(); // Reinicia el tiempo al hacer clic manual
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

// Lógica de indicadores (hacer clic en los puntitos)
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
        resetAutoPlay();
    });
});

// Auto-play (cambia cada 5 segundos)
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Iniciar al cargar
startAutoPlay();