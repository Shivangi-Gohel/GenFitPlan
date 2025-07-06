import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>; // or a spinner

  return isSignedIn ? children : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
