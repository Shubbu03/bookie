/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Modal from "./Modal";
import {
  MdDeleteOutline,
  MdFavorite,
  MdFavoriteBorder,
  MdEdit,
} from "react-icons/md";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [editBookmark, setEditBookmark] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const viewAllBookmarks = async (e) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/user/view-bookmark",
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );
      setBookmarks(response.data.data);
    } catch (err) {
      console.log(`Error occured, try again ${err}`);
    }
  };

  const editOneBookmarkModalSettings = async (book) => {
    console.log("bookmark to open modal:::", book);
    setEditBookmark(book);
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const deleteOneBookmark = async (bookmarkId) => {
    try {
      const response = await axios({
        method: "delete",
        url: "http://localhost:3000/user/delete-bookmark",
        headers: {
          token: `${token}`,
        },
        data: {
          bookmarkId: bookmarkId,
        },
      });
      if (!response) {
        toast.error("Error deleting bookmark ,try again!!");
        return;
      }
      toast.success("Bookmark deleted successfully");
      viewAllBookmarks();
    } catch (error) {
      toast.error(`Error deleting bookmark : ${error}`);
    }
  };

  const deleteAllBookmarks = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:3000/user/delete-all-bookmark",
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );
      if (!response) {
        console.log(`not deleted`);
      }
      console.log("All bookmarks deleted", response.data);
    } catch (err) {
      console.log(`Error deleting all,try again : ${err}`);
    }
  };

  const addToFavourite = async (bookmarkId) => {
    try {
      const response = await axios.put(
        "http://localhost:3000/user/toggle-fav",
        {
          bookmarkId: bookmarkId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `${token}`,
          },
        }
      );

      if (!response) {
        toast.error("Error adding bookmark to favourites!!");
        return;
      }
      if (response.data.data.isFavourite == true) {
        toast.success(
          `${response.data.data.title} added to favourites successfully`
        );
      } else {
        toast.success(
          `${response.data.data.title} removed from favourites successfully`
        );
      }

      viewAllBookmarks();
    } catch (error) {
      toast.error(`Error adding bookmark to favourite: ${error}`);
    }
  };

  const filteredBookmarks = showFavorites
    ? bookmarks.filter((book) => book.isFavourite)
    : bookmarks;

  useEffect(() => {
    viewAllBookmarks();
  }, [token]);

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-lg font-bold">Bookmark Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Great to see you again!!
        </h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            {showFavorites ? <MdFavoriteBorder /> : <MdFavorite />}
            <span>{showFavorites ? "Show All" : "Your Favorites"}</span>
          </button>

          <div className="relative group">
            <button onClick={deleteAllBookmarks}>
              <MdDeleteOutline className="text-2xl pt-0 cursor-pointer hover:text-red-600" />
            </button>
            <span className="absolute right-0 top-full mt-2 w-40 bg-gray-700 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Delete all bookmarks
            </span>
          </div>
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <main className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-xl mb-4">
              {showFavorites
                ? "You don't have any favorite bookmarks."
                : "You don't have any bookmarks, add some now."}
            </p>
          </div>
        </main>
      ) : (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((books) => (
            <div
              key={books._id}
              className="border border-gray-300 p-5 rounded-lg shadow-lg flex flex-col justify-between"
            >
              <div className="flex items-center mb-2">
                <h3 className="text-lg flex-1">{books.title}</h3>

                <button onClick={() => addToFavourite(books._id)}>
                  {books.isFavourite ? (
                    <MdFavorite className="text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200" />
                  ) : (
                    <MdFavoriteBorder className="text-red-500 cursor-pointer hover:text-red-600 transition-colors duration-200" />
                  )}
                </button>
              </div>

              <p className="text-gray-500 mb-4">{books.url}</p>

              <div className="flex space-x-4">
                <button onClick={() => editOneBookmarkModalSettings(books)}>
                  <MdEdit className="text-gray-600 cursor-pointer hover:text-blue-500 transition-colors duration-200" />
                </button>

                <button onClick={() => deleteOneBookmark(books._id)}>
                  <MdDeleteOutline className="text-gray-600 cursor-pointer hover:text-red-600 transition-colors duration-200" />
                </button>
              </div>

              <button
                className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={() => window.open(books.url, "_blank")}
              >
                Go
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
        onClick={openModal}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="sr-only">Add Bookmark</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        viewBookmark={bookmarks}
        isEditing={isEditing}
        editBookmark={editBookmark}
        bookmarkId={editBookmark._id}
      />
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

export default Dashboard;
