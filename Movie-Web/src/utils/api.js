/**
 * Deep Movie Data Service
 * Encapsulates all TMDB communication, credentials, error handling,
 * and data transformation behind a minimal, high-leverage interface.
 */

export const API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "";

const isBearerToken = API_KEY.startsWith("eyJ");

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    ...(isBearerToken ? { Authorization: `Bearer ${API_KEY}` } : {}),
  },
};

/**
 * Low-level HTTP execution with status checks and auth fallbacks
 * @param {string} endpoint - Path such as `/movie/123`
 * @param {Record<string, string|number>} [params] - Query parameters
 * @returns {Promise<any>}
 */
async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // If using a v3 32-char API key instead of a v4 Read Access Token
  if (!isBearerToken && API_KEY) {
    url.searchParams.set("api_key", API_KEY);
  }

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), API_OPTIONS);
  if (!response.ok) {
    throw new Error(`TMDB Request failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * Deep Module: movieService
 * Callers interact solely with domain actions.
 */
export const movieService = {
  /**
   * Fetch trending movies for the week or day
   * @param {'day' | 'week'} [timeWindow='week']
   * @param {number} [limit=5]
   * @returns {Promise<Array>}
   */
  async getTrending(timeWindow = "week", limit = 5) {
    const data = await fetchTMDB(`/trending/movie/${timeWindow}`);
    const results = data.results || [];
    return typeof limit === "number" ? results.slice(0, limit) : results;
  },

  /**
   * Discover movies sorted by popularity or custom criteria
   * @param {string} [sortBy='popularity.desc']
   * @param {number} [page=1]
   * @returns {Promise<Array>}
   */
  async getDiscover(sortBy = "popularity.desc", page = 1) {
    const data = await fetchTMDB("/discover/movie", {
      sort_by: sortBy,
      page,
    });
    return data.results || [];
  },

  /**
   * Search for movies by title
   * @param {string} query
   * @param {number} [page=1]
   * @returns {Promise<Array>}
   */
  async search(query, page = 1) {
    const cleanQuery = query?.trim();
    if (!cleanQuery) return [];
    const data = await fetchTMDB("/search/movie", {
      query: cleanQuery,
      page,
    });
    return data.results || [];
  },

  /**
   * Get full details for a movie including cast and videos
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  async getDetails(id) {
    if (!id) throw new Error("Movie ID is required");
    return fetchTMDB(`/movie/${id}`, {
      append_to_response: "credits,videos",
    });
  },

  /**
   * Construct safe, full image URLs with fallbacks
   * @param {string|null} path
   * @param {'w92'|'w185'|'w500'|'original'} [size='w500']
   * @param {string} [fallback='/no-movie.png']
   * @returns {string}
   */
  getImageUrl(path, size = "w500", fallback = "/no-movie.png") {
    if (!path) return fallback;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};

/**
 * Backwards compatibility helper
 */
export const fetchFromTMDB = (endpoint) => fetchTMDB(endpoint);
