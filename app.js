const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  // Toggle Spinner
  toggleSpinner();

  // Count the total number of images selected
  sliderImageCounter();
  document.getElementById("totalImages").innerText = images.length;
  document.getElementById("imageCounter").classList.remove('d-none');

  // Display Images
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  // Check if no search matches the available photos provided by the api
  if (images.length === 0) {
    imagesArea.style.display = 'none';
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.innerHTML = "";
    let h1 = document.createElement('h1');
    h1.className = 'text-center';
    h1.innerText = `No Photos Found`;
    errorDiv.appendChild(h1);
  } else {
    imagesArea.style.display = 'block';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }

}

const getImages = (query) => {
  document.getElementById("imageCounter").classList.add('d-none');
  imagesArea.style.display = 'none';
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(error => console.log(error));
}
// Function for handling errors
const errorMessage = () => {
  const imageGalleryDiv = document.getElementById("imageGalleryDiv");
  const message = `
      <h1 class="fw-bolder text-center">Food Name Not Found. Please Try Another Food</h1>
  `
  imageGalleryDiv.innerHTML = message;
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    sliderImageCounter();
  } else {
    if (item > -1) {
      sliders.splice(item, 1);
      sliderImageCounter();
    }
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  document.getElementById("errorMessage").innerHTML = "";
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)

  const duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    alert('Duration cannot be negative ')

  } else {
    // Hide Image area
    imagesArea.style.display = 'none';
    // Display slider
    document.querySelector('.main').style.display = 'block';
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);

  }
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
});
// Added Keypress event listener for Enter Key
document.getElementById("search").addEventListener("keypress", function (event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

// Function for toggling spinner
const toggleSpinner = () => {
  const spinner = document.getElementById("spinner");
  const imageGallery = document.getElementById("imageGalleryDiv");
  spinner.classList.toggle('d-none');
  imageGallery.classList.toggle('d-none');
}
// counter function for images added in the slider
const sliderImageCounter = () => {
  const total = sliders.length;
  document.getElementById("selectedImagesCount").innerText = total;
}