"use client";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";

const ProfileSection = () => {
  return (
    <div className="flex flex-col gap-6">
      <EditProfile />
      <ChangePassword />
    </div>
  );
};

export default ProfileSection;
