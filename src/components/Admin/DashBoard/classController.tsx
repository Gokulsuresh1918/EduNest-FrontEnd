import React, { useEffect, useState } from "react";
import { Edit, Save, Ban } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import CreateClass from "@/components/Modal/CreateClass";
import Image from "next/image";
import { useTheme } from "next-themes"

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface ClassData {
  _id: string;
  title: string;
  description?: string;
  students: Array<any>;
  teacher: Array<any>;
  owner: string;
  profilePicture: string;
  roomCode: string;
  status: boolean;
  teacherCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface ModalProps {
  imageUrl: string;
  onClose: () => void;
}

const initialEditedClassData: ClassData = {
  _id: "",
  title: "",
  description: "",
  students: [],
  teacher: [],
  owner: "",
  profilePicture: "",
  roomCode: "",
  status: false,
  teacherCode: "",
  createdAt: "",
  updatedAt: "",
  __v: 0, // or 0 if it's a number
};

const ClassControlller = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editedClassData, setEditedClassData] = useState<ClassData>(
    initialEditedClassData
  );
  const [render, setRender] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [createClassss, setcreateClassss] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const { theme } = useTheme(); // Added to get the current theme


  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/classroomData`);
        // console.log(response.data);

        // When setting the classes after fetching
        setClasses(response.data);
      } catch (error) {
        console.error("There was an error fetching the classes!", error);
      }
    })();
  }, [render]);

  const handleSearch = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const handleAddClass = () => {
    setcreateClassss(!createClassss);
    // console.log(createClassss);
  };

  const handleEditClass = (classData: ClassData) => {
    setEditingClassId(classData._id);
    setEditedClassData(classData);
  };

  const handleSaveClass = async (classId: any) => {
    try {
      await axios.put(
        `${BASE_URL}/user/updateClass/${classId}`,
        editedClassData
      );
      setEditingClassId(null);
      setRender(!render);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleBlockClass = (roomCode: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes!`,
      cancelButtonText: "No, keep it",
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        axios
          .patch(`${BASE_URL}/class/deleteClass/${roomCode}`)
          .then((res) => {
            console.log("class Blocked");
            setRender(!render);
          })
          .catch((error) => {
            console.error("Error during blocking:", error);
          });
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditedClassData({ ...editedClassData, [field]: e.target.value });
  };

  const filteredClasses = classes.filter((classData) =>
    classData.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageClick = (imageUrl: React.SetStateAction<string>) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  // Modal Component
  const Modal = ({ imageUrl, onClose }: ModalProps) => (
    <div className="fixed top-1/4 left-1/4  w-[50%] h-[50%] flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg">
        <Image src={imageUrl} alt="Profile" width={500} height={500} />
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-md text-white px-2  rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className={`p-6 bg-gray-300 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'} min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search classes..."
          className="border text-black bg-slate-100 rounded-2xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {createClassss ? (
          <CreateClass />
        ) : (
          <button
            onClick={handleAddClass}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition"
          >
            Add Class
          </button>
        )}
      </div>
      <div
        className="overflow-x-scroll bg-white rounded-xl shadow-md"
        style={{ maxHeight: "400px" }}
      >
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Description
              </th>
            
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Profile Picture
              </th>
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Room Code
              </th>
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Teacher Code
              </th>
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((classData) => (
              <tr key={classData._id} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border text-sm text-gray-700">
                  {editingClassId === classData._id ? (
                    <input
                      type="text"
                      value={editedClassData.title || ""}
                      onChange={(e) => handleChange(e, "title")}
                      className="border text-white bg-gray-700 rounded-2xl p-1 text-sm"
                    />
                  ) : (
                    classData.title
                  )}
                </td>
                <td className="py-2 px-4 border text-sm text-gray-700">
                  {editingClassId === classData._id ? (
                    <input
                      type="text"
                      value={editedClassData.description || ""}
                      onChange={(e) => handleChange(e, "description")}
                      className="border text-white bg-gray-700 rounded-2xl p-1 text-sm"
                    />
                  ) : (
                    classData.description
                  )}
                </td>

               
                {showModal && (
                  <Modal
                    imageUrl={modalImageUrl}
                    onClose={() => setShowModal(false)}
                  />
                )}
                <td
                  onClick={() => handleImageClick(classData.profilePicture)}
                  className="py-2 px-4 border text-sm text-gray-700 cursor-pointer"
                >
                  <Image
                    src={classData.profilePicture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-2 px-4 border text-sm text-gray-700">
                  {classData.roomCode}
                </td>
                <td className="py-2 px-4 border text-sm text-gray-700">
                  {classData.teacherCode}
                </td>
                <td className="py-2 px-4 border text-sm text-gray-700">
                  <button
                    onClick={() =>
                      editingClassId === classData._id
                        ? handleSaveClass(classData._id)
                        : handleEditClass(classData)
                    }
                    className="text-blue-500 hover:text-blue-700 transition mr-2"
                  >
                    {editingClassId === classData._id ? (
                      <Save className="w-5 h-5" />
                    ) : (
                      <Edit className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleBlockClass(classData.roomCode)}
                    className={`${
                      classData.status
                        ? "text-red-500 hover:text-red-700 transition"
                        : "text-green-500 hover:text-green-700 transition"
                    }`}
                  >
                    <Ban className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassControlller;
