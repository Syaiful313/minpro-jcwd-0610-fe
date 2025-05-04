"use client";
import { fromUnixTime, isAfter } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { signOut, useSession } from "next-auth/react";
import { FC, PropsWithChildren, useEffect } from "react";

const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const session = useSession();

  useEffect(() => {
    if (!session || !session.data) {
      return;
    }

    const checkTokenValidity = () => {
      const accessToken = session.data?.user?.token;

      if (!accessToken) {
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);

        if (!decodedToken.exp) {
          console.error("Token doesn't have an expiration");
          return;
        }

        const tokenExpiry = fromUnixTime(decodedToken.exp);

        if (isAfter(new Date(), tokenExpiry)) {
          console.log("Token expired, signing out");
          signOut({ redirectTo: "/" });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        signOut();
      }
    };

    checkTokenValidity();

    const interval = setInterval(checkTokenValidity, 15000);

    return () => clearInterval(interval);
  }, [session]);

  return <>{children}</>;
};

export default TokenProvider;
