import React from "react";
import Sidenav from "../../components/classroom/joined/SidenavJoin";
import NavBar from "../../components/classroom/NavBar";
import ClassDetails from "../../components/classroom/joined/JoinedClassDetails";
import Image from "next/image";
import AdsSection from "@/app/components/classroom/AdsSection";

const JoinedClass = ({ params }: { params: { classCode: string } }) => {
  const classcode = params?.classCode;
  console.log("classid", classcode);
  return (
    <>
      <div className="bg-white flex overflow-hidden h-screen ">
        <div>
          <Sidenav />
        </div>
        <div className="w-full ">
          <NavBar />
          <div className="flex ">
            <div className=" h-80 w-[74%]   ">
              <ClassDetails classCode={classcode} />
            </div>

            <AdsSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinedClass;