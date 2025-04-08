import { Routes, Route } from "react-router-dom";
import { routes } from "./constants/routes";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import EmailVerification from "./pages/EmailVerification";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Header />
      <div className="mt-4 container px-3 m-auto">
        <Routes>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.profile} element={<Profile />} />
          <Route path={routes.signUp} element={<SignUp />} />
          <Route
            path={routes.emailVerification}
            element={<EmailVerification />}
          />
          <Route path={routes.signIn} element={<SignIn />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
