import axios from "axios";
import axiosInstance from '../api/axiosInstance'; // Importez votre instance Axios

const CastingService = {
  getCastings: () => axiosInstance.get('/casting'),

  createCasting: (formData) =>
    axiosInstance.post('/casting', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateCasting: (id, formData) =>
    axiosInstance.put(`/casting/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteCasting: (id) => axiosInstance.delete(`/casting/${id}`),
};

export default CastingService;
