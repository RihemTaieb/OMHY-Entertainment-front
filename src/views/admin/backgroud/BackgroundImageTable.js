import React, { useState, useEffect } from "react";
import Card from "components/card"; // Remplacez par votre composant Card
import BackgroundImageService from "services/backgroundImageService";

function BackgroundImageTable() {
  const [sliders, setSliders] = useState([]); // Liste des sliders
  const [modalVisible, setModalVisible] = useState(false); // Modal d'ajout/modification
  const [formData, setFormData] = useState({
    images: [], // Fichiers à uploader
    description: "", // Description globale du slider
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSliderId, setEditSliderId] = useState(null);

  // Charger tous les sliders au démarrage
  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const data = await BackgroundImageService.getAllSliders();
      setSliders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sliders :", error.message);
    }
  };

  const handleAddOrEditSlider = async () => {
    try {
      const formDataToSend = new FormData();
      formData.images.forEach((file) => formDataToSend.append("images", file)); // Ajouter les fichiers
      formDataToSend.append("description", formData.description); // Ajouter la description

      if (isEditMode) {
        // Modifier un slider existant
        await BackgroundImageService.updateSlider(editSliderId, formDataToSend);
        alert("Slider mis à jour avec succès !");
      } else {
        // Créer un nouveau slider
        await BackgroundImageService.createSlider(formDataToSend);
        alert("Slider créé avec succès !");
      }

      fetchSliders(); // Rafraîchir les sliders
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du slider :", error.message);
      alert("Une erreur s'est produite. Veuillez vérifier vos données.");
    }
  };

  const handleDeleteSlider = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce slider ?")) {
      try {
        await BackgroundImageService.deleteSlider(id);
        alert("Slider supprimé avec succès !");
        fetchSliders(); // Rafraîchir les sliders
      } catch (error) {
        console.error("Erreur lors de la suppression du slider :", error.message);
      }
    }
  };

  const handleDeleteImage = async (sliderId, imageUrl) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
      try {
        await BackgroundImageService.deleteImageFromSlider(sliderId, imageUrl);
        alert("Image supprimée avec succès !");
        fetchSliders(); // Rafraîchir les sliders
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image :", error.message);
      }
    }
  };

  const handleEditClick = (slider) => {
    setFormData({
      images: [],
      description: slider.description,
    });
    setEditSliderId(slider._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      images: [],
      description: "",
    });
    setIsEditMode(false);
    setEditSliderId(null);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Sliders d'Images</h2>
        <button
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Ajouter un Slider
        </button>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Description</th>
            <th className="py-2 text-left">Images</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sliders.map((slider) => (
            <tr key={slider._id} className="border-b">
              <td className="py-2 text-left">{slider.description || "Aucune description"}</td>
              <td className="py-2 text-left">
                <div className="flex flex-wrap gap-2">
                  {slider.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={ `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${image}`}
                        alt={`Slider ${index}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => handleDeleteImage(slider._id, image)}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-2 text-center flex space-x-2 justify-center">
                <button
                  onClick={() => handleEditClick(slider)}
                  className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteSlider(slider._id)}
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
            <h3 className="text-xl font-bold mb-6">
              {isEditMode ? "Modifier" : "Ajouter"} Slider
            </h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleAddOrEditSlider}
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

export default BackgroundImageTable;
