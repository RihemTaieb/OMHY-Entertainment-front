import React, { useState, useEffect } from "react";
import Card from "components/card";
import AlbumService from "services/albumService";
import ArtisteService from "services/artisteService";
import ChansonService from "services/chansonService";
import GroupeService from "services/groupeService";

function AlbumTable() {
  const [albums, setAlbums] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [chansons, setChansons] = useState([]);
  const [groupes, setGroupes] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    text: "",

    anneeDeSortie: "",
    artistes: [],
    chansons: [],
    groupes:[],
    photo: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editAlbumId, setEditAlbumId] = useState(null);

  useEffect(() => {
    fetchAlbums();
    fetchArtistes();
    fetchChansons();
    fetchGroupes();
  }, []);

  /**
   * Récupère la liste des albums
   */
    const fetchGroupes = async () => {
      try {
        const data = await GroupeService.getAllGroupes();
        setGroupes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes :", error.message);
      }
    };
  
  const fetchAlbums = async () => {
    try {
      const data = await AlbumService.getAllAlbums();
      setAlbums(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des albums :", error);
    }
  };

  /**
   * Récupère la liste des artistes
   */
const fetchArtistes = async () => {
    try {
      const data = await ArtisteService.getAllArtistes();
      setArtistes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes :", error.message);
    }
  };

  /**
   * Récupère la liste des chansons
   */
  const fetchChansons = async () => {
    try {
      const data = await ChansonService.getAllChansons();
      setChansons(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chansons :", error);
    }
  };

  /**
   * Crée ou met à jour un album
   */
  const handleAddOrEditAlbum = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      formDataToSend.append("text", formData.text);

      formDataToSend.append("anneeDeSortie", formData.anneeDeSortie);

      formData.artistes.forEach((artisteId) => {
        formDataToSend.append("artistes", artisteId);
      });

      formData.chansons.forEach((chansonId) => {
        formDataToSend.append("chansons", chansonId);
      });

      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }
      if (formData.groupes.length > 0) {
        formData.groupes.forEach((groupeId) => {
          formDataToSend.append("groupes", groupeId);
        });
      }
      if (isEditMode) {
        await AlbumService.updateAlbum(editAlbumId, formDataToSend);
        alert("Album mis à jour avec succès !");
      } else {
        await AlbumService.createAlbum(formDataToSend);
        alert("Album ajouté avec succès !");
      }

      fetchAlbums();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'album :", error);
    }
  };

  /**
   * Supprime un album
   */
  const handleDeleteAlbum = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet album ?")) {
      try {
        await AlbumService.deleteAlbum(id);
        alert("Album supprimé avec succès !");
        fetchAlbums();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'album :", error);
      }
    }
  };

  /**
   * Gère la sélection des artistes
   */
  const handleArtistesChange = (e) => {
    const selectedArtistes = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, artistes: selectedArtistes });
  };

  /**
   * Gère la sélection des chansons
   */
  const handleChansonsChange = (e) => {
    const selectedChansons = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, chansons: selectedChansons });
  };

  const handleGroupesChange = (e) => {
    const selectedGroupes = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, groupes: selectedGroupes });
  };
  /**
   * Gère le clic pour éditer un album
   */
  const handleEditClick = (album) => {
    setFormData({
      titre: album.titre,
      text: album.text,

      anneeDeSortie: album.anneeDeSortie,
      artistes: album.artistes ? album.artistes.map((artiste) => artiste._id) : [],
      chansons: album.chansons ? album.chansons.map((chanson) => chanson._id) : [],
      groupes: album.groupes ? album.groupes.map((groupe) => groupe._id) : [],
      photo: null,


    });
    setEditAlbumId(album._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  /**
   * Réinitialise le formulaire
   */
  const resetForm = () => {
    setFormData({
      titre: "",
      text: "",

      anneeDeSortie: "",
      artistes: [],
      chansons: [],
      groupes:[],
      photo: null,
    });
    setIsEditMode(false);
    setEditAlbumId(null);
  };

  /**
   * Ferme le modal
   */
  const closeModal = () => {
    resetForm();
    setModalVisible(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Albums</h2>
        <button
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Ajouter un Album
        </button>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Photo</th>
            <th className="py-2 text-left">Titre</th>
            <th className="py-2 text-left">Année de Sortie</th>
            <th className="py-2 text-left">Artistes</th>
            <th className="py-2 text-left">Chansons</th>
            <th className="py-2 text-left">Groupes</th>

            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <tr key={album._id} className="border-b">
              <td className="py-2 text-left">
                <img
                  src={album.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${album.photo}` : '/default-avatar.png'}
                  alt={album.titre}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="py-2 text-left">{album.titre}</td>
              <td className="py-2 text-left">{album.anneeDeSortie || "N/A"}</td>
              <td className="py-2 text-left">
                {album.artistes?.map((artiste) => `${artiste.nom} ${artiste.prenom}`).join(", ") || "N/A"}
              </td>
              <td className="py-2 text-left">
                {album.chansons?.map((chanson) => chanson.nom).join(", ") || "N/A"}
              </td>
              <td className="py-2 text-left">
              {album.groupes?.length > 0
                  ? album.groupes.map((groupe) => groupe.name).join(", ")
                  : "Aucun groupe"}              </td>
              <td className="py-2 text-center flex space-x-2 justify-center">
                <button
                  onClick={() => handleEditClick(album)}
                  className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteAlbum(album._id)}
                  className="bg-[#595959] text-white px-2 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start overflow-x-auto overflow-y-auto">
    <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-20">
            <h3 className="text-xl font-bold mb-6">{isEditMode ? "Modifier" : "Ajouter"} Album</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="border rounded p-2 w-full"


                  />
                </div>
                <div>
                  <label className="block mb-2">text</label>
                 
                   <textarea
                  name="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="text"
                  className="border rounded p-2 w-full"
                  wrap="soft" // Active le retour à la ligne

                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2">Année de Sortie</label>
                  <input
                    type="number"
                    value={formData.anneeDeSortie}
                    onChange={(e) => setFormData({ ...formData, anneeDeSortie: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Artistes</label>
                  <select
                    multiple
                    value={formData.artistes}
                    onChange={handleArtistesChange}
                    className="border rounded p-2 w-full"
                  >
                    {artistes.map((artiste) => (
                      <option key={artiste._id} value={artiste._id}>
                        {artiste.nom} {artiste.prenom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Groupes</label>
                  <select
                    multiple
                    value={formData.groupes}
                    onChange={handleGroupesChange}
                    className="border rounded p-2 w-full"
                  >
                    {groupes.map((groupe) => (
                      <option key={groupe._id} value={groupe._id}>
                        {groupe.name} 
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Chansons</label>
                  <select
                    multiple
                    value={formData.chansons}
                    onChange={handleChansonsChange}
                    className="border rounded p-2 w-full"
                  >
                    {chansons.map((chanson) => (
                      <option key={chanson._id} value={chanson._id}>
                        {chanson.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddOrEditAlbum}
                className="bg-[#703a79] text-white px-4 py-2 rounded"
              >
                {isEditMode ? "Mettre à jour" : "Ajouter"} Album
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AlbumTable;
