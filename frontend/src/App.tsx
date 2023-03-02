import { Route, Routes } from "react-router-dom";
import AuthenticationGuard from "./AuthenticationGuard";
import CallbackPage from "./pages/CallbackPage";
import NotExistingPage from "./pages/NotExistingPage";
import PageLayout from "./pages/PageLayout";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
          </PageLayout>
        }
      />
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
