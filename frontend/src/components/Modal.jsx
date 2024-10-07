/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Modal({
  isOpen,
  onClose,
  viewBookmark,
  isEditing,
  editBookmark,
  bookmarkId,
}) {
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
  });

  const [editedBookmark, setEditedBookmark] = useState({
    title: "",
    url: "",
  });

  useEffect(() => {
    if (isEditing && editBookmark) {
      setEditedBookmark(editBookmark);
    }
  }, [isEditing, editBookmark]);

  if (!isOpen) return null;
  let token = localStorage.getItem("token");

  const addBookmark = async (e) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/add-bookmark",
        newBookmark,
        {
          headers: {
            token: `${token}`,
          },
        }
      );
      if (!response) {
        toast.error("Error adding new bookmark");
        return;
      }
      setNewBookmark({
        title: "",
        url: "",
      });
      toast.success("Bookmark added successfully");
      setTimeout(() => {
        onClose();
        viewBookmark();
      }, 1000);
    } catch (err) {
      toast.error("Error occured, try again");
    }
  };

  const editOneBookmark = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3000/user/edit-bookmark",
        {
          id: bookmarkId,
          title: editedBookmark.title,
          url: editedBookmark.url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );

      if (!response) {
        toast.error("Error updating bookmark");
        return;
      }
      toast.success("Bookmark updated successfully");
      setTimeout(() => {
        onClose();
        viewBookmark();
      }, 1000);

      console.log("edited bookamrk:::", editedBookmark);
    } catch (error) {
      toast.error(`Error editing bookmark: ${error}`);
    }
  };

  return (
    <>
      {isEditing ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Bookmark</h2>
            <p className="mb-4">Edit the details of your bookmark here.</p>
            <div className="mb-4">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={editedBookmark.title}
                onChange={(e) =>
                  setEditedBookmark({
                    ...editedBookmark,
                    title: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">URL</label>
              <input
                type="text"
                value={editedBookmark.url}
                onChange={(e) =>
                  setEditedBookmark({ ...editedBookmark, url: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={editOneBookmark}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Bookmark</h2>
            <p className="mb-4">Enter the details of your new bookmark here.</p>
            <div className="mb-4">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, title: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">URL</label>
              <input
                type="text"
                value={newBookmark.url}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, url: e.target.value })
                }
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={addBookmark}
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default Modal;
