import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Fab, CircularProgress } from "@mui/material";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/Ui/sheet";
import { useEdgeStore } from "@/lib/edgestore";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface Student {
  title: string;
  dueDate: string;
  status: string;
}

export const SideBarJoin = ({ classCode }: { classCode: string }) => {
  const [assignment, setAssignment] = useState<Student[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    const fetchAssignedTasks = async (id: string) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/class/assignedStudent/${id}`
        );
        // console.log("Assigned tasks fetched:", response.data);
        setAssignment(response.data.tasks || []);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
        toast.error("Failed to fetch assigned tasks.");
      }
    };

    const userString = localStorage.getItem("User");
    if (userString) {
      const userData = JSON.parse(userString);
      const userId = userData._id;
      if (userId) {
        fetchAssignedTasks(userId);
      }
    }
  }, []);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target && event.target.files ? event.target.files[0] : null;

    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress: any) => {
            setUploadProgress(progress);
            if (progress > 96) {
              setUploadProgress(0);
              toast.success("File uploaded successfully!");
            }
          },
        });

        const userJSON = localStorage.getItem("User");
        const user = userJSON ? JSON.parse(userJSON) : {};
        const fileData = {
          filename: file?.name,
          fileType: file?.type,
          fileSize: file?.size,
          fileUrl: res?.url,
          uploaderId: user._id,
          classCode,
        };

        const response = await axios.post(
          `${BASE_URL}/class/fileUpload`,
          fileData
        );

        console.log("Response file upload:", response.data);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file.");
      }
    }
  };

  return (
    <Sheet defaultOpen={true}>
      <SheetContent className="bg-slate-300 text-black overflow-scroll">
        <SheetHeader>
          <SheetTitle>Assigned Task</SheetTitle>
          <SheetDescription>
            Your assigned tasks will be shown here, and you can submit your
            task.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-1 py-4">
          {assignment.length > 0 ? (
            assignment.map((student, index) => (
              <div
                key={index}
                className="grid justify-between border px-4 py-3 border-black rounded-xl"
              >
                <h1 className="font-bold">
                  Title: <span className="font-normal">{student.title}</span>
                </h1>
                <h1 className="font-bold">
                  Due Date:{" "}
                  <span className="font-normal">
                    {new Date(student.dueDate).toLocaleDateString()}
                  </span>
                </h1>
                <h1 className="font-bold">
                  Status: <span className="font-normal">{student.status}</span>
                </h1>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                {uploadProgress ? (
                  <div className="w-full mt-2">
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                  </div>
                ) : (
                  <Fab
                    size="medium"
                    color="primary"
                    aria-label="add"
                    onClick={handleButtonClick}
                  >
                    <AssignmentIcon />
                  </Fab>
                )}
              </div>
            ))
          ) : (
            <p>No assignments available.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarJoin;
