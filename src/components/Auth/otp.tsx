"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import imageUrl from "../../../public/images/signupimage.png";
import Link from "next/link";
import Logo from "../../../public/images/logo.png";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/Ui/input-otp";
import { Button } from "@/components/Ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Nav from "../Home/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const OtpPage = () => {
  const router = useRouter();
  const [timer, setTimer] = useState<number>(45);
  const [otp, setOTP] = useState("");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setTimer(30);

    try {
      const response = await axios.post(`${BASE_URL}/auth/resendOtp`);
      if (response) {
        toast.success("Resend Otp Send To Mail", {
          position: "top-left",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error, { position: "top-left" });
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const handleCheckOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const userEnteredOTP = otp;
    const data = {
      userEnteredOTP,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/otpVerification`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response) {
        toast.success("OTP Verification completed login ", {
          position: "top-left",
        });

        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error, { position: "top-left" });
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  const handleOTPChange = (newOTP: React.SetStateAction<string>) => {
    setOTP(newOTP);
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="block sm:hidden">
        <Nav />
      </div>

      <div className="flex flex-col sm:flex-row justify-center w-screen overflow-hidden  mt-28 sm:mt-0 text-center">
        <div className="w-full sm:w-1/2 flex flex-col bg-white text-black p-5 sm:p-10">
          <div className="w-full flex justify-center mb-5 sm:mb-10">
            <Link href="/">
              <Image src={Logo} alt="Logo" width={170} height={50} />
            </Link>
          </div>
          <div className="flex flex-col w-full gap-5 ">
            <form className="flex flex-col w-full gap-5 ">
              <h2 className="text-left text-lg font-semibold ml-32 sm:ml-52">Enter Your OTP</h2>
              <div className="ml-11 sm:ml-32">
              <InputOTP value={otp} onChange={handleOTPChange} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              </div>
              
              <p className="text-sm text-left ml-5 sm:ml-24">
                Please enter the one-time password sent to your Email.
              </p>

              <Button
                type="submit"
                onClick={handleCheckOtp}
                className="bg-blue-400 text-white rounded-xl"
                variant="outline"
              >
                Submit
              </Button>
              <p className="text-center">--------------OR-------------</p>

              {timer > 0 ? (
                <div className="flex justify-center text-black rounded-xl">
                  Resend OTP After :
                  <span className="text-red-600 text-base font-semibold">
                    {timer}
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleReset}
                  className="bg-blue-500 mb-5 rounded-3xl text-white"
                >
                  Resend
                </Button>
              )}
            </form>
          </div>
        </div>

        <div className="w-full sm:w-1/2 hidden sm:block">
          <Image
            src={imageUrl}
            alt="Login image"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
