import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Ui/button";
import { Skeleton } from "@/components/Ui/skeleton";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Ui/dialog";
import { Input } from "@/components/Ui/input";
import { FaCopy, FaShareAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useEdgeStore } from "../../lib/edgestore";
import { userStore, classroomStore } from "../../../globalStore/store";
import { motion } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export function CreateClass(status: any) {
  const router = useRouter();
  const [title, setTitle] = useState("title");
  const [description, setDescription] = useState("Description");
  const [code, setCode] = useState("");
  const [teacher, setTeacher] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { edgestore } = useEdgeStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = userStore((state) => state.user);
  const classRoom = classroomStore((state) => state.classrooms);
  const setUser = userStore((state) => state.setUser);
  const createClassRoom = classroomStore((state) => state.createClassroom);
  const { theme, setTheme } = useTheme();

  // Safely access localStorage only in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      let userData = localStorage.getItem("UserZustand");
      if (userData) {
        let parsedData = JSON.parse(userData);
        let userId = parsedData?.state?.user?._id;
        // console.log('this is parsced data',userId);
        setOwnerId(userId);
      }
    }
  }, []);

  useEffect(() => {
    let otpValue = Math.floor(Math.random() * 900000) + 100000;
    // Ensure the OTP starts with a non-zero digit
    if (otpValue < 100000) {
      otpValue += 100000;
    }
    setCode(otpValue.toString());
    let teacherCode = Math.floor(Math.random() * 900000) + 100000;
    setTeacher(teacherCode.toString());
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(false);
    try {
      if (profilePicture) {
        // Handle file upload
        const res = await toast.promise(
          edgestore.publicFiles.upload({
            file: profilePicture,
          }),
          {
            pending: "Your ClassRoom is Creating ",
            success: "ClassRoom Created Pls Wait👌",
            error: "Creating Failed Log In🤯",
          }
        );
        let uploadedFileUrlOrId = res.url;
        // console.log(uploadedFileUrlOrId);
        const postData = {
          title,
          description,
          code,
          profilePicture: uploadedFileUrlOrId,
          ownerId: ownerId,
          teacher,
        };
        // console.log("this is new data", postData);

        // Send the POST request
        let response = await axios.post(
          `${BASE_URL}/class/createClassroom`,
          postData,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          // Dispatch the classroom data to the store
          const ownerid = response?.data?.classroom?.owner;
          const classroomId = response?.data?.classroom?._id;
          const teacher = response?.data?.classroom?.teacher;
          createClassRoom({
            title,
            description,
            students: [],
            teachers: [teacher],
            ownerId: ownerid || ownerId,
            profilePicture: uploadedFileUrlOrId,
            code,
          });
          router.push(`/createdClass/${code}`);
          console.log("modal-classcreated", code);
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } else {
        toast("🦄All Field Required!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setErrorMessage("An error occurred while uploading the profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string) => {
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
      inputElement.select();
      document.execCommand("copy");
      toast.success("Code copied to clipboard!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleShareWhatsApp = () => {
    const uniqueCodeElement = document.getElementById("uniqueCode");
    const uniqueCode = uniqueCodeElement
      ? (uniqueCodeElement as HTMLInputElement).value
      : "";
    const message = `🎉 Exciting news Your unique code to join our Edunest classroom is: ${uniqueCode}. 🚀 Start your learning journey today and unlock a world of knowledge. Click the link below to join us: https://edunest.life`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  const getTextColor = () => {
    return theme === "dark" ? "white" : "orange-200 ";
  };

  return (
    <div>
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.3 }}
              className={`text-${getTextColor()}  bg-slate-700 text-xl font-bold px-14 py-4 border-none rounded-xl hover:bg-[#624DE3]`}
            >
              Create &rarr;
            </motion.button>
          </DialogTrigger>
          {status && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className={`text-2xl text-${getTextColor()}`}>
                  Create ClassRooms
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className={` text-${getTextColor()} grid gap-4 py-4`}>
                  <div className="items-center gap-4">
                    <Input
                      id="title"
                      // value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="title"
                      className="col-span-3  border-cyan-800 rounded-xl"
                    />
                  </div>
                  <div className="items-center gap-4">
                    <label htmlFor="profilePicture" className="cursor-pointer">
                      <Input
                        id="profilePicture"
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setProfilePicture(e.target.files[0]);
                          }
                        }}
                        className="col-span-3 border-cyan-800 rounded-xl"
                      />
                    </label>
                  </div>
                  <div className="items-center gap-4">
                    <Input
                      id="description"
                      // value={description}
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3  border-cyan-800 rounded-xl"
                    />
                  </div>
                  <div className="items-center gap-4">
                    <div className="relative">
                      <Input
                        id="uniqueCode"
                        defaultValue={code}
                        className="col-span-3 border-cyan-800 rounded-xl"
                      />
                      <button
                        onClick={handleShareWhatsApp}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-transparent border-0 focus:outline-none ml-2"
                      >
                        <FaShareAlt />
                      </button>
                      <button
                        onClick={() => handleCopy("uniqueCode")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-0 focus:outline-none"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                </div>
                <DialogFooter
                  className={`rounded-xl w-[22%]  text-${getTextColor()}  bg-[#624DE3] `}
                >
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          )}
        </Dialog>
      )}
    </div>
  );
}

export default CreateClass;
