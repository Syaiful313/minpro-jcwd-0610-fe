"use client";
import { useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router =useRouter()
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(logoutAction());
    router.push("/")
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Event
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden items-center space-x-4 md:flex cursor-pointer">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Home
            </Link>
            {user.id ? (
              <>
                <Link
                  href="/profile"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white "
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
          >
            Home
          </Link>
          {user.id ? (
            <>
              <Link
                href="/profile"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="block w-full bg-blue-500 rounded-md px-3 py-2 text-left text-base font-medium text-gray-300 hover:text-white"
              >
                Logout
              </button>
              <span className="block px-3 py-2 text-base font-medium text-gray-300">
                Hello, {user.fullName}
              </span>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="block rounded-md bg-blue-500 px-3 py-2 text-base font-medium text-white hover:bg-blue-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
