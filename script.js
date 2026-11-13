const filterButtons = document.querySelectorAll(".filter-button");
const photos = Array.from(document.querySelectorAll(".photo"));
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const emptyReset = document.getElementById("empty-reset");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCategory = document.getElementById("lightbox-category");
const lightboxCount = document.getElementById("lightbox-count");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");

let activeCategory = "all";
let visiblePhotos = [...photos];
let currentPhotoIndex = 0;
let lastFocusedPhoto = null;

function setActiveFilter(selectedButton) {
    filterButtons.forEach(function (button) {
        const isActive = button === selectedButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function matchesSearch(photo, query) {
    if (query === "") {
        return true;
    }

    const searchableText = [
        photo.dataset.keywords || "",
        photo.querySelector(".photo-title").textContent,
        photo.querySelector(".photo-tag").textContent,
        photo.querySelector("img").alt
    ].join(" ").toLowerCase();

    return searchableText.includes(query);
}

function updateGallery(shouldAnimate) {
    const query = searchInput.value.trim().toLowerCase();
    visiblePhotos = [];

    photos.forEach(function (photo) {
        const matchesCategory = activeCategory === "all" || photo.dataset.category === activeCategory;
        const shouldShow = matchesCategory && matchesSearch(photo, query);

        photo.classList.toggle("is-hidden", !shouldShow);

        if (shouldShow) {
            visiblePhotos.push(photo);
        }
    });

    updateResultCount();
    emptyState.hidden = visiblePhotos.length > 0;

    if (shouldAnimate && visiblePhotos.length > 0) {
        animateVisibleCards();
    }
}

function updateResultCount() {
    if (visiblePhotos.length === photos.length) {
        resultCount.textContent = photos.length + " moments in the collection";
        return;
    }

    resultCount.textContent = "Showing " + visiblePhotos.length + " of " + photos.length + " moments";
}

function animateVisibleCards() {
    visiblePhotos.forEach(function (photo, index) {
        photo.animate(
            [
                { opacity: 0, transform: "translateY(16px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            {
                duration: 420,
                delay: index * 35,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
                fill: "backwards"
            }
        );
    });
}

function resetFilters() {
    activeCategory = "all";
    searchInput.value = "";
    searchClear.hidden = true;
    setActiveFilter(filterButtons[0]);
    updateGallery();
    searchInput.focus();
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        activeCategory = button.dataset.filter;
        setActiveFilter(button);
        updateGallery(true);
    });
});

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
});

searchInput.addEventListener("input", function () {
    searchClear.hidden = searchInput.value.length === 0;
    updateGallery();
});

searchClear.addEventListener("click", function () {
    searchInput.value = "";
    searchClear.hidden = true;
    updateGallery();
    searchInput.focus();
});

emptyReset.addEventListener("click", resetFilters);

function showPhoto(photo) {
    const image = photo.querySelector("img");
    const title = photo.querySelector(".photo-title").textContent;
    const category = photo.querySelector(".photo-tag").textContent;

    lightboxImage.src = photo.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;
    lightboxCount.textContent =
        String(currentPhotoIndex + 1).padStart(2, "0") + " / " + String(visiblePhotos.length).padStart(2, "0");

    restartImageAnimation();
}

function restartImageAnimation() {
    lightboxImage.classList.remove("is-in");
    void lightboxImage.offsetWidth;
    lightboxImage.classList.add("is-in");
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

    if (lastFocusedPhoto) {
        lastFocusedPhoto.focus();
    }
}

function changePhoto(direction) {
    if (visiblePhotos.length === 0) {
        return;
    }

    currentPhotoIndex = (currentPhotoIndex + direction + visiblePhotos.length) % visiblePhotos.length;
    showPhoto(visiblePhotos[currentPhotoIndex]);
}

photos.forEach(function (photo) {
    photo.addEventListener("click", function () {
        currentPhotoIndex = visiblePhotos.indexOf(photo);

        if (currentPhotoIndex === -1) {
            return;
        }

        lastFocusedPhoto = photo;
        showPhoto(visiblePhotos[currentPhotoIndex]);
        openLightbox();
    });
});

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

updateGallery();

document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        changePhoto(-1);
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        changePhoto(1);
    }
});
