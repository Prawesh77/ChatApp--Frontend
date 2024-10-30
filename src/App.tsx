import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Chat from "./components/chat/Chat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('accessToken'));

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/chat" />}
        />    
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;