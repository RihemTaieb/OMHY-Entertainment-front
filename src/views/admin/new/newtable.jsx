import React, { useState, useEffect } from "react";
import Card from "components/card";
import NewsService from "services/newsService";

function NewsTable() {
  const [news, setNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({
    titre: "",
    contenu: "",
    date: "",
    image: null, // File for image upload
    lien:"",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editNewsId, setEditNewsId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await NewsService.getAllNews();
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  const handleAddOrEditNews = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      formDataToSend.append("contenu", formData.contenu);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("lien", formData.lien);
  
      // Ajout de l'image si elle est présente
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
  
      if (isEditMode) {
        await NewsService.updateNews(editNewsId, formDataToSend);
      } else {
        await NewsService.createNews(formDataToSend);
      }
  
      // Affiche un message de succès
      alert("Actualité ajoutée ou modifiée avec succès !");
  
      // Actualise la liste des actualités
      fetchNews();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Échec de la sauvegarde de l'actualité :", error);
      alert("Une erreur est survenue lors de la sauvegarde de l'actualité.");
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file }); // Save the file directly
    }
  };

  const handleDeleteNews = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await NewsService.deleteNews(id);
        fetchNews();
      } catch (error) {
        console.error("Failed to delete news:", error);
      }
    }
  };

  const handleEditClick = (newsItem) => {
    setFormData({
      titre: newsItem.titre,
      contenu: newsItem.contenu,
      date: newsItem.date,
      lien: newsItem.lien,

    });
    setEditNewsId(newsItem._id);
    setIsEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      contenu: "",
      date: "",
      image: null, // Reset image field
      lien:"",
    });
    setIsEditMode(false);
    setEditNewsId(null);
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
        <h2 className="text-xl font-bold text-navy-700">News</h2>
        <button
          onClick={() => {
            setModalVisible(true);
            resetForm();
          }}
          className="bg-[#703a79] text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Image</th>
            <th className="py-2 text-left">Titre</th>
            <th className="py-2 text-center">Date</th>
            <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((newsItem) => (
            <tr key={newsItem._id} className="border-b">
              <td className="py-2 text-left">
                <img
                  src={
                    newsItem.image
                      ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${newsItem.image}`
                      : "/default-placeholder.png"
                  }
                  alt="News"
                  className="w-12 h-12 rounded object-cover"
                />
              </td>
              <td className="py-2 text-left">{newsItem.titre}</td>
              <td className="py-2 text-center">{formatDate(newsItem.date)}</td>
              <td className="py-2 text-center flex space-x-2 justify-center">
                <button
                  onClick={() => handleEditClick(newsItem)}
                  className="bg-[#cc81a1] text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNews(newsItem._id)}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-[50vw] h-auto mt-20">
            <h3 className="text-xl font-bold mb-6">{isEditMode ? "Edit" : "Add"} News</h3>
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
                  <label className="block mb-2">Contenu</label>
                  <textarea
                    value={formData.contenu}
                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
              <div>
                  <label className="block mb-2">lien</label>
                  <textarea
                    value={formData.lien}
                    onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                    className="border rounded p-2 w-full"
                  />
                </div>
              <button
                type="button"
                onClick={handleAddOrEditNews}
                className="bg-[#703a79] text-white px-4 py-2 rounded"
              >
                {isEditMode ? "Update" : "Add"} News
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

export default NewsTable;
