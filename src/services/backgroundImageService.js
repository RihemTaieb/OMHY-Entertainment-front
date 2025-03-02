import axios from "axios";

import axiosInstance from '../api/axiosInstance'; // Importez votre instance Axios

const BackgroundImageService = {
  // Récupérer tous les sliders
  getAllSliders: async () => {
    const response = await axiosInstance.get('/sliders');
    return response.data;
  },

  // Créer un nouveau slider
  createSlider: async (formData) => {
    const response = await axiosInstance.post('/sliders', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Mettre à jour un slider (ajouter des images)
  updateSlider: async (id, formData) => {
    const response = await axiosInstance.put(`/sliders/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Supprimer un slider
  deleteSlider: async (id) => {
    const response = await axiosInstance.delete(`/sliders/${id}`);
    return response.data;
  },

  // Supprimer une image spécifique d'un slider
  deleteImageFromSlider: async (id, imageUrl) => {
    const response = await axiosInstance.delete(`/sliders/${id}/image`, {
      data: { imageUrl },
    });
    return response.data;
  },
};

export default BackgroundImageService;

