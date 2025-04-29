import React from "react";
import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import BrowsersList from "./components/Browsers";

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
