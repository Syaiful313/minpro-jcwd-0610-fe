"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormik } from "formik";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import useGetProfile from "@/hooks/api/profile/useGetProfile";
import useUpdateProfile from "@/hooks/api/profile/useUpdateProfile";
import { EditProfileSchema } from "../schemas";
import { getInitials } from "@/utils/stringUtils";

const EditProfile = () => {
  const { data: profile, isPending: isPendingGet } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const [isProfilePictureRemoved, setIsProfilePictureRemoved] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      bio: "",
      profilePicture: null,
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values) => {
      const changedData: {
        fullName?: string;
        bio?: string;
        profilePictureFile?: File | null;
        removeProfilePicture?: boolean;
      } = {};

      if (values.fullName !== profile?.fullName) {
        changedData.fullName = values.fullName;
      }
      if (values.bio !== profile?.bio) {
        changedData.bio = values.bio;
      }

      if (isProfilePictureRemoved) {
        changedData.removeProfilePicture = true;
      } else if (values.profilePicture) {
        changedData.profilePictureFile = values.profilePicture;
      }

      if (Object.keys(changedData).length === 0) {
        return;
      }

      try {
        await updateProfile.mutateAsync(changedData);
        if (isProfilePictureRemoved) {
          setIsProfilePictureRemoved(false);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (profile) {
      formik.setValues({
        fullName: profile.fullName || "",
        email: profile.email || "",
        bio: profile.bio || "",
        profilePicture: null,
      });
      setSelectedImage(profile.profilePicture || "");
      setIsProfilePictureRemoved(false);
    }
  }, [profile]);

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      const file = files[0];
      formik.setFieldValue("profilePicture", file);
      setSelectedImage(URL.createObjectURL(file));
      setIsProfilePictureRemoved(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    formik.setFieldValue("profilePicture", null);
    setSelectedImage("");
    setIsProfilePictureRemoved(true);
    if (profilePictureRef.current) {
      profilePictureRef.current.value = "";
    }
  };

  if (isPendingGet) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p>Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col p-4">
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="profilePicture" className="text-base">
                Foto Profil
              </Label>
              <div className="flex items-center space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Avatar className="h-28 w-28 cursor-pointer md:h-36 md:w-36">
                      {selectedImage && !isProfilePictureRemoved ? (
                        <AvatarImage
                          src={selectedImage}
                          alt="Profile picture"
                        />
                      ) : (
                        <AvatarFallback>
                          {getInitials(formik.values.fullName)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="mx-auto max-w-md space-y-1.5 rounded-lg p-4 shadow-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Profile Picture
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Change or remove your profile picture here.
                        <br />
                        (Maximum size 1MB)
                      </DialogDescription>
                    </DialogHeader>
                    {selectedImage && !isProfilePictureRemoved ? (
                      <div>
                        <div className="relative mx-auto aspect-square w-full">
                          <Image
                            src={selectedImage}
                            alt="Profile Preview"
                            fill
                            priority
                            sizes="70%"
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex justify-center space-x-4 mt-4">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemoveProfilePicture}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No profile picture selected</p>
                      </div>
                    )}
                    <Input
                      ref={profilePictureRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="mx-auto max-w-xs"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Click to change
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-xs text-red-500">{formik.errors.fullName}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="bio" className="text-base">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself"
              rows={4}
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bio && formik.errors.bio ? (
              <p className="text-xs text-red-500">{formik.errors.bio}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                A brief description about yourself
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="md:my-3"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;