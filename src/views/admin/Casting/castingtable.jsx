import React, { useState, useEffect } from "react";
import Card from "components/card"; // Chemin vers votre composant Card
import CastingService from "services/castingService"; // Service API

function CastingTable() {
  const [isCastingActive, setIsCastingActive] = useState(true);

  // Charger l'état depuis localStorage au démarrage
  useEffect(() => {
    const savedState = localStorage.getItem("castingActive");
    if (savedState !== null) {
      setIsCastingActive(JSON.parse(savedState));
    }
  }, []);

  // Fonction pour basculer entre "Casting" et "NoCasting"
  const toggleCastingVisibility = () => {
    const newState = !isCastingActive;
    setIsCastingActive(newState);
    localStorage.setItem("castingActive", JSON.stringify(newState)); // Sauvegarde
  };
  const [adminMessage, setAdminMessage] = useState("");

// Charger le message depuis localStorage au démarrage
useEffect(() => {
  const savedMessage = localStorage.getItem("adminMessage");
  if (savedMessage !== null) {
    setAdminMessage(savedMessage);
  }
}, []);
const handleAdminMessageChange = (e) => {
  const newMessage = e.target.value;
  setAdminMessage(newMessage);
  localStorage.setItem("adminMessage", newMessage);
};

  const [castings, setCastings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    social: "",
    age: "",
    parentName: "",
    parentContact: "",
    video: null, // fichier vidéo
    profile: "", // Nouveau champ pour la description
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCastingId, setEditCastingId] = useState(null);
  const [loading, setLoading] = useState(false); // Pour indiquer si les données se chargent
  const [filterText, setFilterText] = useState(""); // État pour le filtre texte
  const [showOnlySelected, setShowOnlySelected] = useState(false); // État pour le filtre étoile

    const [message, setMessage] = useState("");
  
    // Remplace **mot** par <b>mot</b>
    const formatText = (text) => {
      return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    };
  // Récupère les castings lors du chargement initial
  useEffect(() => {
    fetchCastings();
  }, []);

  const fetchCastings = async () => {
    setLoading(true);
    try {
      const { data } = await CastingService.getCastings();
      setCastings(data);
    } catch (error) {
      console.error("Erreur lors du chargement des castings :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleAddOrEditCasting = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      });

      if (isEditMode) {
        await CastingService.updateCasting(editCastingId, formDataToSend);
      } else {
        await CastingService.createCasting(formDataToSend);
      }

      fetchCastings();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
    }
  };

  const handleDeleteCasting = async (id) => {
    if (!id) {
      console.error("L'ID pour la suppression est manquant !");
      return;
    }
    console.log("Tentative de suppression pour l'ID :", id);
  
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce casting ?")) {
      try {
        const response = await CastingService.deleteCasting(id);
        console.log("Réponse de l'API :", response.data);
        fetchCastings(); // Recharge les castings après suppression
      } catch (error) {
        console.error("Erreur lors de la suppression :", error.response || error.message);
      }
    }
  };
  

  const handleEditClick = (casting) => {
    setFormData({
      ...casting,
      video: null, // Réinitialisation de la vidéo pour éviter les conflits
    });
    setEditCastingId(casting._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      social: "",
      age: "",
      parentName: "",
      parentContact: "",
      video: null,
      profile: "", // Réinitialisation de la description
    });
    setIsEditMode(false);
    setEditCastingId(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Fonction pour sélectionner/désélectionner un candidat (met à jour la base de données)
  const handleSelectCandidate = async (id) => {
    const candidate = castings.find((c) => c._id === id);
    if (!candidate) return;

    const updatedStatus = !candidate.isSelected;

    try {
      // Mise à jour de `isSelected` dans la base de données
      await CastingService.updateCasting(id, { isSelected: updatedStatus });

      // Mise à jour locale de l'état des candidats
      setCastings((prevCastings) =>
        prevCastings.map((c) =>
          c._id === id ? { ...c, isSelected: updatedStatus } : c
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la sélection :", error);
    }
  };

  // Filtrer les castings en fonction du texte de recherche et du filtre étoile
  const filteredCastings = castings.filter((casting) => {
    const searchText = filterText.toLowerCase();
    const matchesSearch =
      casting.fullName.toLowerCase().includes(searchText) ||
      casting.email.toLowerCase().includes(searchText);

    // Appliquez le filtre étoile si activé
    const isSelected = !showOnlySelected || casting.isSelected;

    return matchesSearch && isSelected;
  });

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
          Ajouter un Casting
        </button>
       
      </header>
      <div className="flex items-center space-x-4">
      <span className="text-gray-700 font-medium">
        {isCastingActive ? "Casting Activé" : "NoCasting Activé"}
      </span>
      
      <button
        onClick={toggleCastingVisibility}
        className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-all ${
          isCastingActive ? "bg-green-500" : "bg-red-700"
        }`}
      >
        <div
          className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
            isCastingActive ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>

      </button>
      
    </div>
      {/* Barre de recherche et filtre étoile */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="border p-2 rounded w-3/4"
        />
        <button
          onClick={() => setShowOnlySelected(!showOnlySelected)}
          className={`px-4 py-2 rounded ${
            showOnlySelected ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-700"
          }`}
        >
          {showOnlySelected ? "★" : "★"}
        </button>
        
      </div>
      <div className="mt-4 p-4 border rounded bg-gray-100">
  <h3 className="text-lg font-semibold mb-2">Message Administrateur</h3>
  <textarea
        value={adminMessage}
        onChange={handleAdminMessageChange}
        placeholder="Ajoutez un message pour les clients (entourez **mot** pour le mettre en gras)..."
        wrap="soft"
        className="border p-2 w-full h-24 rounded"
      ></textarea>
  {adminMessage && (
  <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
    <h3 className="text-lg font-semibold text-yellow-700">Annonce Importante :</h3>
    <p
            className="text-gray-800"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: formatText(adminMessage) }}
          />  </div>
)}

</div>

      {loading ? (
        <div className="text-center mt-4">Chargement...</div>
      ) : (
        <table className="w-full mt-6 table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Sélection</th>
              <th className="py-2 text-left">Nom Complet</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-center">Téléphone</th>
              <th className="py-2 text-center">Âge</th>
              <th className="py-2 text-center">Vidéo</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCastings.map((casting) => (
              <tr key={casting._id} className="border-b">
                <td className="py-2 text-center">
                  <button
                    onClick={() => handleSelectCandidate(casting._id)}
                    className={`text-2xl ${
                      casting.isSelected ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    ★
                  </button>
                </td>
                <td className="py-2 text-left">{casting.fullName}</td>
                <td className="py-2 text-left">{casting.email}</td>
                <td className="py-2 text-center">{casting.phone}</td>
                <td className="py-2 text-center">{casting.age}</td>
                <td className="py-2 text-center">
                  {casting.video ? (
                    <a
                      href={casting.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Voir
                    </a>
                  ) : (
                    "Aucune vidéo"
                  )}
                </td>
                <td className="py-2 text-center flex space-x-2 justify-center">
                  <button
                    onClick={() => handleEditClick(casting)}
                    className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteCasting(casting._id)}
                    className="bg-[#595959] text-white px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modale */}
      {modalVisible && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-8 rounded shadow-lg w-[50vw] h-auto mt-20">
            <h2 className="text-xl font-bold text-navy-700">
              {isEditMode ? "Modifier le casting" : "Ajouter un casting"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrEditCasting();
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nom complet"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Âge"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Nom du parent"
                  className="border p-2 rounded w-full"
                />
                <input
                  type="tel"
                  name="parentContact"
                  value={formData.parentContact}
                  onChange={handleInputChange}
                  placeholder="Contact du parent"
                  className="border p-2 rounded w-full"
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse"
                  className="border p-2 rounded w-full col-span-2"
                ></textarea>
                <textarea
                  name="profile"
                  value={formData.profile}
                  onChange={handleInputChange}
                  placeholder="Décrivez-vous"
                  className="border p-2 rounded w-full col-span-2"
                  rows="4"
                ></textarea>
                <input
                  type="file"
                  name="video"
                  onChange={handleFileChange}
                  className="border p-2 rounded w-full col-span-2"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditMode ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}

export default CastingTable;
