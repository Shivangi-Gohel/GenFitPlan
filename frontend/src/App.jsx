// src/App.js
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GenerateProgram from "./pages/GenerateProgram";
import Profile from "./pages/Profile";
import {
  ClerkLoaded,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import WorkoutHistory from "./pages/WorkoutHistory";
import YouTubeSearch from "./pages/YouTubeSearch";
import AIChatAssistant from "./pages/AIChatAssistant";
import ScrollToTop from "./components/ScrollToTop";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
      <ScrollToTop />
      <Home />
      </>
    ),
  },
  {
    path: "/layout",
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
  },
  {
    path: "/generate-program",
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <GenerateProgram />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in/*",
    element: (
      <>
        <ScrollToTop />
        <SignInPage />
      </>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <>
        <ScrollToTop />
        <SignUpPage />
      </>
    ),
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
    path: "/workout-history",
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <WorkoutHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: "/youtube-search",
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <YouTubeSearch />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chatbot",
    element: (
      <ProtectedRoute>
        <ScrollToTop />
        <AIChatAssistant />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <>
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
