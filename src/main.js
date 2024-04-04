// import iziToast from 'izitoast';
// import 'izitoast/dist/css/iziToast.min.css';

// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// import { setGallery, renderImgs } from './js/render-functions';
// import { getImage } from './js/pixabay-api';

// const inputField = document.querySelector('input');
// const fillForm = document.querySelector('form');
// const addImgs = document.querySelector('#addImg');
// const loader = document.querySelector('.loader');

// hideLoader();

// let searchQuery = '';
// let pageCounter = 1;
// let perPage = 15;

// fillForm.addEventListener('submit', submitHandle);
// async function submitHandle(event) {
//     event.preventDefault();

//     searchQuery = inputField.value.trim();
//     pageCounter = 1;

//     setGallery.innerHTML = '';

//     if (searchQuery === '') {
//         iziToast.error({
//             title: 'Error',
//             message: 'Please enter a search query.',
//             position: 'topCenter',
//         });
//         hideLoadMoreBtn();

//         return;
//     }

//     //===================

//     showLoader();
//     try {
//         const images = await getImage(searchQuery, pageCounter, perPage);
//         const totalHits = images.totalHits;

//         if (images.hits.length === 0) {
//             setGallery.innerHTML = '';
//             iziToast.info({
//                 title: 'Info',
//                 message:
//                     'Sorry, there are no images matching your search query. Please try again!',
//                 position: 'topCenter',
//             });
//             hideLoadMoreBtn();
            
//             return;
//         } else {
//             renderImgs(images.hits);
//             inputField.value = '';
//              showLoadMoreBtn();
//         }
//         if ((perPage * pageCounter >= totalHits)) {
//             hideLoadMoreBtn();
//             //===================
//         }
//     } catch (error) {
//         console.error('Error fetching more images:', error);
//         iziToast.error({
//             title: 'Error',
//             message: `Failed to fetch images. Please try again later.`,
//              position: 'topCenter',
//         });
//     } finally {
//         hideLoader();
//     }
// };

// addImgs.addEventListener('click', async () => {
//     try {
//         if (addImgs) {
//             pageCounter += 1;
//         }
//         const images = await getImage(searchQuery, pageCounter, perPage);
//         const totalHits = images.totalHits;

//         renderImgs(images.hits);
//         showLoader();
//         if (perPage * pageCounter >= totalHits) {
//             hideLoadMoreBtn();
//             //============
//         }
//         const galleryCardHeight =
//             galleryElement.firstElementChild.getBoundingClientRect().height;
//         window.scrollBy({ top: galleryCardHeight * 3, behavior: 'smooth' });
//     } catch (error) {
//         console.error('Error fetching more images:', error);
//         iziToast.error({
//             title: 'Error',
//             message: `Error fetching more images: ${error}`,
//         });
//     } finally {
//         hideLoader();
//     }
// });


// // * loader
// function showLoader() {
//   loader.classList.remove('hidden');
// }

// function hideLoader() {
//   loader.classList.add('hidden');
// }
// //loader *


// // * button load more images
// function showLoadMoreBtn() {
//   loadMoreBtn.style.display = 'block';
// }

// function hideLoadMoreBtn() {
//   loadMoreBtn.style.display = 'none';
// }
// // button load more images *


import { getImage } from './js/pixabay-api';

import 'simplelightbox/dist/simple-lightbox.min.css';
import {
  renderGallery,
  galleryElement,
  showEndOfCollectionMessage,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const scrollToTopBtn = document.querySelector('.scroll-to-top');

const searchForm = document.querySelector('.form');
const inputElement = document.querySelector('.search-input');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

hideLoader();

let searchTerm = '';
let pageCounter = 1;
const perPage = 15;

searchForm.addEventListener('submit', submitHandle);
async function submitHandle(event) {
  event.preventDefault();
  searchTerm = inputElement.value.trim();
  pageCounter = 1;

  galleryElement.innerHTML = '';

  if (searchTerm === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
      position: 'topCenter',
    });
    hideLoadMoreBtn();

    return;
  }

  hideEndOfCollectionMessage();

  showLoader();
  try {
    const images = await getImage(searchTerm, pageCounter, perPage);
    const totalHits = images.totalHits;

    if (images.hits.length === 0) {
      galleryElement.innerHTML = '';
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topCenter',
      });
      hideLoadMoreBtn();
      return;
    } else {
      renderGallery(images.hits);
      inputElement.value = '';
      showLoadMoreBtn();
    }
    if (perPage * pageCounter >= totalHits) {
      hideLoadMoreBtn();
      showEndOfCollectionMessage();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topCenter',
    });
  } finally {
    hideLoader();
  }
}

loadMoreBtn.addEventListener('click', async () => {
  try {
    if (loadMoreBtn) {
      pageCounter += 1;
    }
    const images = await getImage(searchTerm, pageCounter, perPage);
    const totalHits = images.totalHits;

    renderGallery(images.hits);
    showLoader();
    if (perPage * pageCounter >= totalHits) {
      hideLoadMoreBtn();
      showEndOfCollectionMessage();
    }

    const galleryCardHeight =
      galleryElement.firstElementChild.getBoundingClientRect().height;
    window.scrollBy({ top: galleryCardHeight * 3, behavior: 'smooth' });
  } catch (error) {
    console.error('Error fetching more images:', error);
    iziToast.error({
      title: 'Error',
      message: `Error fetching more images: ${error}`,
    });
  } finally {
    hideLoader();
  }
});

// *loader
function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

// * button load more images
function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

function hideEndOfCollectionMessage() {
  const endMessage = document.querySelector('.end-message');
  if (endMessage) {
    endMessage.remove();
  }
}

// * scroll
window.addEventListener('scroll', () => {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    scrollToTopBtn.style.display = 'flex';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

scrollToTopBtn.addEventListener('click', scrollToTop);