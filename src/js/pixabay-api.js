
import axios from 'axios';

const API_KEY = '43066959-f9f55707df0fe34b818b99119';
const baseURL = 'https://pixabay.com/api/';

export async function getImage(searchQuery, page, perPage) {
  try {
    const response = await axios.get(baseURL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}