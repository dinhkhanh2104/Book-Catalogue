import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import Header from "./components/Header";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import User from "./pages/User/User";

import { AuthProvider } from "./contexts/authContext";
import { RouterProvider } from "react-router-dom";
import "./styles/global.css";

function App() {
  const routesArray = [
    { path: "/", element: <Home /> },
    { path: "/signin", element: <SignIn /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/user", element: <User /> },
    { path: "*", element: <NotFound /> },
  ];

  let routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      <Header />
      {routesElement}
    </AuthProvider>
  );
}

export default App;
