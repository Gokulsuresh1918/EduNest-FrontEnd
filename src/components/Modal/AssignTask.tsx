import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Ui/button";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Ui/select";
import { Input } from "@/components/Ui/input";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useEdgeStore } from "../../lib/edgestore";
import { io } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const socket = io(`${BASE_URL}`);

export function AssignTask() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const demoCode = params.classCode;

  const [title, setTitle] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch the initial class data
        const response = await axios.get(`${BASE_URL}/class/getClassData/${demoCode}`);
        const students = response.data?.classroom[0]?.students || [];
  
        // Extract the IDs of the students
        const idsArray = students.map((student: { _id: any; }) => student._id);
  
        // Fetch the data for each student in parallel
        const res = await Promise.all(idsArray.map((id: any) =>
          axios.get(`${BASE_URL}/class/getStudentData/${id}`)
        ));
  
        // Log the raw response for debugging
        // console.log('res', res);
  
        // Extract the student data from the responses
        const studentsData = res.map(ele => ele.data.student);
        // console.log('testing', studentsData);
  
        // Set the student data in the state
        setStudents(studentsData);
      } catch (error) {
        // Handle errors appropriately
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch students data.");
      }
    };
  
    fetchClassData();
  }, [demoCode]);
  

  const getTextColor = () => {
    return theme === "dark" ? "white" : "orange-200";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const task = formData.get("task");
    const studentEmail = formData.get("student");
    const dueDate = formData.get("dueDate");

    const data = {
      task,
      studentEmail,
      dueDate,
      demoCode,
    };
    if (studentEmail) {
      const assignTask = async (data: object) => {
        await axios.post(`${BASE_URL}/class/assigntask`, data);
        toast.success("Task assigned successfully!");
      };
      socket.emit("taskAssigned", data);

      assignTask(data);
    }
  };

  return (
    <div>
      <Dialog defaultOpen={true}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={`text-2xl text-${getTextColor()}`}>
              Assign Tasks
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className={` text-${getTextColor()} grid gap-4 py-4`}>
              <div className="items-center gap-4">
                <Input
                  id="task"
                  name="task"
                  placeholder="Mention Task..."
                  className="col-span-3 border-cyan-800 rounded-xl"
                />
              </div>

              <Select name="student">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent className="bg-slate-300 text-black">
                  {students
                    ?.filter((student) => student?.email)
                    .map((student, index) => (
                      <SelectItem key={index} value={student.email}>
                        {student.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="items-center gap-4">
                <label htmlFor="dueDate">Last Date of Submission:</label>
                <input
                  name="dueDate"
                  id="dueDate"
                  type="date"
                  className="col-span-3 p-1 bg pr-3 text-black bg-white border-cyan-800 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter
              className={`rounded-xl w-[22%] text-${getTextColor()} bg-[#624DE3]`}
            >
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AssignTask;
