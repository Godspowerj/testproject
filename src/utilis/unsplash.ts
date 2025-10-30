import axios from "axios";

const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;

// Function to fetch random images
export const getRandomImages = async () => {
  if (!ACCESS_KEY) {
    throw new Error("Unsplash access key is missing in environment variables.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/photos/random`, {
      params: {
        count: 4, 
        client_id: ACCESS_KEY, 
      },
    });


    return response.data;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    throw error;
  }
};

// Function to search images by keyword with pagination support
export const searchImages = async (query: string, page: number = 1, perPage: number = 4) => {
  if (!ACCESS_KEY) {
    throw new Error("Unsplash access key is missing in environment variables.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/search/photos`, {
      params: {
        query,
        page,
        per_page: perPage,
        client_id: ACCESS_KEY,
      },
    });

    // Return the full data object including results and total_pages
    return {
      results: response.data.results,
      total_pages: response.data.total_pages,
    };
  } catch (error) {
    console.error("Error searching images:", error);
    throw error;
  }
};