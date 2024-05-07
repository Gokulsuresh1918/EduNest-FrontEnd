"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import imageUrl from "../../../../public/images/signupimage.png";
import Logo from "../../../../public/images/logo.png";
import googleimg from "../../../../public/images/google logo.png";
import githubimg from "../../../../public/images/github-removebg-preview.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormField = z.infer<typeof schema>;

const loginPage = () => {
  const { data, status } = useSession();

  const {
    register, 
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormField>({
    defaultValues: { email: "test@gmail.com", password: "asdfasdf" },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // throw new Error();
      console.log("hello", data);
    } catch (error) {
      setError("root", {
        message: "Error from the backend",
      });
    }
  };

  return (
    <div className=" flex justify-center w-screen overflow-hidden">
      <div className="w-[50%] hidden h-screen sm:block">
        <Image
          src={imageUrl}
          alt="Login image"
          className="object-cover h-full w-full "
        />
      </div>
      <div className="w-[50%] flex flex-col justify-center ">
        <div className="w-full flex justify-center ">
          <Link href="/">
            <Image src={Logo} alt="Logo" width={170} height={50} />
          </Link>
        </div>
        <div>
          {/* bg-[#645FB7] */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex flex-col px-44 w-full gap-4"
          >
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="bg-blue-300 rounded-xl  border-red-50"
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
              className="bg-blue-300 rounded-xl border-red-50 "
            />
            {errors.password && (
              <p className="text-red-600 text-sm animate-pulse">
                {errors.password.message}
              </p>
            )}

            <Button
              disabled={isSubmitting}
              className="bg-blue-800 rounded-xl text-white  "
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
          <div className="flex justify-center">
            <h3 className="text-lg text-red-800 flex justify-center ">
              New User ?{" "}
              <a href="/signup" className="text-black">
                SIGN UP
              </a>
            </h3>
          </div>

          <div className="flex justify-center items-center space-x-5 ">
            <Image
              onClick={() => signIn("google")}
              src={googleimg}
              alt="google logo"
              width={40}
              height={45}
            />
            <Image
              onClick={() => signIn("github")}
              src={githubimg}
              alt="github logo"
              width={60}
              height={60}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default loginPage;


