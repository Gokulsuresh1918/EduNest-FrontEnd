"use client";
import {
  BellIcon,
  BellRing,
  BookOpen,
  GraduationCap,
  ListTodo,
  PresentationIcon,
  VideoIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SideBarJoin } from "./SideBarRightJoin";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const CLIENT = process.env.NEXT_PUBLIC_CLIENT_URL;

const socket = io(`${BASE_URL}`);

const Sidenav = () => {
  const Router = useRouter();
  const router = useRouter();
  const params = useParams();
  const [notificationCount, setNotificationCount] = useState(0);

  let classCode: string;

  if (Array.isArray(params.classCode)) {
    classCode = params.classCode.join("");
  } else {
    classCode = params.classCode;
  }

  const [side, setSide] = useState(false);
  let [notification, setNotification] = useState<string>("");

  useEffect(() => {
    socket.on("callStarted", (data) => {
      setNotification(data.message);
    });

    return () => {
      socket.off("callStarted");
    };
  }, []);
  const handleClick = () => {
    router.push("/");
  };
  const handlewhiteBoard = () => {
    router.push(`/whiteBoard`);
  };
  const handleTodo = () => {
    router.push(`/todotracker`);
  };
  const handleQuiz = () => {
    router.push(`https://quizhub-gokul.vercel.app/`);
  };
  const handleAssignTask = () => {
    setSide(!side);
    setNotificationCount(0);

  };
  const handleVideo = () => {
    notification
    ? Router.push(`${CLIENT}/room/${classCode}`)
    : toast("Teacher not started a call", {
      position: "bottom-left",
      autoClose: 4000,
    });
    notification=''
  };

  useEffect(() => {
    // Listen for the "assigned" event
    socket.on("assigned", (data) => {
      // console.log("data", data);
      // Update the notification count
      setNotificationCount((prevCount) => prevCount + 1);
    });

    // Clean up the socket event listener on component unmount
    return () => {
      socket.off("assigned");
    };
  }, []);

  return (
    <div className="sm:w-56 hidden h-screen bg-[#f1eff3] sm:block flex-row">
      {side && <SideBarJoin classCode={classCode} />}
      <div
        onClick={handleClick}
        className="flex flex-col space-x-2 justify-center cursor-pointer items-center pt-5 w-[80%]"
      >
        <h1 className="font-bold text-4xl text-cyan-800">EduNest</h1>
        <h1 className="text-xs text-cyan-800">👑 Upgrade to Pro 👑</h1>
        <hr className="mt-3" />
      </div>
      <div className="mt-5">
        <div
          onClick={handleAssignTask}
          className="group flex gap-3 mt-2 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
        >
          <BookOpen className="group-hover:animate-bounce" />
          <h2>Assigned Task</h2>
          {notificationCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
        <div
          onClick={handlewhiteBoard}
          className="group flex gap-3 mt-2 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
        >
          <PresentationIcon className="group-hover:animate-bounce" />
          <h2>WhiteBoard</h2>
        </div>
        <div
          onClick={handleTodo}
          className="group flex gap-3 mt-2 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
        >
          <ListTodo className="group-hover:animate-bounce" />
          <h2>Todo</h2>
        </div>
        <div
          onClick={handleQuiz}
          className="group flex gap-3 mt-2 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3] hover:text-white rounded-md transition-all ease-in-out duration-200"
        >
          <GraduationCap className="group-hover:animate-bounce" />
          <h2>Quiz</h2>
        </div>
        <div
          onClick={handleVideo}
          className={`group flex gap-3 mt-2 p-3 text-[18px] items-center text-gray-500 cursor-pointer hover:bg-[#624DE3]  hover:text-white rounded-md transition-all ease-in-out duration-200 relative`}
        >
          {/* Overlay the BellIcon on top of the VideoIcon when a notification is pending */}
          {notification ? (
            <BellRing className=" text-red-700  animate-pulse" />
          ) : (
            <VideoIcon className="group-hover:animate-bounce" />
          )}
          <h2 className={notification && "text-red-700 animate-pulse"}>
            {notification ? " Join Class " : "No Class"}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
