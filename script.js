'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const h1 = document.querySelector("h1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener("click", (e) => {
  // e.preventDefault();
  const s1coords = section1.getBoundingClientRect();

  // Scrolling (oldschool)
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset)

  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: "smooth"
  });

  // (newschool)
  // section1.scrollIntoView({ behavior: "smooth" })
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll(".nav__link").forEach(function(el){
//   el.addEventListener("click", function(e){
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({behavior: "smooth"});
//   })
// })

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" })
  }
});

// Tabbed component
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard clause
  if (!clicked) return;

  // Remove active tab
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));

  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Remove active content area
  tabsContent.forEach(cont => cont.classList.remove("operations__content--active"));

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});

// Menu fade animation | ** Passing arguments to event handlers **
// mouseover -- mouseout | mouseenter -- mouseleave
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// bind vasitesile argument oturme
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky navigation
// const initialCords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function(){
//   if(this.scrollY >= initialCords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   };
// });

// Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }

// const obsOptions = {
//   root: null,
//   threshold: 0.1
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry)
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const headerObsOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0
};

const headerObserver = new IntersectionObserver(stickyNav, headerObsOptions);
headerObserver.observe(header);

// Reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const revealSecOps = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(revealSection, revealSecOps);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});


// Lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  })

  observer.unobserve(entry.target)
};

const imgObserver = new IntersectionObserver(loadImg, { root: null, rootMargin: "200px", threshold: 0 });
imgTargets.forEach(img => imgObserver.observe(img));


// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector(".dots");

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activeDots = function (slide) {
    document.querySelectorAll(".dots__dot").forEach(dot => {
      dot.classList.remove("dots__dot--active");
    });

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
  };

  const goToSlide = function (sld) {
    slides.forEach((slide, i) => slide.style.transform = `translateX(${100 * (i - sld)}%)`);
  };



  // Next slide 
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    };
    goToSlide(curSlide);
    activeDots(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    };
    goToSlide(curSlide);
    activeDots(curSlide);
  };


  const init = function () {
    createDots();
    goToSlide(0);
    activeDots(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDots(slide);
    }
  });
};

slider();