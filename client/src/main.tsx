import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth/Auth.provider.tsx";
import App from "./App.tsx";
import "./index.css";
import { PostsUpdatesProvider } from "./contexts/postsUpdates/postsUpdates.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <PostsUpdatesProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PostsUpdatesProvider>
  </BrowserRouter>
);
