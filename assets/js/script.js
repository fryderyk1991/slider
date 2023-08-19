const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  });
  runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
  const imagesSelector = ".gallery__item";
  const sliderRootSelector = ".js-slider";
  const imagesList = document.querySelectorAll(imagesSelector);
  const sliderRootElement = document.querySelector(sliderRootSelector);
  initEvents(imagesList, sliderRootElement);
  initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener("click", function (e) {
      fireCustomEvent(e.currentTarget, "js-slider-img-click");
    });
  });


  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-next");
  });
  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (e) {
    fireCustomEvent(e.currentTarget, "js-slider-img-prev");
  });
  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", function (e) {
    if (e.target === zoom) {
      fireCustomEvent(e.currentTarget, "js-slider-close");
    }
  });
};

const fireCustomEvent = function (element, name) {
  console.log(element.className, "=>", name);
  const event = new CustomEvent(name, {
    bubbles: true,
  });

  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector,
) {
  imagesList.forEach(function (img) {
    img.addEventListener("js-slider-img-click", function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });
  sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
  sliderRootElement.addEventListener("js-auto-slide-start", autoSlideStart);
  sliderRootElement.addEventListener("js-auto-slide-stop", autoSlideStop)
};

let interval;

const autoSlideStart = function () {
  console.log(this, "js-auto-slide-start");  
  const currentImage = document.querySelector(".js-slider__thumbs-image--current");
  const figureProto = document.querySelector(".js-slider__thumbs-item--prototype");
  const nextFigure = currentImage.parentElement.nextElementSibling;
  const secondFigure = figureProto.nextElementSibling;
  const nextSlide = changeSlide(currentImage, nextFigure, secondFigure);
}
const autoSlideStop = function () {
  console.log(this, "js-auto-slide-stop"); 
  clearInterval(interval)
}

const onImageClick = function (event, sliderRootElement, imagesSelector) { 
  interval = setInterval(autoSlideStart, 2000) 
  sliderRootElement.classList.add("js-slider--active"); 
  function getCurrentImageAtr() {
    const currentImage = event.target.querySelector("img");
    const currentImageSrc = currentImage.getAttribute("src");
    const sliderImage = sliderRootElement.querySelector(".js-slider__image");
    sliderImage.setAttribute("src", currentImageSrc);
    return currentImageSrc;
  }
  function getCurrentImages() {
    const eventGroupName = event.target.dataset.sliderGroupName;
    const getImages = [...document.querySelectorAll(imagesSelector)];
    const selectedGroupOfImages = getImages.filter(function (image) {
    return image.dataset.sliderGroupName === eventGroupName;
    });
    return selectedGroupOfImages;
  }
  
    const sliderThumbsItemProto = document.querySelector(
      ".js-slider__thumbs-item.js-slider__thumbs-item--prototype"
    );
    const sliderFooter = document.querySelector(".js-slider__thumbs");
    const thumbsImages = getCurrentImages();
    thumbsImages.forEach(function (el) {
      const images = el.querySelector("img");
      const newSliderThumbsProto = sliderThumbsItemProto.cloneNode(true);
      const atr = images.getAttribute("src");
      const newImages = newSliderThumbsProto.firstChild.nextElementSibling;
      newImages.setAttribute("src", atr);
      newSliderThumbsProto.classList.remove("js-slider__thumbs-item--prototype");
      sliderFooter.appendChild(newSliderThumbsProto);
      const currentImageSrc = getCurrentImageAtr();
      if (atr === currentImageSrc) {
        newImages.classList.add("js-slider__thumbs-image--current");
        
      }
    });
};



function changeSlide(currentImage, figure, siblingEl) {
  currentImage.classList.remove('js-slider__thumbs-image--current');
  if (figure && !figure.classList.contains("js-slider__thumbs-item--prototype")) {
    const image = figure.querySelector("img");
    currentImage.classList.remove("js-slider__thumbs-image--current");
    image.classList.add("js-slider__thumbs-image--current");
    const getAtr = image.getAttribute("src");
    const sliderImage = document.querySelector(".js-slider__image");
    sliderImage.setAttribute("src", getAtr);
  }
  else {
    currentImage.classList.remove("js-slider__thumbs-image--current");
    const carouselImage = siblingEl.querySelector('img');
    carouselImage.classList.add("js-slider__thumbs-image--current");
    const getAtr = carouselImage.getAttribute('src');
    const sliderImage = document.querySelector('.js-slider__image');
    sliderImage.setAttribute('src', getAtr)
  }
 
}

const onImageNext = function (event) {
  console.log(this, "onImageNext");
  const currentImage = document.querySelector(".js-slider__thumbs-image--current");
  const figureProto = document.querySelector(".js-slider__thumbs-item--prototype");
  const nextFigure = currentImage.parentElement.nextElementSibling;
  const secondFigure = figureProto.nextElementSibling;
  const nextSlide = changeSlide(currentImage, nextFigure, secondFigure);
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");
  const currentImage = document.querySelector(".js-slider__thumbs-image--current");
  const figureProto = document.querySelector(".js-slider__thumbs-item--prototype");
  const prevFigure = currentImage.parentElement.previousElementSibling;
  const lastFigure = figureProto.parentElement.lastElementChild;

  const prevSlide = changeSlide(currentImage, prevFigure, lastFigure);
};

const onClose = function (event) {
  const sectionSlider = document.querySelector(".js-slider");
  const sliderFooter = document.querySelector(".js-slider__thumbs");
  if (sectionSlider) {
    sectionSlider.classList.remove("js-slider--active");
    sliderFooter.innerHTML = "";
    sliderFooter.innerHTML += `  <figure class="js-slider__thumbs-item js-slider__thumbs-item--prototype">
    <img class="js-slider__thumbs-image">
    </figure>`;
  }
 autoSlideStop()
};

