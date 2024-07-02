import { Button } from "@/components/Ui/button";
import { Input } from "@/components/Ui/input";
import { Label } from "@/components/Ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/Ui/sheet";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { log } from "console";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import { SidebarContext } from "@/components/Ui/animated-tooltip";

interface Student {
  name?: string;
  email?: string;
}

export default function SideBarRight() {
  const [students, setStudents] = useState<any[]>();
  const [status, setStatus] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const params = useParams();
  const demoCode = params.classCode;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/class/getClassData/${demoCode}`
        );
        // console.log('classroom data',response.data?.classroom[0]?.status);
        setStatus(response.data?.classroom[0]?.status);
        // console.log('status',status);

        const stuId = response.data?.classroom[0]?.students;

        const extractIds = (stuId: any[]) => stuId.map((item) => item._id);
        const idsArray = extractIds(stuId);

        const res = await Promise.all(
          idsArray.map((id) =>
            axios.get(`${BASE_URL}/class/getStudentData/${id}`)
          )
        );

        const studentsData = res.map((ele) => ele.data.Students);
        // console.log("studentdadta", studentsData);

        setStudents(studentsData);
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchData();
  }, [BASE_URL,demoCode]);

  function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`${BASE_URL}/class/deleteClass/${demoCode}`)
          .then((res) => {
            console.log("Classroom Deleted");
            router.push("/");
          })
          .catch((error) => {
            console.error("Error during deletion:", error);
          });
      }
    });
  }
  function handleBlock(_id: String) {
    setSide(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes!`,
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`${BASE_URL}/class/blockUser/${_id}`)
          .then((res) => {
            console.log("Student Blocked");
          })
          .catch((error) => {
            console.error("Error during blocking:", error);
          });
      }
    });
  }

  let { setSide } = useContext(SidebarContext);
  return (
    <Sheet defaultOpen={true}>
      <SheetContent className="bg-slate-300 text-black">
        <SheetHeader className="flex justify-end">
          <div className="w-full flex justify-end">
            <p className="font-bold text-md pr-7">
              Close The Window here&gt;&gt;&gt;&gt;
            </p>
            <Button
              onClick={() => setSide(false)}
              className="border items-end  rounded-xl 
            bg-gray-500
               text-white"
              type="submit"
            >
              X
            </Button>
          </div>

          <SheetTitle
            onClick={() => setSide(false)}
            className=" font-bold text-3xl text-[#593e85] "
          >
            Control User
          </SheetTitle>
          <SheetDescription onClick={() => setSide(false)}>
            Make Control to your Students here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-1 py-4 ">
          {students &&
            students.map((student, index) => (
              <div
                key={index}
                onClick={() => setSide(false)}
                className="grid justify-between border px-2 py-1 border-black  rounded-xl "
              >
                <React.Fragment key={index}>
                  <h1 className="font-bold">
                    Name: <span className="font-normal">{student.name}</span>
                  </h1>
                  <h1 className="font-bold">
                    Email: <span className="font-normal">{student.email}</span>
                  </h1>
                  <SheetClose asChild>
                    <Button
                      onClick={() => handleBlock(student._id)}
                      className={`border rounded-xl ${
                        student.status ? " bg-green-500" : " bg-red-500"
                      }`}
                      type="submit"
                    >
                      {student.status ? "Block" : "UnBlock"}
                    </Button>
                  </SheetClose>
                </React.Fragment>
              </div>
            ))}
        </div>

        <SheetFooter>
          <Button
            onClick={handleDelete}
            className="border rounded-xl 
                bg-red-700
               text-white"
            type="submit"
          >
            Delete Class
          </Button>
        </SheetFooter>
        <ToastContainer />
      </SheetContent>
    </Sheet>
  );
}
