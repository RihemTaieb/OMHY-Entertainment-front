import React, { useState, useEffect } from "react";
import Card from "components/card";
import ArtisteService from "services/artisteService";

function ArtisteTable() {
  const [artistes, setArtistes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    profile: "",
    instag:"",
    Facebook:"",lienvideo:"",
    dateAnniversaire: "",
    dateDeJoindre: "",
    decriptionsousimage:"",
    photo: "", // File for image upload
    photoCouverture:"",
    bol:"",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editArtisteId, setEditArtisteId] = useState(null);

  useEffect(() => {
    fetchArtistes();
  }, []);
 
  
  const fetchArtistes = async () => {
    try {
      console.log("Fetching artistes...");
      const data = await ArtisteService.getAllArtistes(); // Appel à ArtisteService
      console.log("Fetched artistes data:", data);
      setArtistes(data); // Mise à jour de l'état
    } catch (error) {
      console.error("Failed to fetch artistes:", error.response || error.message);
    }
  };
  


  const handleAddOrEditArtiste = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("prenom", formData.prenom);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("profile", formData.profile);
      formDataToSend.append("instag", formData.instag);
      formDataToSend.append("Facebook", formData.Facebook);
      formDataToSend.append("lienvideo", formData.lienvideo);

      formDataToSend.append("decriptionsousimage", formData.decriptionsousimage);

      formDataToSend.append("dateAnniversaire", formData.dateAnniversaire);
      formDataToSend.append("dateDeJoindre", formData.dateDeJoindre);
      formDataToSend.append("bol", formData.bol);


      // Check if there's a photo and append it to formData
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      if (formData.photoCouverture) {
        formDataToSend.append("photoCouverture", formData.photoCouverture);
      }

      if (isEditMode) {
        await ArtisteService.updateArtiste(editArtisteId, formDataToSend);
      } else {
        await ArtisteService.createArtiste(formDataToSend);
      }

      fetchArtistes();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save artiste:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file }); // Save the file directly
    }
  };
  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photoCouverture: file }); // Save the file directly
    }
  };

  const handleDeleteArtiste = async (id) => {
    if (window.confirm("Are you sure you want to delete this artiste?")) {
      try {
        await ArtisteService.deleteArtiste(id);
        fetchArtistes();
      } catch (error) {
        console.error("Failed to delete artiste:", error);
      }
    }
  };

  const handleEditClick = (artiste) => {
    setFormData({ ...artiste });
    setEditArtisteId(artiste._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      age: "",
      profile: "",
      instag:"",
      Facebook:"",lienvideo:"",
      dateAnniversaire: "",
      dateDeJoindre: "",
      decriptionsousimage:"",
      photo: "", // reset photo field
      photoCouverture: "",
      bol:"",
    });
    setIsEditMode(false);
    setEditArtisteId(null);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20 overflow-x-auto overflow-y-auto">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Artistes</h2>
        <button
          onClick={() => {
            setModalVisible(true);
            resetForm();
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Add Artiste
        </button>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Photo</th>
            <th className="py-2 text-left">Photocouverture</th>

            <th className="py-2 text-left">Nom</th>
            <th className="py-2 text-left">Prenom</th>


            <th className="py-2 text-center">Date Anniversaire</th>
            <th className="py-2 text-center">Début de collaboration</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artistes.map((artiste) => (
            <tr key={artiste._id} className="border-b">
              <td className="py-2 text-left">
              <img 
  src={artiste.photo && artiste.photo.length > 0 ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${artiste.photo[0]}` : '/default-avatar.png'} 
  alt="Artiste"   className="w-12 h-12 rounded-full object-cover"

/>




              </td>
              <td className="py-2 text-left">
              <img 
  src={artiste.photoCouverture && artiste.photoCouverture.length > 0 ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${artiste.photoCouverture[0]}` : '/default-avatar.png'} 
  alt="Artiste"   className="w-12 h-12 rounded-full object-cover"

/>




              </td>
              <td className="py-2 text-left">{artiste.nom}</td>
              <td className="py-2 text-left">{artiste.prenom}</td>

              <td className="py-2 text-center">{formatDate(artiste.dateAnniversaire)}</td>
              <td className="py-2 text-center">{formatDate(artiste.dateDeJoindre)}</td>
              <td className="py-2 text-center flex space-x-2 justify-center">
                <button
                  onClick={() => handleEditClick(artiste)}
                  className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteArtiste(artiste._id)}
                  className="bg-[#595959] text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start overflow-x-auto overflow-y-auto">
    <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-20">
            <h3 className="text-xl font-bold mb-6">{isEditMode ? "Edit" : "Add"} Artiste</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6 mb-6 ">
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
                  <label className="block mb-2">Prenom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Profile</label>
                  <textarea
                  name="profile"
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
                  <label className="block mb-2">lien video</label>
                  <input
                    type="text"
                    value={formData.lienvideo}
                    onChange={(e) => setFormData({ ...formData, lienvideo: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date Anniversaire</label>
                  <input
                    type="date"
                    value={formData.dateAnniversaire}
                    onChange={(e) => setFormData({ ...formData, dateAnniversaire: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Début de collaboration</label>
                  <input
                    type="date"
                    value={formData.dateDeJoindre}
                    onChange={(e) => setFormData({ ...formData, dateDeJoindre: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
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
                <div>
                  <label className="block mb-2">Photo Couverture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange1}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
  <label className="block mb-2">Afficher Artiste </label>
  <input
    type="checkbox"
    checked={formData.bol} // Propriété booléenne
    onChange={(e) => setFormData({ ...formData, bol: e.target.checked })}
    className="border rounded p-2"
  />
</div>
              </div>              
              <button
                type="button"
                onClick={handleAddOrEditArtiste}
                className="bg-[#703a79] text-white px-4 py-2 rounded"
              >
                {isEditMode ? "Update" : "Add"} Artiste
              </button>
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ArtisteTable;