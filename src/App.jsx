import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ArtistDetails from "views/client/ArtistDetails";
import routes from "./routes"; // Assurez-vous que routes.js est bien importé
import Profile from "views/client/profile";
import Casting from "views/client/Casting";
import Nocasting from "views/client/Nocasting";
import AlbumDetail from "views/client/AlbumsDetails";
import Albums from "views/client/Albums";
import About from "views/client/AboutUs";
import ProtectedRoute from "components/protectedRoute/ProtectedRoute"; // Import du Guard

import Groupe from "views/client/Groupe";
import NewsDetails from "views/client/News";
import SettingsService from "services/settingsService";

const App = () => {
  const [isCastingActive, setIsCastingActive] = useState(null); // Initialiser à `null` pour différencier le chargement
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État des erreurs

  // Charger les paramètres depuis l'API au démarrage
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await SettingsService.getSettings(); // Appelle l'API
        setIsCastingActive(data.isCastingActive); // Mets à jour l'état avec les données récupérées
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des paramètres.");
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  return (
    <Routes>
      {/* Redirection de /home vers la page d'accueil définie dans routes.js */}
      <Route 
        path="/home" 
        element={
          routes.find(route => route.layout === "/home" && route.path === "")?.component || <Navigate to="/" />
        } 
      />

      {/* Routes publiques */}
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="/rtl/*" element={<RtlLayout />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/groupe/:id" element={<Groupe />} />
      <Route path="/news" element={<NewsDetails />} />
      <Route 
        path="/casting" 
        element={
          isCastingActive !== null ? (
            isCastingActive ? <Casting /> : <Nocasting />
          ) : (
            <div>Chargement...</div> // Sécurité supplémentaire au cas où
          )
        } 
      />      <Route path="/aboutomhy" element={<About />} />
      <Route path="/artistdetails" element={<ArtistDetails />} />
      <Route path="/albums" element={<Albums />} />
      <Route path="/albums/:id" element={<AlbumDetail />} />

      {/* Routes protégées pour Admin */}
      <Route path="/admin/*" element={<ProtectedRoute />}>
        <Route path="*" element={<AdminLayout />} />
      </Route>

      {/* Redirection par défaut vers /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;
