import React from "react";
import Footer from "@/components/Footer";
import BrowsersList from "./components/Browsers";
import Navbar from "@/components/Navbar";

const ExplorePage = () => {
  return (
    <>
      <Navbar />
      <BrowsersList />
      <Footer />
    </>
  );
};

export default ExplorePage;
