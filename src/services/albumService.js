import axios from "axios";
import axiosInstance from '../api/axiosInstance'; // Importez votre instance

const getAlbums = async () => {
  try {
    // Pas besoin de spécifier l'URL complète, seulement l'endpoint relatif
    const response = await axiosInstance.get('/albums');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des albums:', error);
    throw error;
  }
};
const AlbumService = {
  /**
   * Récupérer tous les albums
   * @returns {Promise<Array>} Liste des albums
   */
  getAllAlbums: async () => {
    try {
      const response = await axiosInstance.get('/albums');
      return response.data; // Retourne les données des albums
    } catch (error) {
      console.error('Erreur lors de la récupération des albums :', error.message);
      throw error;
    }
  },

  /**
   * Récupérer un album par ID
   * @param {string} id - ID de l'album
   * @returns {Promise<Object>} Détails de l'album
   */
  getAlbumById: async (id) => {
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      return response.data; // Retourne les détails de l'album
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'album :', error.message);
      throw error;
    }
  },

  /**
   * Créer un nouvel album
   * @param {FormData} albumData - Données de l'album (inclut une photo)
   * @returns {Promise<Object>} Album créé
   */
  createAlbum: async (albumData) => {
    try {
      const response = await axiosInstance.post('/albums', albumData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Nécessaire pour envoyer des fichiers
        },
      });
      return response.data; // Retourne l'album créé
    } catch (error) {
      console.error('Erreur lors de la création de l\'album :', error.message);
      throw error;
    }
  },

  /**
   * Mettre à jour un album
   * @param {string} id - ID de l'album à mettre à jour
   * @param {FormData} albumData - Données de l'album à mettre à jour (inclut une photo)
   * @returns {Promise<Object>} Album mis à jour
   */
  updateAlbum: async (id, albumData) => {
    try {
      const response = await axiosInstance.put(`/albums/${id}`, albumData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Nécessaire pour envoyer des fichiers
        },
      });
      return response.data; // Retourne l'album mis à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'album :', error.message);
      throw error;
    }
  },

  /**
   * Supprimer un album
   * @param {string} id - ID de l'album à supprimer
   * @returns {Promise<Object>} Message de confirmation
   */
  deleteAlbum: async (id) => {
    try {
      const response = await axiosInstance.delete(`/albums/${id}`);
      return response.data; // Retourne le message de confirmation
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'album :', error.message);
      throw error;
    }
  },
};

export default AlbumService;
