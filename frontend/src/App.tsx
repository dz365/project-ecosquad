import { Route, Routes } from "react-router-dom";
import AuthenticationGuard from "./AuthenticationGuard";
import CallbackPage from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import NotExistingPage from "./pages/NotExistingPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/credits" element={<h1>CREDITS</h1>} />
      <Route
        path="/updateprofile"
        element={<AuthenticationGuard component={UpdateProfilePage} />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotExistingPage />} />
    </Routes>
  );
}

export default App;
