import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../context/AvatarContext";

const ProfileContent: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const navigate = useNavigate();
  const { avatarUrl, setAvatarUrl } = useAvatar();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setAvatarUrl(newAvatarUrl);
        localStorage.setItem("avatar", newAvatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveProfile = () => {
    if (username) {
      localStorage.setItem("username", username);
      setIsSaved(true);
    }
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Profile Settings
      </h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">No avatar</span>
          )}
        </div>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-3 text-sm text-gray-700 cursor-pointer border rounded-md py-2 px-4 bg-blue-500 text-white hover:bg-blue-600"
        />
      </div>

      {/* Username */}
      <div className="mb-6">
        <label
          htmlFor="username"
          className="block text-gray-700 font-medium mb-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your username"
        />
      </div>

      {/* Save */}
      <button
        onClick={isSaved ? handleNavigateHome : handleSaveProfile}
        className="w-full py-3 text-lg font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        {isSaved ? "Go to Home" : "Save Profile"}
      </button>
    </div>
  );
};

export default ProfileContent;
