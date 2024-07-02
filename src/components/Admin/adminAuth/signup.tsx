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
import githubimg from "../../../../public/images/githublogo.png";
import googleimg from "../../../../public/images/google logo.png";
import Logo from "../../../../public/images/logo.png";
import imageUrl from "../../../../public/images/admin image.jpg";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const handleGoogleSignIn = () => {
  window.open(`${BASE_URL}/auth/google/callback`, "_self");
};
const handleGithubSignIn = () => {
  window.open(`${BASE_URL}/auth/github/callback`, "_self");
};

const schema = z
  .object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters long" }),
    role: z.literal("admin"), // Ensure the role is 'admin'
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
        toast.error("Confirm password and password must be equal", {
          position: "top-right",
        });
        return;
      }

      // Sending the form data including the 'role' to the backend
      const response = await axios.post(`${BASE_URL}/auth/signup`, values);

      if (response) {
        // console.log(response.data);
        router.replace("/adminOtp");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error, {
          position: "top-right",
        });
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-center w-full h-screen overflow-hidden">
      <div className="w-full md:w-[50%] flex flex-col justify-center bg-white p-5 md:p-10">
        <div className="w-full flex justify-center mb-2 ">
          <Link href="/">
            <Image src={Logo} alt="Logo" width={170} height={50} />
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              type="text"
              placeholder="Name"
              {...register("name")}
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.name && (
              <p className="text-red-600 text-xs animate-pulse">{errors.name.message}</p>
            )}
            <Input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.email && (
              <p className="text-red-600 text-xs animate-pulse">{errors.email.message}</p>
            )}
            <Input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="bg-blue-300 rounded-xl border-red-50"
            />
            {errors.password && (
              <p className="text-red-600 text-xs animate-pulse">{errors.password.message}</p>
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
            <input type="hidden" {...register("role")} value="admin" />
            <Button
              disabled={isSubmitting}
              type="submit"
              className="bg-blue-800 text-white rounded-xl"
              variant="outline"
            >
              {isSubmitting ? "...Submitting" : " Sign Up"}
            </Button>
            {errors.root && (
              <p className="text-red-500 text-sm animate-pulse">{errors.root.message}</p>
            )}
          </form>
          <h3 className="text-sm text-red-500">
            Already a User?{" "}
            <Link href="/adminLogin" className="text-black">
              Click Here
            </Link>
          </h3>
        </div>
    
      </div>
      <div className="hidden md:block w-full md:w-[50%] h-screen">
        <Image src={imageUrl} alt="Signup image" className="object-fill h-full w-full" />
      </div>
    </div>
  );
};

export default SignUpPage;
