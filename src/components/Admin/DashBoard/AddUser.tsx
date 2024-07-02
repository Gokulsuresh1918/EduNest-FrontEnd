import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/Ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Ui/dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@/components/Ui/input";
import { Label } from "@/components/Ui/label";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const AddUser = () => {
  // Step 1: State variables to hold the input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = async () => {
    try {
      const values = { name, email };
      const response = await axios.post(`${BASE_URL}/user/addUser`, values);
      // console.log("Response:", response.data);
      toast.success("User registered successfully!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Dialog defaultOpen={true}>
        <DialogContent className="sm:max-w-[425px] bg-slate-200">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>
              You Can Easily Add User From Here
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-bold">
                Name
              </Label>
              <Input
                id="name"
                // Step 1a: Bind the input value to state
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right font-bold">
                E-Mail
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="border bg-slate-400 rounded-xl font-bold"
              type="button"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default AddUser;
