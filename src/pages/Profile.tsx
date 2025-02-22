import React from "react";
import ProfileContent from "../components/profile/ProfileContent";
import Navbar from "../components/navbar/Navbar";

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
