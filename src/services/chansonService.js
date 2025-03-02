import axios from "axios";

// URL de base pour les requêtes vers votre API
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/chansons`;


const ChansonService = {
  /**
   * Récupérer toutes les chansons
   * @returns {Array} Liste des chansons
   */
  getAllChansons: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des chansons :", error);
      throw error;
    }
  },

  /**
   * Récupérer une chanson par ID
   * @param {String} id - ID de la chanson
   * @returns {Object} Détails de la chanson
   */
  getChansonById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la chanson ${id} :`, error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle chanson
   * @param {Object} chansonData - Données de la chanson (form-data)
   * @returns {Object} La chanson créée
   */
  createChanson: async (chansonData) => {
    const response = await axios.post(API_URL, chansonData);
    return response.data;
  },
  

  /**
   * Mettre à jour une chanson
   * @param {String} id - ID de la chanson à mettre à jour
   * @param {Object} chansonData - Données de la chanson (form-data)
   * @returns {Object} La chanson mise à jour
   */
  updateChanson: async (id, chansonData) => {
    const response = await axios.put(`${API_URL}/${id}`, chansonData);
    return response.data;
  },

  /**
   * Supprimer une chanson
   * @param {String} id - ID de la chanson à supprimer
   * @returns {Object} Message de confirmation
   */
  deleteChanson: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la chanson ${id} :`, error);
      throw error;
    }
  },
};

export default ChansonService;
