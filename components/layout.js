import Link from "next/link";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className=" w-[768px] m-auto flex flex-col h-screen overflow-hidden ">
      <div className="border-b-2 border-primary py-3">
        <Link href={"/"}>
          <span className="font-todofont text-3xl m-2">ToDo Lists</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
      <div className="border-t-2 border-primary py-3 justify-center">
        <span></span>
      </div>
    </div>
  );
};

export default Layout;
