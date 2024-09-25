// script.
//carusel
//document.addEventListener('DOMContentLoaded', function () {
    //const prevButton = document.querySelector('.prev');
    //const nextButton = document.querySelector('.next');
    //const itemsContainer = document.querySelector('.carrusel-items');
    //const items = document.querySelectorAll('.carrusel-item');
    //let index = 0;

    //function updateCarrusel() {
      //  const offset = -index * 100;
        //itemsContainer.style.transform = `translateX(${offset}%)`;
    //}

    //prevButton.addEventListener('click', function () {
       // index = (index > 0) ? index - 1 : items.length - 1;
        //updateCarrusel();
    //});

    //nextButton.addEventListener('click', function () {
      //  index = (index < items.length - 1) ? index + 1 : 0;
        //updateCarrusel();
    //});
//});

document.addEventListener('DOMContentLoaded', () => {
    const intervalTime = 3000; // Intervalo en milisegundos
    const carruselInner = document.querySelector('.carrusel-inner');
    const carruselItems = document.querySelectorAll('.carrusel-item');
    const totalItems = carruselItems.length;
    let index = 0;

    function moveToNextSlide() {
        index = (index + 1) % totalItems;
        const offset = -index * 100; // Mueve el carrusel al siguiente ítem
        carruselInner.style.transform = `translateX(${offset}%)`;
    }

    // Cambia automáticamente el slide cada 3 segundos
    setInterval(moveToNextSlide, intervalTime);
});
