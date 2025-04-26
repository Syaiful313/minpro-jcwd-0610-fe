import { Dispatch, SetStateAction } from "react";

export interface EditProfileProps {
  profile: any;
  formData: {
    fullName: string;
    email: string;
    bio: string;
    profilePicture: string;
  };
  setFormData: Dispatch<
    SetStateAction<{
      fullName: string;
      email: string;
      bio: string;
      profilePicture: string;
    }>
  >;
  token: string;
}
