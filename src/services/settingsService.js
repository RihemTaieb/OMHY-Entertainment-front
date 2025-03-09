import axiosInstance from '../api/axiosInstance'; // Importez votre instance Axios

const SettingsService = {
  /**
   * Récupère les paramètres actuels
   * @returns {Promise<Object>} Les données des paramètres
   */
  getSettings: async () => {
    const response = await axiosInstance.get('/settings');
    return response.data; // Retourne les paramètres récupérés depuis l'API
  },

  /**
   * Met à jour les paramètres
   * @param {Object} settingsData Les données à mettre à jour (e.g., { isCastingActive, adminMessage })
   * @returns {Promise<Object>} Les données mises à jour
   */
  updateSettings: async (settingsData) => {
    const response = await axiosInstance.put('/settings', settingsData, {
      headers: {
        "Content-Type": "application/json", // Type de contenu attendu
      },
    });
    return response.data; // Retourne les paramètres mis à jour
  },
};

export default SettingsService;
