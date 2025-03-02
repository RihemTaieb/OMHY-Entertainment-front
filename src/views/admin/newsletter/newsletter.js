import React, { useState, useEffect } from "react";
import Card from "components/card";
import NewsletterService from "services/newsletterService";

function NewsletterTable() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const data = await NewsletterService.getAllSubscribers();
    setSubscribers(data);
  };

  const handleDeleteSubscriber = async (id) => {
    if (window.confirm("Are you sure you want to unsubscribe this email?")) {
      await NewsletterService.deleteSubscriber(id);
      fetchSubscribers(); // Refresh the list after deletion
    }
  };

  return (
    <Card extra="w-full h-full sm:overflow-auto px-6 mt-20">
      <header className="flex items-center justify-between pt-4">
        <h2 className="text-xl font-bold text-navy-700">Newsletter Subscribers</h2>
      </header>

      <table className="w-full mt-6 table-auto border-collapse">
        <thead>
          <tr className="border-b bg-gray-200">
            <th className="py-2 text-left px-4">Email</th>
            <th className="py-2 text-center px-4">Subscribed At</th>
            <th className="py-2 text-center px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <tr key={subscriber._id} className="border-b">
                <td className="py-2 text-left px-4">{subscriber.email}</td>
                <td className="py-2 text-center px-4">
                  {new Date(subscriber.subscribedAt).toLocaleDateString()}
                </td>
                <td className="py-2 text-center px-4">
                  <button
                    onClick={() => handleDeleteSubscriber(subscriber._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Unsubscribe
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No subscribers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

export default NewsletterTable;
