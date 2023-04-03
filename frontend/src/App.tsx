import { Route, Routes } from "react-router-dom";
import AuthenticationGuard from "./AuthenticationGuard";
import HomePage from "./pages/HomePage";
import NotExistingPage from "./pages/NotExistingPage";
import EditPostPage from "./pages/PostPages/EditPostPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import NewPostPage from "./pages/PostPages/NewPostPage";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import { ToastContext } from "./ToastContext";
import "react-toastify/dist/ReactToastify.css";
import CreditsPage from "./pages/CreditsPage";

const toastConfig: ToastOptions = {
  toastId: "new post",
  position: "top-center",
  autoClose: 30000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

function App() {
  type ToastType = "info" | "success" | "error";
  const createToast = (type: ToastType, message: string) => {
    if (type === "success") {
      toast.success(message, toastConfig);
    } else if (type === "error") {
      toast.error(message, toastConfig);
    } else {
      toast.info(message, toastConfig);
    }
  };

  return (
    <ToastContext.Provider value={{ createToast }}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/credits" element={<CreditsPage />} />
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
    </ToastContext.Provider>
  );
}

export default App;
