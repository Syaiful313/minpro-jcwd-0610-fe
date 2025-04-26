import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useUpdateProfile from "@/hooks/api/profile/useUpdateProfile";
import { EditProfileProps } from "@/types/profile";
import { getInitials } from "@/utils/stringUtils";
import { showToast } from "@/utils/toastUtils";
import { useFormik } from "formik";
import { Camera } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { EditProfileSchema } from "../schemas";

const EditProfile = ({ profile}: EditProfileProps) => {
  const updateProfile = useUpdateProfile();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const profileFormik = useFormik({
    initialValues: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      bio: profile?.bio || "",
      profilePicture: profile?.profilePicture || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      const changedData: {
        fullName?: string;
        bio?: string;
        profilePictureFile?: File;
      } = {};

      if (values.fullName !== profile?.fullName)
        changedData.fullName = values.fullName;
      if (values.bio !== profile?.bio) changedData.bio = values.bio;
      if (selectedFile) changedData.profilePictureFile = selectedFile;

      if (Object.keys(changedData).length === 0) {
        showToast.info("No changes to save");
        return;
      }

      try {
        await updateProfile.mutateAsync(changedData);
        setSelectedFile(null);
        showToast.success("Profile updated successfully");
      } catch {
        showToast.error("Failed to update profile");
      }
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setPreviewImage(event.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <form onSubmit={profileFormik.handleSubmit}>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  className="group h-32 w-32 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage
                    src={
                      previewImage ||
                      profileFormik.values.profilePicture ||
                      "/placeholder.svg?height=128&width=128"
                    }
                    alt="Profile picture"
                  />
                  <AvatarFallback>
                    {getInitials(profileFormik.values.fullName)}
                  </AvatarFallback>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="text-white" size={32} />
                  </div>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="profile-picture-upload"
                />
              </div>
              <p className="text-muted-foreground text-center text-sm">
                Click on the avatar to upload a new image
              </p>
              {selectedFile && (
                <p className="text-muted-foreground text-center text-sm">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...profileFormik.getFieldProps("fullName")}
                />
                {profileFormik.touched.fullName &&
                profileFormik.errors.fullName ? (
                  <p className="text-xs text-red-500">
                    {typeof profileFormik.errors.fullName === "string" &&
                      profileFormik.errors.fullName}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileFormik.values.email}
                  disabled
                />
                <p className="text-muted-foreground text-xs">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...profileFormik.getFieldProps("bio")}
              placeholder="Tell us about yourself"
              rows={4}
            />
            {profileFormik.touched.bio && profileFormik.errors.bio ? (
              <p className="text-xs text-red-500">
                {typeof profileFormik.errors.bio === "string" &&
                  profileFormik.errors.bio}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                A brief description about yourself
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={updateProfile.isPending || !profileFormik.isValid}
          >
            {updateProfile.isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditProfile;
