import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/artistes`;

const ArtisteService = {
  getAllArtistes: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createArtiste: async (artisteData) => {
    const response = await axios.post(API_URL, artisteData);
    return response.data;
  },

  updateArtiste: async (id, artisteData) => {
    const response = await axios.put(`${API_URL}/${id}`, artisteData);
    return response.data;
  },

  deleteArtiste: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default ArtisteService;
