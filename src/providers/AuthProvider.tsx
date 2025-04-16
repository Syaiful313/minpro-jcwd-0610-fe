"use client";
import { loginAction } from "@/redux/slices/userSlice";
import { PropsWithChildren, useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const data = localStorage.getItem("token");

    if (data) {
      dispatch(loginAction(JSON.parse(data)));
    }
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
