import axiosClient from "../axiosClient.js";

const movieService = {
  // Lấy danh sách phim đang chiếu
  getNowShowing() {
    return axiosClient.get("/movies/now-showing", {
      validateStatus: () => true,
    });
  },

  // Lấy danh sách phim sắp chiếu
  getComingSoon() {
    return axiosClient.get("/movies/coming-soon", {
      validateStatus: () => true,
    });
  },

  // Lấy danh sách phim với filter
  getMovies(params = {}) {
    return axiosClient.get("/movies", { params }, {
      validateStatus: () => true,
    });
  },

  // Lấy chi tiết phim
  getMovieById(id) {
    return axiosClient.get(`/movies/${id}`, {
      validateStatus: () => true,
    });
  },
};

export default movieService;

