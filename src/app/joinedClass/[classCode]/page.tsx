"use client";

import React, { useEffect, useState } from "react";
import Sidenav from "../../../components/classRoom/joined/SidenavJoin";
import NavBar from "../../../components/NavBar";
import ClassDetails from "../../../components/classRoom/joined/JoinedClassDetails";
import Image from "next/image";
import AdsSection from "../../../components/classRoom/AdsSection";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import Card from "../../../components/classRoom/card";
import imageUrl from "../../../../public/images/bg.svg";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const JoinedClass = ({ params }: { params: { classCode: string } }) => {
  const classCode = params?.classCode;
  const [file, SetFile] = useState([]);
  // console.log("classCode", classCode);
  useEffect(() => {
    const fetchFile = async () => {
      const responce = await axios.get(
        `${BASE_URL}/class/fileData/${classCode}`
      );
      const data = responce.data.files;
      // console.log("responce", data);

      SetFile(data);
      // console.log('thid iud stat ',file);
    };
    fetchFile();
  }, [classCode]);
  return (
    <>
      <div className="bg-white flex w-screen overflow-hidden  h-screen">
        <Sidenav />

        <div className="w-full">
          <NavBar />
          <div className="w-full flex">
            <div className="w-3/4">
              <ClassDetails classCode={classCode} />
              {/* display content */}
              <div className=" w-full h-full ">
                {file ? (
                  <div className="grid grid-cols-1 overflow-scroll h-[28rem]  rounded-xl md:grid-cols-3 m-6">
                    {file.map((item, index) => (
                      <Card key={index} file={item} />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 overflow-scroll h-[28rem]  rounded-xl shadow-2xl md:grid-cols-3 m-2 ">
                    <Image src={imageUrl} alt="no media" />{" "}
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/4">
              <h1>Ads Section </h1>
              <AdsSection
                dataAdFormat="auto"
                dataFullWidthResponsive={true}
                dataAdSlot="1549962104"
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default JoinedClass;
