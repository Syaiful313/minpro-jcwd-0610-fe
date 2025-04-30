"use client";
import { Skeleton } from "@/components/ui/skeleton"; 
import useGetProfile from "@/hooks/api/profile/useGetProfile";
import { useToken } from "@/hooks/useToken";
import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";

const ProfileSection = () => {
  const token = useToken();
  const { data: profile, isLoading } = useGetProfile(token as string);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        profilePicture: profile.profilePicture || "",
      });
    }
  }, [profile]);

  if (isLoading || !token) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-24 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <EditProfile
        profile={profile}
        formData={formData}
        setFormData={setFormData}
        token={token}
      />
      <ChangePassword token={token} />
    </div>
  );
};

export default ProfileSection;
