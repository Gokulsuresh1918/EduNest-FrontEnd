"use client";

import axios from "axios";
import { Ban, Edit, Save } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddUser from "../DashBoard/AddUser";
import { useTheme } from "next-themes"; // Added for theme management

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedClassrooms: string[];
  createdClassrooms: string[];
  blocked: boolean;
}

const BASEURL = process.env.NEXT_PUBLIC_SERVER_URL;

const UserController = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [render, setRender] = useState(false);
  const [add, setAdd] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUserData, setEditedUserData] = useState<Partial<User>>({});
  const { theme } = useTheme(); // Added to get the current theme

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${BASEURL}/user/allUserData`);
        // console.log(response.data);

        setUsers(response.data);
      } catch (error) {
        console.error("There was an error fetching the users!", error);
      }
    })();
  }, [render]);

  const handleBlockUser = async (userId: string) => {
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
          .patch(`${BASEURL}/class/blockUser/${userId}`)
          .then((res) => {
            ("Student Blocked");
            setRender(!render);
          })
          .catch((error) => {
            console.error("Error during blocking:", error);
          });
      }
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user._id);
    setEditedUserData({ name: user.name, email: user.email });
  };

  const handleSaveUser = async (userId: string) => {
    try {
      await axios.patch(`${BASEURL}/user/updateUser/${userId}`, editedUserData);
      console.log("User updated successfully");
      setRender(!render);
      setEditingUserId(null);
    } catch (error) {
      console.error("Error during updating:", error);
    }
  };

  const handleAddUser = () => {
    setAdd(!add);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setEditedUserData({ ...editedUserData, [field]: e.target.value });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {add && <AddUser />}
      <div
        className={`p-6 min-h-screen ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {" "}
        {/* Updated to apply theme */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search users..."
            className="border text-black bg-slate-100  rounded-2xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600 transition"
          >
            Add User
          </button>
        </div>
        <div className="overflow-x-scroll bg-white rounded-xl shadow-md">
          <table className="min-w-full bg-white border ">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="py-2 px-4 border text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        value={editedUserData.name || ""}
                        onChange={(e) => handleChange(e, "name")}
                        className="border border-gray-900 text-white rounded-2xl  p-1 text-sm"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        value={editedUserData.email || ""}
                        onChange={(e) => handleChange(e, "email")}
                        className="border border-gray-900 text-white rounded-2xl p-1 text-sm"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4 border text-sm text-gray-700">
                    <button
                      onClick={() =>
                        editingUserId === user._id
                          ? handleSaveUser(user._id)
                          : handleEditUser(user)
                      }
                      className="text-blue-500 hover:text-blue-700 transition mr-2"
                    >
                      {editingUserId === user._id ? (
                        <Save className="w-5 h-5" />
                      ) : (
                        <Edit className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className={`${
                        user.status
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
    </>
  );
};

export default UserController;
1;
