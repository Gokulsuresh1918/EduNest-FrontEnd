"use client";

import { Button } from "@/components/Ui/button";
import { Input } from "@/components/Ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Cookies from "js-cookie";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import { userStore } from "../../../globalStore/store";
import githubimg from "../../../public/images/githublogo.png";
import googleimg from "../../../public/images/google logo.png";
import Logo from "../../../public/images/logo.png";
import imageUrl from "../../../public/images/signupimage.png";
import { Copy } from "lucide-react";

// Environment variable for base URL
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Form validation schema
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Infer the form field types from the schema
type FormField = z.infer<typeof schema>;

const LoginPage = () => {
  // Hook to get the session data and status
  const { data, status } = useSession();

  // Global state management using userStore
  const setUser = userStore((state) => state.setUser);
  const user = userStore((state) => state.user);

  // Local state management
  const [pass, setPass] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [login, setLogin] = useState(false);
  const [foremail, setForeEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [originalCode, setOrginalCode] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // React Hook Form setup with validation schema
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  // Effect to check token existence and manage login state
  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setLogin(true);
      } else {
        router.back();
      }
    };
    checkToken();
  }, [router]);

  // Form submission handler
  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, data);
      if (response.data && response.data.accessToken) {
        document.cookie = `token=${response.data.accessToken}; path=/; max-age=604800; Secure; SameSite=Strict`;
        setUser(response.data.user);
        localStorage.setItem("User", JSON.stringify(response.data.user));
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(`Try Sign up ${error.response.data.error}`, {
          position: "top-right",
        });
      } else {
        console.error("Unexpected Error occurred", error);
      }
    }
  };

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/user/userData`, {
        params: { email: foremail },
      });
      // console.log('respince banna data',response.data.otp);
      setOrginalCode(response.data.otp);
      if (response.status === 200) {
        setEmailSent(true);
        toast.success(
          "Access Granted. Now you can verify the code send to your email",
          { position: "top-right" }
        );
      } else {
        toast.error("User Not Found, Please Sign Up", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error during user lookup:", error);
      toast.error("Can't find your Email. Try Sign Up.", {
        position: "top-right",
      });
    }
  };

  // Handler for verifying the code
  const handleVerifyCode = async () => {
    try {
      // console.log('originalCode',originalCode);
      // console.log('verificationCode',verificationCode);

      if (originalCode == verificationCode) {
        setCodeVerified(true);
        toast.success(
          "Code verified successfully. Now you can change the password.",
          {
            position: "top-right",
          }
        );
      } else {
        toast.error("Invalid code. Please try again.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast.error("An error occurred while verifying the code.", {
        position: "top-right",
      });
    }
  };

  // Handler for changing the password
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match", { position: "top-right" });
      return;
    }
    // console.log("newPassword/", newPassword);
    // console.log("confirmNewPassword", confirmNewPassword);

    try {
      const response = await axios.post(`${BASE_URL}/user/findUser`, {
        email: foremail,
        newPassword: newPassword,
      });
      console.log("responce.data", response.data);

      if (response.status === 200) {
        toast.success(
          "Password changed successfully. Log in with the new password.",
          {
            position: "top-right",
          }
        );
        router.push("/login");
        setPass(true);
        setEmailSent(false);
        setCodeVerified(false);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        "An error occurred while changing the password. Try Sign Up.",
        {
          position: "top-right",
        }
      );
    }
  };

  // Toggle the password reset form
  const ForgetPass = () => {
    setPass(!pass);
    setEmailSent(false);
    setCodeVerified(false);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!", {
          position: "top-right",
        });
      })
      .catch((err) => {
        toast.error("Failed to copy!", {
          position: "top-right",
        });
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      {login && (
        <div className="flex justify-center w-screen h-screen overflow-hidden">
          <div className="hidden sm:block sm:w-1/2 h-screen">
            <Image
              src={imageUrl}
              alt="Login image"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="w-full sm:w-1/2 flex flex-col justify-center bg-white px-6 sm:px-20">
            <div className="w-full flex justify-center">
              <Link href="/">
                <Image src={Logo} alt="Logo" width={170} height={50} />
              </Link>
            </div>
            <div>
              {pass ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full gap-4"
                >
                  {/* Demo email and password section */}
                  <p className="pt-0 text-yellow-700 text-sm">
                    <span className="text-base font-bold pr-3 text-black">
                      Demo Mail:
                    </span>
                    edunestofficials@gmail.com
                    <button
                      type="button"
                      className="text-green-600 ml-2 font-normal"
                      onClick={() =>
                        copyToClipboard("edunestofficials@gmail.com")
                      }
                    >
                      <Copy />
                    </button>
                  </p>
                  <p className="pt-0 text-yellow-700 text-sm">
                    <span className="text-base font-bold pr-3 text-black">
                      Demo Pass:
                    </span>
                    asdfasdf
                    <button
                      type="button"
                      className="text-green-600 ml-2 font-normal"
                      onClick={() => copyToClipboard("asdfasdf")}
                    >
                      <Copy />
                    </button>
                  </p>
                  {/* End of demo email and password section */}
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="bg-blue-300 rounded-xl border-red-50"
                  />

                  {errors.email && (
                    <p className="text-red-700 text-sm animate-pulse">
                      {errors.email.message}
                    </p>
                  )}
                  <Input
                    type="password"
                    {...register("password")}
                    placeholder="Password"
                    className="bg-blue-300 rounded-xl border-red-50"
                  />

                  {errors.password && (
                    <p className="text-red-600 text-sm animate-pulse">
                      {errors.password.message}
                    </p>
                  )}
                  <Button
                    disabled={isSubmitting}
                    className="bg-blue-800 hover:bg-blue-950 rounded-xl text-white"
                    variant="outline"
                  >
                    {isSubmitting ? "...Loading" : "Log In"}
                  </Button>
                  {errors.root && (
                    <p className="text-red-500 text-xl animate-pulse">
                      {errors.root.message}
                    </p>
                  )}
                </form>
              ) : (
                <form
                  onSubmit={handleSendCode}
                  className="flex flex-col w-full gap-4"
                >
                  {!emailSent && (
                    <>
                      <h1 className="font-semibold text-center overflow-hidden">
                        <span
                          className="scrolling-text text-red-500 inline-block"
                          style={{ animation: "marquee 10s linear infinite" }}
                        >
                          Enter Your Email to Change Password
                        </span>
                      </h1>
                      <Input
                        type="email"
                        value={foremail}
                        onChange={(e) => setForeEmail(e.target.value)}
                        placeholder="Enter your Email"
                        className="bg-blue-300 rounded-xl border-red-50"
                      />
                      <Button
                        type="submit"
                        className="bg-blue-800 rounded-xl text-white"
                        variant="outline"
                      >
                        Send Code
                      </Button>
                    </>
                  )}
                </form>
              )}
              {emailSent && !codeVerified && (
                <div className="flex flex-col w-full gap-4">
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter Verification Code"
                    className="bg-blue-300 rounded-xl border-red-50"
                  />
                  <Button
                    onClick={handleVerifyCode}
                    className="bg-blue-800 rounded-xl text-white"
                    variant="outline"
                  >
                    Verify Code
                  </Button>
                </div>
              )}
              {codeVerified && (
                <div className="flex flex-col w-full gap-4">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter New Password"
                    className="bg-blue-300 rounded-xl border-red-50"
                  />
                  <Input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="bg-blue-300 rounded-xl border-red-50"
                  />
                  <Button
                    onClick={handleChangePassword}
                    className="bg-blue-800 rounded-xl text-white"
                    variant="outline"
                  >
                    Change Password
                  </Button>
                </div>
              )}
              {pass && (
                <div className="flex justify-center">
                  <h3
                    onClick={ForgetPass}
                    className="text-sm p-4 text-red-800 flex justify-center cursor-pointer"
                  >
                    Forget Password?
                  </h3>
                </div>
              )}
              <div className="flex justify-center">
                <h3 className="text-lg text-red-800 flex justify-center">
                  New User?{" "}
                  <Link href="/signup" className="text-black">
                    SIGN UP
                  </Link>
                </h3>
              </div>
              {/* <div className="flex justify-center items-center space-x-5">
                <Image
                  onClick={() => signIn("google")}
                  src={googleimg}
                  alt="google logo"
                  width={40}
                  height={45}
                  className="cursor-pointer"
                />
                <Image
                  onClick={() => signIn("github")}
                  src={githubimg}
                  alt="github logo"
                  width={60}
                  height={60}
                  className="cursor-pointer"
                />
              </div> */}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </>
  );
};

export default LoginPage;
