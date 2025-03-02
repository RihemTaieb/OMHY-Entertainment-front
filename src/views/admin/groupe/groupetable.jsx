import React, { useState, useEffect } from "react";
import Card from "components/card";
import ArtisteService from "services/artisteService";
import GroupeService from "services/groupeService";

function GroupeTable() {
  const [groupes, setGroupes] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    profile: "",
    instag: "",
    Facebook: "",
    lienvideo: "",
    dateDeJoindre: "",
    artistesIds: [], // Utilisation correcte pour les artistes
    decriptionsousimage:"",
    photo: null, // Fichier pour photo
    photoCouverture: null, // Fichier pour photo de couverture
    bol:"",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editGroupeId, setEditGroupeId] = useState(null);

  // Charger les groupes et les artistes au démarrage
  useEffect(() => {
    fetchGroupes();
    fetchArtistes();
  }, []);

  // Récupérer tous les groupes
  const fetchGroupes = async () => {
    try {
      const data = await GroupeService.getAllGroupes();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error.message);
    }
  };

  // Récupérer tous les artistes
  const fetchArtistes = async () => {
    try {
      const data = await ArtisteService.getAllArtistes();
      setArtistes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes :", error.message);
    }
  };

  // Ajouter ou modifier un groupe
  const handleAddOrEditGroupe = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("profile", formData.profile);
      formDataToSend.append("instag", formData.instag);
      formDataToSend.append("Facebook", formData.Facebook);
      formDataToSend.append("lienvideo", formData.lienvideo);
      formDataToSend.append("dateDeJoindre", formData.dateDeJoindre);
      formDataToSend.append("bol", formData.bol);
      formDataToSend.append("decriptionsousimage", formData.decriptionsousimage);


      // Ajouter les artistes sélectionnés
      formData.artistesIds.forEach((artisteId) => {
        formDataToSend.append("artistes", artisteId);
      });

      // Ajouter les fichiers si présents
      if (formData.photo) formDataToSend.append("photo", formData.photo);
      if (formData.photoCouverture) formDataToSend.append("photoCouverture", formData.photoCouverture);

      if (isEditMode) {
        await GroupeService.updateGroupe(editGroupeId, formDataToSend);
        alert("Groupe mis à jour avec succès !");
      } else {
        await GroupeService.createGroupe(formDataToSend);
        alert("Groupe ajouté avec succès !");
      }

      fetchGroupes();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du groupe :", error.message);
      alert("Une erreur s'est produite. Veuillez vérifier vos données.");
    }
  };

  // Supprimer un groupe
  const handleDeleteGroupe = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
      try {
        await GroupeService.deleteGroupe(id);
        alert("Groupe supprimé avec succès !");
        fetchGroupes();
      } catch (error) {
        console.error("Erreur lors de la suppression du groupe :", error.message);
      }
    }
  };

  // Préparer les données pour la modification
  const handleEditClick = (groupe) => {
    setFormData({
      name: groupe.name,
      profile: groupe.profile,
      instag: groupe.instag,
      Facebook: groupe.Facebook,
      lienvideo: groupe.lienvideo,
      dateDeJoindre: groupe.dateDeJoindre,
      artistesIds: groupe.artistes.map((artiste) => artiste._id),
      photo: null, // Champ vide pour éviter de remplir le fichier
      photoCouverture: null, // Champ vide pour éviter de remplir le fichier
      bol:groupe.bol,
      decriptionsousimage:groupe.decriptionsousimage,
    });
    setEditGroupeId(groupe._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: "",
      profile: "",
      instag: "",
      Facebook: "",
      lienvideo: "",
      dateDeJoindre: "",
      artistesIds: [],
      photo: null,
      photoCouverture: null,
      bol:"",
      decriptionsousimage:"",
    });
    setIsEditMode(false);
    setEditGroupeId(null);
  };

  // Fermer le modal
  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Gérer la sélection multiple d'artistes
  const handleArtistesChange = (e) => {
    const selectedArtistes = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, artistesIds: selectedArtistes });
  };

  // Gérer la sélection des fichiers
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Groupes</h2>
        <button
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Ajouter un Groupe
        </button>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Photo</th>
            <th className="py-2 text-left">Photo couverture</th>

            <th className="py-2 text-left">Nom</th>
            <th className="py-2 text-center">Date de Création</th>
            <th className="py-2 text-left">Artistes</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupes.map((groupe) => (
            <tr key={groupe._id} className="border-b">
              <td className="py-2 text-left">
                <img
                  src={groupe.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${groupe.photo}` : '/default-avatar.png'}
                  alt="Groupe"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="py-2 text-left">
                <img
                  src={groupe.photo ?`${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${groupe.photoCouverture}` : '/default-avatar.png'}
                  alt="Groupe"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </td>
              <td className="py-2 text-left">{groupe.name}</td>
              <td className="py-2 text-center">{formatDate(groupe.dateDeJoindre )|| "N/A"}</td>
              <td className="py-2 text-left">
                {groupe.artistes.map((artiste) => `${artiste.nom} ${artiste.prenom}`).join(", ")}
              </td>
              <td className="py-2 text-center flex space-x-2 justify-center">
                <button
                  onClick={() => handleEditClick(groupe)}
                  className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteGroupe(groupe._id)}
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
            <h3 className="text-xl font-bold mb-6">{isEditMode ? "Modifier" : "Ajouter"} Groupe</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Profil</label>
                  
                   <textarea
                  name="text"
                  value={formData.profile}
                  onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                  placeholder="Profile"
                  className="border rounded p-2 w-full"
                  wrap="soft" // Active le retour à la ligne

                  ></textarea>
                </div>
                <div>
                  <label className="block mb-2">decription sous image</label>
                  <input
                    type="text"
                    value={formData.decriptionsousimage}
                    onChange={(e) => setFormData({ ...formData, decriptionsousimage: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Instagram</label>
                  <input
                    type="text"
                    value={formData.instag}
                    onChange={(e) => setFormData({ ...formData, instag: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Facebook</label>
                  <input
                    type="text"
                    value={formData.Facebook}
                    onChange={(e) => setFormData({ ...formData, Facebook: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Lien Vidéo</label>
                  <input
                    type="text"
                    value={formData.lienvideo}
                    onChange={(e) => setFormData({ ...formData, lienvideo: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date de Création</label>
                  <input
                    type="date"
                    value={formData.dateDeJoindre}
                    onChange={(e) => setFormData({ ...formData, dateDeJoindre: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Artistes</label>
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
                  <label className="block mb-2">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "photo")}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Photo de Couverture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "photoCouverture")}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
  <label className="block mb-2">Afficher Groupe </label>
  <input
    type="checkbox"
    checked={formData.bol} // Propriété booléenne
    onChange={(e) => setFormData({ ...formData, bol: e.target.checked })}
    className="border rounded p-2"
  />
</div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleAddOrEditGroupe}
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

export default GroupeTable;
