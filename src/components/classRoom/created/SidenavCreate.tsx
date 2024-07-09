"use client";
import {
  BookAIcon,
  BookOpen,
  GraduationCap,
  ListTodo,
  Mail,
  PresentationIcon,
  VideoIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import AddStudent from "../../Modal/AddStudent";
import AddTeacher from "../../Modal/AddTeacher";
import AssignTask from "../../Modal/AssignTask";
import BulkEmail from "../../Modal/BulkEmail";
import VideoCallConfirm from "../../Modal/videoCallConfirm";
import Swal from "sweetalert2";

const Sidenav = () => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [task, setTask] = useState(false);
  const [bulkemail, setbulkemail] = useState(false);
  const [video, setVideo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { classCode } = useParams();

  const handleClick = () => {
    router.push("/");
  };
  const handleAssignTask = () => {
    setTask(!task);
    setMenuOpen(false);
  };
  const handleAddStudent = () => {
    setOpen(!isOpen);
    setMenuOpen(false);
  };
  const handleAddTeacher = () => {
    setTeacher(!teacher);
    setMenuOpen(false);
  };
  const handleBulkEmail = () => {
    setbulkemail(!bulkemail);
    setMenuOpen(false);
  };
  const handleTodo = () => {
  router.push('/todotracker')
  };

  const handleQuiz = () => {
    Swal.fire({
      title: "Confirm changing site!!",
      text: " Quiz App is not completed ,so we are about to be redirected to our Partner quiz app.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        window.open("https://quizhub-gokul.vercel.app/", "_black");
        setMenuOpen(false);
      }
    });
  };
  const handleStartClass = () => {
    setVideo(!video);
    setMenuOpen(false);
  };
  const handlewhiteBoard = () => {
    router.push(`/whiteBoard`);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <button
        onClick={toggleMenu}
        className={`text-3xl ${
          menuOpen ? "sm:block" : "sm:hidden"
        } text-cyan-800`}
      >
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {menuOpen && (
        <>
        <div
          onClick={handleClick}
          className="flex flex-col justify-center cursor-pointer items-center w-full"
        >
          <h1 className="font-bold text-2xl text-cyan-800">EduNest</h1>
          <h1 className="text-xs text-cyan-800">👑 Upgrade to Pro 👑</h1>
          <hr className="mt-2"></hr>
        </div>
        <div className="sm:hidden flex flex-col bg-[#f1eff3] p-4">
          <div
            onClick={handleAssignTask}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <BookOpen className="group-hover:animate-bounce h-4 w-4" />
            <h2>Assign Task</h2>
          </div>
          <div
            onClick={handleAddStudent}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <BookAIcon className="group-hover:animate-bounce h-4 w-4" />
            <h2>Add Student</h2>
          </div>
          <div
            onClick={handleAddTeacher}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <FaChalkboardTeacher className="group-hover:animate-bounce h-4 w-4" />
            <h2>Add Teacher</h2>
          </div>
          <div
            onClick={handleBulkEmail}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <Mail className="group-hover:animate-bounce h-4 w-4" />
            <h2>Bulk Email</h2>
          </div>
          <div
            onClick={handleTodo}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <ListTodo className="group-hover:animate-bounce h-4 w-4" />
            <h2>Todo</h2>
          </div>
          <div
            onClick={handleQuiz}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <GraduationCap className="group-hover:animate-bounce h-4 w-4" />
            <h2>Quiz</h2>
          </div>
          <div
            onClick={handlewhiteBoard}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <GraduationCap className="group-hover:animate-bounce h-4 w-4" />
            <h2>WhiteBoard</h2>
          </div>
          <div
            onClick={handleStartClass}
            className="group flex gap-3 px-3 py-3 text-[15px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <VideoIcon className="group-hover:animate-bounce h-4 w-4" />
            <h2>Start Class</h2>
          </div>
        </div>
      </>
      
      )}
      <div className="sm:w-52 hidden h-screen bg-[#f1eff3] sm:block flex-row">
        {isOpen && createPortal(<AddStudent />, document.body)}
        {teacher && createPortal(<AddTeacher />, document.body)}
        {task && createPortal(<AssignTask />, document.body)}
        {bulkemail && createPortal(<BulkEmail />, document.body)}
        {video &&
          createPortal(
            <VideoCallConfirm params={{ classCode: classCode as string }} />,
            document.body
          )}
        <div
          onClick={handleClick}
          className="flex flex-col space-x-2 justify-center cursor-pointer items-center pt-5 w-[80%]"
        >
          <h1 className="font-bold text-4xl text-cyan-800">EduNest</h1>
          <h1 className="text-xs text-cyan-800">👑 Upgrade to Pro 👑</h1>
          <hr className="mt-3"></hr>
        </div>
        <div className="mt-1">
          <div
            onClick={handleAssignTask}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <BookOpen className="group-hover:animate-bounce" />
            <h2>Assign Task</h2>
          </div>
          <div
            onClick={handleAddStudent}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <BookAIcon className="group-hover:animate-bounce" />
            <h2>Add Student</h2>
          </div>
          <div
            onClick={handleAddTeacher}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <FaChalkboardTeacher className="group-hover:animate-bounce" />
            <h2>Add Teacher</h2>
          </div>
          <div
            onClick={handleBulkEmail}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <Mail className="group-hover:animate-bounce" />
            <h2>Direct Email</h2>
          </div>

          <div
            onClick={handlewhiteBoard}
            className="group flex gap-3 mt-1 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <PresentationIcon className="group-hover:animate-bounce" />
            <h2>WhiteBoard</h2>
          </div>
          <div
            onClick={handleStartClass}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <VideoIcon className="group-hover:animate-bounce" />
            <h2>Start Class</h2>
          </div>
          <div
            onClick={handleTodo}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <ListTodo className="group-hover:animate-bounce" />
            <h2>Todo</h2>
          </div>
          <div
            onClick={handleQuiz}
            className="group flex gap-3  p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
          >
            <GraduationCap className="group-hover:animate-bounce" />
            <h2>Quiz</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;