// src/App.js
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GenerateProgram from "./components/GenerateProgram";
import Profile from "./components/Profile";
import {
  ClerkLoaded,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
import Home from "./components/Home";
import WeightProgressChart from "./components/WeightProgressChart";
import DailyWorkoutTracker from "./components/DailyWorkoutTracker";
// import Ex from "./components/Ex";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <Home />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/layout",
    element: <Layout />,
  },
  {
    path: "/generate-program",
    element: (
      <ProtectedRoute>
        <GenerateProgram />
      </ProtectedRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in/*",
    element: <SignInPage />,
  },
  {
    path: "/sign-up/*",
    element: <SignUpPage />,
  },
  {
    path: "/sign-in/sso-callback",
    element: (
      <ClerkLoaded>
          <RedirectToSignIn />
      </ClerkLoaded>
    ) 
  },
  {
    path: "/weight",
    element: (
      <ProtectedRoute>
        <WeightProgressChart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/track",
    element: (
      <ProtectedRoute>
        <DailyWorkoutTracker/>
      </ProtectedRoute>
    ),
  }
]);

function App() {
  return (
    <>
      {/* <header>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header> */}

      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
