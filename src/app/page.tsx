"use client";
import { useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
  };
  return (
    <>
      <h1>Hello ,{user.fullName}</h1>
      {!user.id && <Link href="/auth/login">Sign in</Link>}
      {!!user.id && <button onClick={logout}>Logout</button>}
    </>
  );
}
