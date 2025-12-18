/**
 * Centralized API configuration for TMDB
 */

export const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * Generic fetch function for TMDB API
 * @param {string} endpoint - API endpoint (without base URL)
 * @returns {Promise<any>} - JSON response data
 */
export const fetchFromTMDB = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, API_OPTIONS);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return response.json();
};
