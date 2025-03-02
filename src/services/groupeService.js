import axios from "axios";

// URL de base pour les requêtes vers votre API
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/groupes`;

const GroupeService = {
  /**
   * Récupérer tous les groupes
   * @returns {Array} Liste des groupes
   */
  getAllGroupes: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
      throw error;
    }
  },

  /**
   * Récupérer un groupe par ID
   * @param {String} id - ID du groupe
   * @returns {Object} Détails du groupe
   */
  getGroupeById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du groupe ${id} :`, error);
      throw error;
    }
  },

  /**
   * Créer un nouveau groupe
   * @param {Object} groupeData - Données du groupe (form-data)
   * @returns {Object} Le groupe créé
   */
  createGroupe: async (groupeData) => {
    try {
      const response = await axios.post(API_URL, groupeData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du groupe :", error);
      throw error;
    }
  },

  /**
   * Mettre à jour un groupe
   * @param {String} id - ID du groupe à mettre à jour
   * @param {Object} groupeData - Données du groupe (form-data)
   * @returns {Object} Le groupe mis à jour
   */
  updateGroupe: async (id, groupeData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, groupeData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du groupe ${id} :`, error);
      throw error;
    }
  },

  /**
   * Supprimer un groupe
   * @param {String} id - ID du groupe à supprimer
   * @returns {Object} Message de confirmation
   */
  deleteGroupe: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du groupe ${id} :`, error);
      throw error;
    }
  },
};

export default GroupeService;
