import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import User from "./pages/User/User";
import { AuthProvider } from "./contexts/authContext";
import { useRoutes, BrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoot";
import "./styles/global.css";

function AppRoutes() {
  const routesArray = [
    { path: "/", element: <Home /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    {
      path: "/user",
      element: (
        <PrivateRoute>
          <User />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
  ];

  return useRoutes(routesArray);
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
