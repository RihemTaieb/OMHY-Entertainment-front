import axiosInstance from '../api/axiosInstance';

// Définition de l'URL de l'API en utilisant l'environnement
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

// 🔹 Fonction pour se connecter
export const login = async (credentials) => {
  try {
    console.log("🔹 Envoi de la requête de connexion avec :", credentials);

    const response = await axiosInstance.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    // Stocker le token après connexion
    localStorage.setItem("authToken", response.data.token);

    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors de la connexion :", error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// 🔹 Fonction pour s'inscrire
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// 🔹 Fonction pour se déconnecter
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");

  // Rediriger vers la page de connexion
  window.location.href = "/auth/sign-in";
};
