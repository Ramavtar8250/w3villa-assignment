import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // To redirect the user after logout
import TaskForm from "./TaskForm";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify for error notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // For redirecting after logout

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      toast.error("Please log in to view tasks.");
      navigate("/login"); // Redirect to login if no token
    }
  }, [token, navigate]);

  const fetchTasks = async () => {
    if (!token) {
      toast.error("No token found, please log in.");
      return;
    }

    try {
      const res = await fetch("https://w3villa-assignment.onrender.com/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Unauthorized access. Please log in.");
      }

      const data = await res.json();
      setTasks(data);
    } catch (error) {
      toast.error(error.message);
      setTasks([]); // Ensure tasks is an array to avoid map error
    }
  };

  const deleteTask = async (id) => {
    if (!token) {
      toast.error("No token found, please log in.");
      return;
    }

    try {
      const res = await fetch(`https://w3villa-assignment.onrender.com/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete task.");
      }

      fetchTasks(); // Refresh the task list
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleTaskAdded = (task) => {
    toast.success(`Task "${task.title}" created successfully!`);
  };

  const handleTaskEdited = (task) => {
    toast.success(`Task "${task.title}" updated successfully!`);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6">
      {/* Toast Container */}
      <ToastContainer />

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
        <h1 className="text-4xl text-center font-semibold text-gray-800 dark:text-white mb-8">
          Task Manager
        </h1>

        <div className="flex justify-between mb-8">
  {token && (
    <button
      onClick={handleLogout}
      className="px-6 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none transition duration-300 transform hover:scale-105 cursor-pointer"
    >
      Logout
    </button>
  )}

  <button
    onClick={() => setShowForm(true)}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition duration-300 transform hover:scale-105 cursor-pointer"
  >
    Create New Task
  </button>
</div>

        
        

        {showForm && (
          <TaskForm
            task={selectedTask}
            setShowForm={setShowForm}
            fetchTasks={fetchTasks}
            handleTaskAdded={handleTaskAdded}
            handleTaskEdited={handleTaskEdited}
          />
        )}

        <div className="overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-lg">
          <ul className="space-y-8">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <li
                  key={task._id}
                  className="flex justify-between items-center bg-white dark:bg-gray-600 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                >
                  <div className="flex-1">
                    <h2 className="text-2xl text-gray-800 dark:text-white font-semibold">{task.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{task.description}</p>
                  </div>
                  <div className="flex items-center space-x-8">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-500 dark:text-blue-400 hover:underline focus:outline-none transition duration-300 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 dark:text-red-400 hover:underline focus:outline-none transition duration-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="bg-white dark:bg-gray-600 p-8 rounded-lg text-center text-gray-600 dark:text-gray-300">
                No tasks available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
