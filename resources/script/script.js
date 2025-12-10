// ====== Carousel Elements ======
const track = document.getElementById("carousel_track");
const slides = document.querySelectorAll(".section_gallery_slide");
const dotsContainer = document.getElementById("carousel_dots");
const carouselContainer = document.getElementById("section_gallery_carousel_container");
const closeBtn = document.getElementById("section_gallery_carousel_close_btn");
const nextBtn = document.getElementById("carousel_arrow_next");
const prevBtn = document.getElementById("carousel_arrow_previous");
const thumbnails = document.querySelectorAll(".section_gallery_still");

let currentIndex = 0;

// ====== Create dots dynamically ======
slides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.classList.add("carousel_dot");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
        openCarouselAt(i);
    });

    dotsContainer.appendChild(dot);
});

// ====== Update carousel function ======
function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap);
    const offset = currentIndex * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update active dot
    document.querySelectorAll(".carousel_dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });

    // Stop all videos first
    slides.forEach((slide, i) => {
        const iframe = slide.querySelector("iframe");
        const src = iframe.getAttribute("src").split("?")[0]; 
        iframe.setAttribute("src", src);
    });

    // Autoplay the current slide
    const currentIframe = slides[currentIndex].querySelector("iframe");
    const currentSrc = currentIframe.getAttribute("src").split("?")[0];
    currentIframe.setAttribute("src", `${currentSrc}?autoplay=1`);
}

// ====== Open carousel at specific slide ======
function openCarouselAt(index) {
    currentIndex = index;
    carouselContainer.style.display = "block";
    carouselContainer.classList.remove("hidden"); // remove fade-out class if present
    document.body.classList.add("body-no-scroll"); // lock page scroll

    updateCarousel();

    // Autoplay the selected video and pause others
    slides.forEach((slide, i) => {
        const iframe = slide.querySelector("iframe");
        let src = iframe.getAttribute("src").split("?")[0]; // base URL without params

        if (i === index) {
            // Add autoplay parameter for the selected video
            iframe.setAttribute("src", `${src}?autoplay=1`);
        } else {
            // Reset other videos to stop playback
            iframe.setAttribute("src", src);
        }
    });
}

// ====== Close carousel ======
closeBtn.addEventListener("click", () => {
    carouselContainer.classList.add("hidden");

    // Stop all videos
    slides.forEach(slide => {
        const iframe = slide.querySelector("iframe");
        const src = iframe.getAttribute("src").split("?")[0]; 
        iframe.setAttribute("src", src); // reset src stops the video
    });

    carouselContainer.addEventListener("transitionend", () => {
        carouselContainer.style.display = "none";
        document.body.classList.remove("body-no-scroll");
    }, { once: true });
});

// ====== Next / Prev buttons (looping) ======
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
});

// ====== Thumbnails click to open carousel ======
thumbnails.forEach(still => {
    still.addEventListener("click", () => {
        const index = parseInt(still.getAttribute("data-index"));
        openCarouselAt(index);
    });
});


// ====== Form submit ======
const scriptURL = "https://script.google.com/macros/s/AKfycbwZyJU5614nmQUWkzZMMLuNglFZGzaaS89brAcaPnDg1JLRAVTGDuq1BPloBWZWbIYF3g/exec";
const submitBtn = document.getElementById("form_submit_btn");
const form = document.getElementById("section_contact_form");

form.addEventListener("submit", e => {
  e.preventDefault();

  submitBtn.classList.add("form_btn_loading");
  submitBtn.textContent = "Enviando...";

  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    message: form.message.value
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    mode: "no-cors"
  })
  .then(() => {
    form.style.display = "none";
    document.getElementById("section_contact_thanku").style.display = "block";
  })
  .catch(err => {
    alert("Error: " + err);
    submitBtn.disabled = false;
    submitBtn.classList.remove("form_btn_loading");
  });
});



// ====== Services colpase ======

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.getElementsByClassName("section_services_card_content"));

    cards.forEach(el => {
        const baseHeight = el.querySelector("h3").offsetHeight;
        el.style.height = `${baseHeight}px`;

        el.addEventListener("mouseenter", () => {
            el.style.height = `${el.scrollHeight}px`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.height = `${baseHeight}px`;
        });
    });
});
