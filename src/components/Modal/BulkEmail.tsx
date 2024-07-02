import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Ui/drawer";
import { Input } from "@/components/Ui/input";
import { Textarea } from "@/components/Ui/textarea";
import { FaEnvelope } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@/components/Ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface Student {
  _id: string;
  name: string;
  email: string;
}

const BulkEmail = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  const params = useParams();
  const classCode = params.classCode;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/class/getClassData/${classCode}`
        );
        // console.log('respo', response.data);
        
        const stuId = response.data?.classroom[0]?.students || [];
        // console.log('stuId', stuId);
  
        const idsArray = stuId.map((item: any) => item._id);
        // console.log('idsArray', idsArray);
  
        const res = await Promise.all(
          idsArray.map((id: any) =>
            axios.get(`${BASE_URL}/class/getStudentData/${id}`)
          )
        );
        // console.log('res.sss', res);
  
        const studentsData = res.map((ele) => ele.data.student);
        // console.log('studentsData', studentsData);
  
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch class data:", error);
        toast.error("Failed to fetch class data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classCode]);
  
  const handleCheckboxChange = (email: string) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((e) => e !== email)
        : [...prevSelected, email]
    );
  };

  const handleShareEmail = async () => {
    try {
      setLoading(true);
      const emailAddresses = selectedStudents.join(",");
      const response = await axios.post(`${BASE_URL}/class/bulkEmail`, {
        subject,
        body,
        emailAddresses,
      });
      console.log("Email sent successfully:", response.data);
      toast.success("Email sent successfully");

      setTimeout(() => {
        router.push(`/createdClass/${classCode}`);
      }, 2000);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-[425px] text-orange-300">
        <DialogHeader>
          <DialogTitle className="text-orange-200 text-lg">
            Direct E-mail
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-center text-orange-200">
          Share email to students that you want
        </DialogDescription>
        <div className="grid py-2">
          <div className="items-center space-y-3 text-orange-200">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              id="Subject"
              placeholder="Subject"
              className="col-span-3 border-cyan-800 rounded-xl"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="rounded-xl text-center"
              placeholder="Body of the Email"
            />
            <Drawer>
              <DrawerTrigger className="border rounded-xl w-full p-1">
                Select Students
              </DrawerTrigger>
              <DrawerContent className="bg-yellow-50 text-black">
                <DrawerHeader>
                  <DrawerTitle className="text-3xl font-serif font-bold">
                    Select Student to share Mail
                  </DrawerTitle>
                  <DrawerDescription>
                    You can share email to your students. This feature is
                    limited to access full potential upgrade.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  {loading ? (
                    <CircularProgress />
                  ) : students.length > 0 ? (
                    students.map((item, index) => (
                      <div
                        key={item?._id || index}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={selectedStudents.includes(item.email)}
                          onChange={() => handleCheckboxChange(item.email)}
                        />
                        <label
                          htmlFor={`terms-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.email}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No students Joined.</p>
                  )}
                  <DialogFooter
                    onClick={handleShareEmail}
                    className="rounded-xl w-28 px-2 bg-red-700"
                  >
                    <Button className="flex justify-evenly w-full" type="button">
                      {loading ? <CircularProgress size={24} /> : "Send"}{" "}
                      <FaEnvelope />
                    </Button>
                  </DialogFooter>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="flex justify-evenly items-center"></div>
      </DialogContent>
    </Dialog>
    <ToastContainer/>
    </>
  );
};

export default BulkEmail;
