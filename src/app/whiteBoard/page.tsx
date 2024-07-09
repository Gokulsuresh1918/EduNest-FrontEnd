import React from "react";
import WhiteBoardCanvas from "../../components/classRoom/created/WhiteBoardCanvas";
import Nav from "@/components/Home/Navbar";

const WhiteBoard = () => {
  return (<>
  <div>

  <Nav/>
  </div>
    <main className=" flex min-h-screen flex-col items-center p-3 mt-20">
      <h1 className="sm:text-4xl text-xl font-bold mb-3">ClassRoom WhiteBoard</h1>
      <WhiteBoardCanvas/>
    </main>
  </>
  
  );
};

export default WhiteBoard;
