const filterButtons = document.querySelectorAll(".filter-button");
const photos = document.querySelectorAll(".photo");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCategory = document.getElementById("lightbox-category");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");

let visiblePhotos = Array.from(photos);
let currentPhotoIndex = 0;

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedCategory = button.dataset.filter;

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        visiblePhotos = [];

        photos.forEach(function (photo) {
            const shouldShow = selectedCategory === "all" || photo.dataset.category === selectedCategory;

            photo.classList.toggle("hide", !shouldShow);

            if (shouldShow) {
                visiblePhotos.push(photo);
            }
        });
    });
});

photos.forEach(function (photo) {
    photo.addEventListener("click", function () {
        currentPhotoIndex = visiblePhotos.indexOf(photo);
        showPhoto(photo);
        openLightbox();
    });
});

function showPhoto(photo) {
    const image = photo.querySelector("img");
    const title = photo.querySelector(".photo-title").textContent;
    const category = photo.querySelector(".photo-tag").textContent;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
}

function openLightbox() {
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeButton.focus();
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

function changePhoto(direction) {
    if (visiblePhotos.length === 0) {
        return;
    }

    currentPhotoIndex = (currentPhotoIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    showPhoto(visiblePhotos[currentPhotoIndex]);
}

closeButton.addEventListener("click", closeLightbox);

previousButton.addEventListener("click", function () {
    changePhoto(-1);
});

nextButton.addEventListener("click", function () {
    changePhoto(1);
});

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        changePhoto(-1);
    }

    if (event.key === "ArrowRight") {
        changePhoto(1);
    }
});
