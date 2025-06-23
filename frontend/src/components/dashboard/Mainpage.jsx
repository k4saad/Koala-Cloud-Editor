import { useState } from "react";
import Sidebar from "../common/Sidebar";
import ProfileDropdown from "../common/ProfileDropdown"

const Mainpage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Sidebar isOpen={isOpen} />
      <section className="top-0 relative overflow-x-hidden bg-[#060707]">
        {/* TODO -- Make this header a component in common directory */}
        <nav className="z-40 relative  flex justify-between items-center px-5 py-5 w-full ">
          <button
            className={`${isOpen ? "fixed " : " "} space-y-1`}
            onClick={toggleNav}
          >
            <span
              className={`block h-1 w-6 bg-[#EFEDE7] rounded-sm duration-300 ${
                isOpen ? "rotate-45 translate-y-2 " : ""
              }`}
            ></span>
            <span
              className={`block h-1 w-6 bg-[#EFEDE7] rounded-sm duration-150 ${
                isOpen ? "opacity-0 " : ""
              }`}
            ></span>
            <span
              className={`block h-1 w-6 bg-[#EFEDE7] rounded-sm duration-300 ${
                isOpen ? "-rotate-45 -translate-y-2 " : ""
              }`}
            ></span>
          </button>

          {/* this div is made so that koala stay in place when side bar is opened  */}
          <div className={`${isOpen ? " " : "hidden"} `}></div>

          <ProfileDropdown/>
        </nav>
        <div className="items-center min-h-screen flex justify-around relative flex-wrap px-5">
          <>
            <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
          </>
          
        </div>
      </section>
    </>
  );
};
export default Mainpage;
