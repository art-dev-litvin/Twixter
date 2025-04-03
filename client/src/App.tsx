import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./services/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { routes } from "./constants/routes";

function App() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Twitter Clone</h1>
      <Routes>
        <Route
          path={routes.home}
          element={user ? <Home /> : <Navigate to="/signin" />}
        />
        <Route path={routes.signUp} element={<SignUp />} />
        <Route path={routes.signIn} element={<SignIn />} />
      </Routes>
    </div>
  );
}

export default App;
