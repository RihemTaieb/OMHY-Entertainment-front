import React, { useState, useEffect } from "react";
import Card from "components/card";
import ArtisteService from "services/artisteService";
import ChansonService from "services/chansonService";
import GroupeService from "services/groupeService";

function ChansonTable() {
  const [chansons, setChansons] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterText, setFilterText] = useState(""); // État pour le filtre texte
  const [showOnlySelected, setShowOnlySelected] = useState(false); // État pour le filtre étoile

  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    anneeDeCreation: "",
    artistesIds: [], // Facultatif
    groupes: [], // Facultatif
    photo: null, // Facultatif
    linkyoutube:"",
    spotify:"",
  });
 // Filtrer les castings en fonction du texte de recherche et du filtre étoile
 const filteredChansons = chansons.filter((chanson) => {
  const searchText = filterText.toLowerCase();
  const matchesSearch =
  chanson.nom.toLowerCase().includes(searchText) 

  // Appliquez le filtre étoile si activé
  const isSelected = !showOnlySelected || chanson.isSelected;

  return matchesSearch && isSelected;
});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editChansonId, setEditChansonId] = useState(null);

  // Charger les données au démarrage
  useEffect(() => {
    fetchChansons();
    fetchArtistes();
    fetchGroupes();
  }, []);

  const fetchChansons = async () => {
    try {
      const data = await ChansonService.getAllChansons();
      setChansons(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chansons :", error.message);
    }
  };

  const fetchArtistes = async () => {
    try {
      const data = await ArtisteService.getAllArtistes();
      setArtistes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes :", error.message);
    }
  };

  const fetchGroupes = async () => {
    try {
      const data = await GroupeService.getAllGroupes();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error.message);
    }
  };

  const handleAddOrEditChanson = async () => {
    try {
      const formDataToSend = new FormData();

      // Ajout des champs obligatoires
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("anneeDeCreation", formData.anneeDeCreation);
      formDataToSend.append("spotify", formData.spotify);
      formDataToSend.append("linkyoutube", formData.linkyoutube);

      // Ajouter les artistes seulement s'ils sont sélectionnés
      if (formData.artistesIds.length > 0) {
        formData.artistesIds.forEach((artisteId) => {
          formDataToSend.append("artistesIds", artisteId);
        });
      }

      // Ajouter les groupes seulement s'ils sont sélectionnés
      if (formData.groupes.length > 0) {
        formData.groupes.forEach((groupeId) => {
          formDataToSend.append("groupes", groupeId);
        });
      }

      // Ajouter la photo si présente
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      if (isEditMode) {
        await ChansonService.updateChanson(editChansonId, formDataToSend);
        alert("Chanson mise à jour avec succès !");
      } else {
        await ChansonService.createChanson(formDataToSend);
        alert("Chanson ajoutée avec succès !");
      }

      fetchChansons();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la chanson :", error.message);
      alert("Une erreur s'est produite. Veuillez vérifier vos données.");
    }
  };

  const handleDeleteChanson = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette chanson ?")) {
      try {
        await ChansonService.deleteChanson(id);
        alert("Chanson supprimée avec succès !");
        fetchChansons();
      } catch (error) {
        console.error("Erreur lors de la suppression de la chanson :", error.message);
      }
    }
  };

  const handleEditClick = (chanson) => {
    setFormData({
      nom: chanson.nom,
      type: chanson.type,
      anneeDeCreation: chanson.anneeDeCreation,
      artistesIds: chanson.artistes ? chanson.artistes.map((artiste) => artiste._id) : [],
      groupes: chanson.groupes ? chanson.groupes.map((groupe) => groupe._id) : [],
      photo: null,
      linkyoutube:chanson.linkyoutube,
    spotify:chanson.spotify,
    });
    setEditChansonId(chanson._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      type: "",
      anneeDeCreation: "",
      artistesIds: [],
      groupes: [],
      photo: null,
      linkyoutube:"",
    spotify:"",
    });
    setIsEditMode(false);
    setEditChansonId(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleArtistesChange = (e) => {
    const selectedArtistes = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, artistesIds: selectedArtistes });
  };

  const handleGroupesChange = (e) => {
    const selectedGroupes = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, groupes: selectedGroupes });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Candidats</h2>
        <button
          onClick={() => {
            setModalVisible(true);
            resetForm();
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Ajouter une chanson
        </button>
      </header>

      {/* Barre de recherche et filtre étoile */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Rechercher par nom ..."
          className="border p-2 rounded w-3/4"
        />
        </div>
        

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Nom</th>
            <th className="py-2 text-center">Date de Création</th>
            <th className="py-2 text-left">Artistes</th>
            <th className="py-2 text-left">Groupes</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredChansons.map((chanson) => (
    <tr key={chanson._id} className="border-b">
     

      {/* Nom de la chanson */}
      <td className="py-2 text-left">{chanson.nom}</td>

      {/* Année de création formatée */}
      <td className="py-2 text-center">{formatDate(chanson.anneeDeCreation)}</td>

      {/* Artistes associés */}
      <td className="py-2 text-left">
        {chanson.artistes?.length > 0
          ? chanson.artistes.map((artiste) => `${artiste.nom} ${artiste.prenom}`).join(", ")
          : "Aucun artiste"}
      </td>

      {/* Groupes associés */}
      <td className="py-2 text-left">
        {chanson.groupes?.length > 0
          ? chanson.groupes.map((groupe) => groupe.name).join(", ")
          : "Aucun groupe"}
      </td>

      {/* Lien vers un extrait audio ou vidéo si disponible */}
      <td className="py-2 text-center">
        {chanson.extrait ? (
          <a
            href={chanson.extrait}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Écouter
          </a>
        ) : (
          "Aucun extrait"
        )}
      </td>

      {/* Boutons d'actions */}
      <td className="py-2 text-center flex space-x-2 justify-center">
        <button
          onClick={() => handleEditClick(chanson)}
          className="bg-[#cc81a1] text-white px-2 py-1 rounded"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDeleteChanson(chanson._id)}
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
            <h3 className="text-xl font-bold mb-6">{isEditMode ? "Modifier" : "Ajouter"} Chanson</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  
                   <textarea
                  name="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Décrivez-vous"
                  className="border p-2 rounded w-full col-span-2"
                  rows="4"
                  wrap="soft" // Active le retour à la ligne

                ></textarea>
                </div>
                <div>
                  <label className="block mb-2">youtube</label>
                  <input
                    type="text"
                    value={formData.linkyoutube}
                    onChange={(e) => setFormData({ ...formData, linkyoutube: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">spotify</label>
                  <input
                    type="text"
                    value={formData.spotify}
                    onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date de Création</label>
                  <input
                    type="date"
                    value={formData.anneeDeCreation}
                    onChange={(e) => setFormData({ ...formData, anneeDeCreation: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Artistes (Optionnel)</label>
                  <select
                    multiple
                    value={formData.artistesIds}
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
                  <label className="block mb-2">Groupes </label>
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
                  <label className="block mb-2">Photo </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleAddOrEditChanson}
                  className="bg-[#703a79] text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Mettre à jour" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ChansonTable;
