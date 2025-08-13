import React, { useState, useEffect, Children } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const email = user ? user.primaryEmailAddress?.emailAddress : "";
  const image = user ? user.imageUrl : "";
  const createdAt = user ? user.createdAt : "";
  const clerkId = user ? user.id : "";


  useEffect(() => {
    fetch("http://localhost:8000/api/store-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        image,
        created_at: createdAt,
        clerkId: clerkId
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn> */}
      <div className="fixed inset-0 -z-1">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
        <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      <main className="pt-10 flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
