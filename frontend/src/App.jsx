import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <Router>
      <div className="h-screen w-screen dark:bg-gray-900">
        <Routes>
          <Route
            path="/"
            element={token ? <TaskList /> : <Login setToken={setToken} />}
          />
          <Route
            path="/login"
            element={<Login setToken={setToken} />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/tasks"
            element={token ? <TaskList /> : <Login setToken={setToken} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
