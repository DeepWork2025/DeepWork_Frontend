import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
import Home from "./pages/Home";
import Banner from "./pages/Banner";
import ProfilePage from "./pages/Profile";
import { AvatarProvider } from "./context/AvatarContext";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store } from "./store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import PrivateRoute from "./auth/PrivateRoute";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AvatarProvider>
          <DndProvider backend={HTML5Backend}>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/register"
                  // element={<Register onRegister={handleRegister} />}
                />
                <Route
                  path="/login"
                  // element={<Login onLogin={handleLogin} />}
                />
                {/* <Route element={<PrivateRoute />}> */}
                <Route path="/banner" element={<Banner />} />
                {/* </Route> */}
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Router>
          </DndProvider>
        </AvatarProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
