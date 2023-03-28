import { Route, Routes } from "react-router-dom";
import AuthenticationGuard from "./AuthenticationGuard";
import HomePage from "./pages/HomePage";
import NotExistingPage from "./pages/NotExistingPage";
import EditPostPage from "./pages/EditPostPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import NewPostPage from "./pages/NewPostPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/credits" element={<h1>CREDITS</h1>} />
      <Route
        path="/profile/update"
        element={<AuthenticationGuard component={UpdateProfilePage} />}
      />
      <Route
        path="/posts/new"
        element={<AuthenticationGuard component={NewPostPage} />}
      />
      <Route
        path="/posts/:id/edit"
        element={<AuthenticationGuard component={EditPostPage} />}
      />
      <Route path="*" element={<NotExistingPage />} />
    </Routes>
  );
}

export default App;
