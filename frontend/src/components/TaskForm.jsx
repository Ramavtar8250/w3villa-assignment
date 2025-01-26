import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const TaskForm = ({ task, setShowForm, fetchTasks }) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = task ? "PUT" : "POST";
    const url = task
      ? `http://localhost:5000/api/tasks/${task._id}`
      : "http://localhost:5000/api/tasks";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        fetchTasks();
        setShowForm(false);
        toast.success(`${task ? "Task updated" : "Task created"} successfully!`);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        {task ? "Edit Task" : "Create Task"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-between items-center mb-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition duration-300"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="text-red-500 hover:underline focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
