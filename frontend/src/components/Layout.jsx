import React, { useState, useEffect} from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "sonner"
import { URL } from "../../constant";

const Layout = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const email = user ? user.primaryEmailAddress?.emailAddress : "";
  const image = user ? user.imageUrl : "";
  const clerkId = user ? user.id : "";

    useEffect(() => {
      if (!isLoaded || !user) return; 
      fetch(`${URL}/store-user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          image,
          created_at: new Date().toISOString(),
          clerkId: clerkId
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }, [user]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="fixed inset-0 -z-1">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
        <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      <main className="pt-10 flex-grow">{children} <Toaster/></main>
      <Footer />
    </div>
  );
};

export default Layout;
