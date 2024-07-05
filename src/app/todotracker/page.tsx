"use client";

import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Plus } from "lucide-react";
import Nav from "@/components/Home/Navbar";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";

interface ToDoItem {
  _id: string;
  text: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function App() {
  const [toDos, setToDos] = useState<ToDoItem[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ToDoItem[]>([]);
  const [toDo, setToDo] = useState<string>("");
  const [isCompletedScreen, setIsCompletedScreen] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [edit, setEdit] = useState(false);
  const { theme } = useTheme();

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const fetchTodos = async () => {
    const user = JSON.parse(localStorage.getItem("User") || "{}");

    if (!user) {
      console.error("User details not found in local storage");
      return;
    }
    const userId = user._id;
    const userEmail = user.email;

    try {
      const { data: todos } = await axios.get(`${BASE_URL}/todo/todos`, {
        params: { userId, userEmail },
      });
      const { data: completed } = await axios.get(
        `${BASE_URL}/todo/completedtodos`,
        {
          params: { userId, userEmail },
        }
      );
      setToDos(todos);
      setCompletedTodos(completed);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [BASE_URL,fetchTodos]);

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date();
    return days[date.getDay()];
  };

  const dataAdding = async () => {
    const user = JSON.parse(localStorage.getItem("User") || "{}");

    if (!user) {
      console.error("User details not found in local storage");
      return;
    }
    const userId = user._id;
    const userEmail = user.email;

    if (toDo === "") return;
    const newToDo: ToDoItem = {
      text: toDo,
      status: false,
      userId,
      _id: "dummy",
      createdAt: new Date().toISOString(), // Current timestamp
      updatedAt: new Date().toISOString(), // Current timestamp
    };
    setToDos([newToDo, ...toDos]);
    setToDo("");

    try {
      await axios.post(`${BASE_URL}/todo/todos`, newToDo);
      toast.success("To-do added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToDoDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reducedTodos = toDos.filter((todo) => todo._id !== id);
        setToDos(reducedTodos);

        try {
          await axios.delete(`${BASE_URL}/todo/todos/${id}`);
          toast.success("To-do deleted successfully!");
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      }
    });
  };

  const handleComplete = async (id: string) => {
    const completedTodo = toDos.find((todo) => todo._id === id);
    if (completedTodo) {
      const updatedTodo = { ...completedTodo, status: true };
      setCompletedTodos([...completedTodos, updatedTodo]);

      try {
        await axios.post(`${BASE_URL}/todo/completedtodos`, updatedTodo);
        toast.success("To-do marked as completed!");
      } catch (error) {
        console.error("Error marking todo as completed:", error);
      }
    }
  };

  const handleCompletedTodoDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reducedCompletedTodos = completedTodos.filter(
          (todo) => todo._id !== id
        );
        setCompletedTodos(reducedCompletedTodos);
        try {
          await axios.delete(`${BASE_URL}/todo/completedtodos/${id}`);
          toast.success("Completed to-do deleted successfully!");
        } catch (error) {
          console.error("Error deleting completed todo:", error);
        }
      }
    });
  };

  return (
    <>
      <Nav />
      <div
        className={`app mt-10 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/10 ${
          theme === "dark" ? " text-white" : "bg-white text-black"
        }`}
      >
        <div className="subHeading mt-4">
          <h2 className="text-center text-sm sm:text-2xl">
            Whoop&apos; it&apos;s {getCurrentDay()} let&apos;s plan today 🌝☕
          </h2>
        </div>
        <div className="input flex justify-center items-center mt-3">
          <input
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            type="text"
            placeholder="🖊️ Add item..."
            className={`sm:w-80 h-8 ${
              theme === "dark"
                ? "bg-gray-700 text-white "
                : "bg-white border border-orange-500 text-black"
            } rounded-xl p-2`}
          />
          <Plus
            onClick={dataAdding}
            className={`cursor-pointer text-2xl ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          />
        </div>
        <div className="todos flex flex-col items-center mt-4">
          <div className="btn-area mb-2">
            <button
              className={`secondaryBtn px-4 py-2 rounded-lg ${
                isCompletedScreen === false && "bg-green-600"
              }`}
              onClick={() => setIsCompletedScreen(false)}
            >
              To Do
            </button>
            <button
              className={`secondaryBtn px-4 py-2 rounded-lg ml-2 ${
                isCompletedScreen === true && "bg-green-600"
              }`}
              onClick={() => setIsCompletedScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list w-full max-w-md">
            {isCompletedScreen === false &&
              toDos.map((item, index) => (
                <div
                  className={`todo-list-item flex justify-between items-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } p-2 rounded-lg mb-2 shadow-lg`}
                  key={index}
                >
                  <div>
                    {edit ? (
                      <input
                        type="text"
                        className={`w-28 ${
                          theme === "dark"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-black"
                        } rounded-md p-1`}
                        defaultValue={item.text}
                      />
                    ) : (
                      <h3 className="text-green-500 font-bold">{item.text}</h3>
                    )}
                  </div>
                  <div className="flex items-center">
                    <BsCheckLg
                      title="Completed?"
                      className="check-icon text-green-500 text-3xl ml-2 cursor-pointer"
                      onClick={() => handleComplete(item._id)}
                    />
                    <AiOutlineDelete
                      title="Delete?"
                      className="icon text-xl ml-2 cursor-pointer"
                      onClick={() => handleToDoDelete(item._id)}
                    />
                  </div>
                </div>
              ))}
            {isCompletedScreen === true &&
              completedTodos.map((item, index) => (
                <div
                  className={`todo-list-item flex justify-between items-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } p-2 rounded-lg mb-2 shadow-lg`}
                  key={index}
                >
                  <div>
                    <h3 className="text-green-500 font-bold">{item.text}</h3>
                    <p className="text-gray-400">
                      <i>Completed at: {item.updatedAt}</i>
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon text-lg ml-2 cursor-pointer"
                      onClick={() => handleCompletedTodoDelete(item._id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default App;
