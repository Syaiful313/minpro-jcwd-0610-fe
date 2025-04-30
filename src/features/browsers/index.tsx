import React from "react";
import Footer from "@/components/Footer";
import BrowsersList from "./components/Browsers";
import Navbar from "@/components/Navbar";

const BrowsersPage = () => {
  return (
    <>
      <Navbar />
      <BrowsersList />
      <Footer />
    </>
  );
};

export default BrowsersPage;
