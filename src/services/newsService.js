import axiosInstance from '../api/axiosInstance'; // Importez votre instance Axios


const NewsService = {
  getAllNews: async () => {
    const response = await axiosInstance.get('/news');
    return response.data;
  },

  createNews: async (newsData) => {
    const response = await axiosInstance.post('/news', newsData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateNews: async (id, newsData) => {
    const response = await axiosInstance.put(`/news/${id}`, newsData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await axiosInstance.delete(`/news/${id}`);
    return response.data;
  },
};

export default NewsService;
