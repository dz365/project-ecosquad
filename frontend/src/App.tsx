import { Route, Routes } from "react-router-dom";
import AuthenticationGuard from "./AuthenticationGuard";
import CallbackPage from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import NotExistingPage from "./pages/NotExistingPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/credits" element={<h1>CREDITS</h1>} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotExistingPage />} />
    </Routes>
  );
}

export default App;
