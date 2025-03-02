import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/newsletter`;

const NewsletterService = {
  getAllSubscribers: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      return [];
    }
  },

  deleteSubscriber: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
    }
  }
};

export default NewsletterService;
