"use client";

import { Button } from "@/components/Ui/button";
import { Input } from "@/components/Ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import githubimg from "../../../public/images/githublogo.png";
import googleimg from "../../../public/images/google logo.png";
import Logo from "../../../public/images/logo.png";
import imageUrl from "../../../public/images/signupimage.png";


const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const handleGoogleSignIn = () => {
  window.open(`${BASE_URL}/auth/google/callback`, "_self");
};
const handleGithubSignIn = () => {
  window.open(`${BASE_URL}/auth/github/callback`, "_self");
};

const schema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormField = z.infer<typeof schema>;

const SignUpPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormField>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormField) {
    try {
      if (values.password !== values.confirmPassword) {
        toast.error("confirm password and password must be equal", {
          position: "top-right",
        });
        return;
      }
      const response = await axios.post(`${BASE_URL}/auth/signup`, values);

      if (response) {
        // console.log(response.data);
        router.replace("/otpPage");
      }
    } catch (error) {
      console.log("error");

      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error, {
          position: "top-right",
        });
        console.log("error in post ", error.response.data.error);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center w-screen  overflow-hidden">
      <div className="w-full md:w-1/2 flex flex-col bg-white justify-start h-screen px-6 md:px-20">
        <div className="w-full flex justify-center mt-8 md:mt-0">
          <Link href="/">
            <Image src={Logo} alt="Logo" width={170} height={50} />
          </Link>
        </div>
        <div className="flex flex-col w-full gap-5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-5"
          >
            <Input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.name && (
              <p className="text-red-600 text-xs animate-pulse">
                {errors.name.message}
              </p>
            )}

            <Input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.email && (
              <p className="text-red-600 text-xs animate-pulse">
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
              <p className="text-red-600 text-xs animate-pulse">
                {errors.password.message}
              </p>
            )}

            <Input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs animate-pulse">
                {errors.confirmPassword.message}
              </p>
            )}
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-blue-800 text-white rounded-xl"
              variant="outline"
            >
              {isSubmitting ? "...Submitting" : "Sign Up"}
            </Button>
            {errors.root && (
              <p className="text-red-500 text-sm animate-pulse">
                {errors.root.message}
              </p>
            )}
          </form>

          <h3 className="text-sm text-red-500">
            Already a User?{" "}
            <Link href="/login" className="text-black">
              Click Here
            </Link>
          </h3>
        </div>
        <div className="flex justify-center items-center space-x-5 my-5">
          <Image
            onClick={handleGoogleSignIn}
            src={googleimg}
            alt="google logo"
            width={40}
            height={45}
            className="cursor-pointer"
          />
          <Image
            onClick={handleGithubSignIn}
            src={githubimg}
            alt="github logo"
            width={60}
            height={60}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 hidden md:block h-screen">
        <Image
          src={imageUrl}
          alt="Sign Up image"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
