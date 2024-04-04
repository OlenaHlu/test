
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImage } from './js/pixabay-api';
import {
  renderImgs,
  setGallery,
  showEndOfCollectionMessage,
} from './js/render-functions';


const scrollToTopBtn = document.querySelector('.scroll-to-top');

const fillForm = document.querySelector('.form');
const inputField = document.querySelector('.search-input');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

hideLoader();

let searchTerm = '';
let pageCounter = 1;
const perPage = 15;

fillForm.addEventListener('submit', submitHandle);
async function submitHandle(event) {
  event.preventDefault();
  searchTerm = inputField.value.trim();
  pageCounter = 1;

  setGallery.innerHTML = '';

  if (searchTerm === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
      position: 'center',
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
      setGallery.innerHTML = '';
      iziToast.info({
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'center',
      });
      hideLoadMoreBtn();
      return;
    } else {
      renderImgs(images.hits);
      inputField.value = '';
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
      position: 'center',
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

    renderImgs(images.hits);
    showLoader();
    if (perPage * pageCounter >= totalHits) {
      hideLoadMoreBtn();
      showEndOfCollectionMessage();
    }

    const galleryCardHeight =
      setGallery.firstElementChild.getBoundingClientRect().height;
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


function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}



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