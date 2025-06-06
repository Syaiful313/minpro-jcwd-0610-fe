"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar() {
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = data?.user;
  const isOrganizer = user?.role === "ORGANIZER";
  const isAdmin = user?.role === "ADMIN";
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    signOut();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#222831] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold text-white">
              EventNesia
            </Link>
          </div>

          <div className="hidden cursor-pointer items-center space-x-4 md:flex">
            <Link
              href="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/explores"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Explore
            </Link>
            {user?.id ? (
              <>
                <div className="relative">
                  <div
                    className="h-8 w-8 cursor-pointer rounded-full"
                    onClick={toggleDropdown}
                  >
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        src={user?.profilePicture}
                        alt={user?.fullName}
                      />
                      <AvatarFallback className="rounded-full">
                        {user?.fullName
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("") || "CN"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {isOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                      <ul>
                        <li className="hover:bg-gray-100">
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            Profile
                          </Link>
                        </li>
                        {isOrganizer && (
                          <li className="hover:bg-gray-100">
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-gray-700"
                            >
                              Dashboard
                            </Link>
                          </li>
                        )}
                        {isAdmin && (
                          <li className="hover:bg-gray-100">
                            <Link
                              href="/dashboard/admin"
                              className="block px-4 py-2 text-sm text-gray-700"
                            >
                              Dashboard
                            </Link>
                          </li>
                        )}
                        <li className="border-t border-gray-100 hover:bg-gray-100">
                          <button
                            onClick={logout}
                            className="block w-full px-4 py-2 text-left text-sm text-red-600"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-[#393E46] px-4 py-2 text-sm font-medium text-white"
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
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

      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-center text-base font-medium text-gray-300 hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/browsers"
            className="block rounded-md px-3 py-2 text-center text-base font-medium text-gray-300 hover:text-white"
          >
            Explore
          </Link>
          {user?.id ? (
            <>
              <Link
                href="/profile"
                className="block rounded-md px-3 py-2 text-center text-base font-medium text-gray-300 hover:text-white"
              >
                Profile
              </Link>
              {isOrganizer && (
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-center text-base font-medium text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="block w-full rounded-md px-3 py-2 text-center text-base font-medium text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block rounded-md bg-blue-500 px-3 py-2 text-center text-base font-medium text-white hover:bg-blue-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
