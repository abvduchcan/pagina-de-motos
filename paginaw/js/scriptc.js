const container = document.querySelector(".container");
const containerCarousel = container.querySelector(".container-carrossel");
const carousel = container.querySelector(".carrossel");
const carouselItems = carousel.querySelectorAll(".carrossel-item");

// Iniciamos variables que cambiarán su estado.
let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createCarousel = () => {
  const carouselProps = onResize();
  const length = carouselItems.length; // Longitud del array
  const degrees = 360 / length; // Grados por cada item
  const gap = 20; // Espacio entre cada item
  const tz = distanceZ(carouselProps.w, length, gap);

  const fov = calculateFov(carouselProps);
  const height = calculateHeight(tz);

  container.style.width = `${tz * 2 + gap * length}px`;
  container.style.height = `${height}px`;

  carouselItems.forEach((item, i) => {
    const degreesByItem = `${degrees * i}deg`;
    item.style.setProperty("--rotatey", degreesByItem);
    item.style.setProperty("--tz", `${tz}px`);
  });
};

// Función que da suavidad a la animación
const lerp = (a, b, n) => {
  return n * (a - b) + b;
};

// Distancia Z de los items
const distanceZ = (widthElement, length, gap) => {
  return widthElement / 2 / Math.tan(Math.PI / length) + gap; 
};

// Calcula el alto del contenedor usando el campo de visión y la distancia de la perspectiva
const calculateHeight = (z) => {
  const t = Math.atan((90 * Math.PI) / 180 / 2);
  return t * 2 * z;
};

// Calcula el campo de visión del carrusel
const calculateFov = (carouselProps) => {
  const perspective = window.getComputedStyle(containerCarousel).perspective.split("px")[0];
  const length = Math.sqrt(carouselProps.w ** 2 + carouselProps.h ** 2);
  return 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
};

// Obtiene la posición X y evalúa si la posición es derecha o izquierda
const getPosX = (x) => {
  currentMousePos = x;
  moveTo += currentMousePos < lastMousePos ? -2 : 2;
  lastMousePos = currentMousePos;
};

const update = () => {
  lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
  carousel.style.setProperty("--rotatey", `${lastMoveTo}deg`);
  requestAnimationFrame(update);
};

const onResize = () => {
  const boundingCarousel = containerCarousel.getBoundingClientRect();
  return { w: boundingCarousel.width, h: boundingCarousel.height };
};

const initEvents = () => {
  // Eventos del mouse
  carousel.addEventListener("mousedown", () => {
    isMouseDown = true;
    carousel.style.cursor = "grabbing";
  });
  carousel.addEventListener("mouseup", () => {
    isMouseDown = false;
    carousel.style.cursor = "grab";
  });
  container.addEventListener("mouseleave", () => (isMouseDown = false));

  carousel.addEventListener("mousemove", (e) => isMouseDown && getPosX(e.clientX));

  // Eventos del touch
  carousel.addEventListener("touchstart", () => {
    isMouseDown = true;
    carousel.style.cursor = "grabbing";
  });
  carousel.addEventListener("touchend", () => {
    isMouseDown = false;
    carousel.style.cursor = "grab";
  });
  container.addEventListener("touchmove", (e) => isMouseDown && getPosX(e.touches[0].clientX));

  window.addEventListener("resize", createCarousel);

  update();
  createCarousel();
};

initEvents();

const track = document.querySelector('.news-track');
const items = document.querySelectorAll('.news-item');
const totalItems = items.length;
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let interval;

const moveToIndex = (index) => {
  // Asegurarse de que el índice esté dentro de los límites
  if (index >= 0 && index < totalItems) {
    currentIndex = index;
    const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(items[0]).marginRight) * 2;
    const translateX = -currentIndex * itemWidth;
    track.style.transform = `translateX(${translateX}px)`;
    updateDots(); // Actualizar puntos de navegación
  }
};

const showNextItem = () => {
  if (currentIndex < totalItems - 3) {
    currentIndex += 1; // Avanzar al siguiente índice
  } else {
    currentIndex = 0; // Regresar al inicio si ya estamos al final
  }
  moveToIndex(currentIndex); // Mover el carrusel al nuevo índice
};

const showPrevItem = () => {
  if (currentIndex > 0) {
    currentIndex -= 1; // Retroceder al índice anterior
  } else {
    currentIndex = totalItems - 3; // Ir al final si estamos en el primer elemento
  }
  moveToIndex(currentIndex); // Mover el carrusel al nuevo índice
};

// Actualizar los puntos de navegación
const updateDots = () => {
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
};

// Iniciar el carrusel
const startNewsCarousel = () => {
  stopNewsCarousel(); // Detener cualquier intervalo anterior para evitar duplicados
  interval = setInterval(() => {
    showNextItem();
  }, 5000); // Cambia cada 5 segundos
};

// Detener el carrusel
const stopNewsCarousel = () => {
  if (interval) {
    clearInterval(interval); // Detener el movimiento automático
    interval = null;
  }
};

// Configurar eventos en los puntos de navegación
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    moveToIndex(index);
    stopNewsCarousel(); // Detener el carrusel si se hace clic en un punto
    startNewsCarousel(); // Reiniciar el carrusel después del clic
  });
});

// Configurar eventos en los botones de navegación
document.querySelector('.next').addEventListener('click', () => {
  showNextItem(); // Mostrar el siguiente elemento
  stopNewsCarousel(); // Detener el carrusel
  startNewsCarousel(); // Reiniciar el carrusel
});

document.querySelector('.prev').addEventListener('click', () => {
  showPrevItem(); // Mostrar el elemento anterior
  stopNewsCarousel(); // Detener el carrusel
  startNewsCarousel(); // Reiniciar el carrusel
});

// Iniciar el carrusel automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  moveToIndex(currentIndex); // Mostrar la primera noticia
  startNewsCarousel(); // Iniciar el carrusel
  updateDots(); // Actualizar puntos de navegación
});
