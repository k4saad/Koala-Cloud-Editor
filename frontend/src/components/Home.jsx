import React, { useState } from "react";
import koalaImage from "../assets/images/cool-koala.png";
import { Link, NavLink } from "react-router-dom";

function Home() {
  // TODO -- Make a request to backend for it to start. (like a ping)
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <aside
        className={`fixed lg:hidden z-40 flex h-screen w-52 flex-col overflow-y-auto border-r bg-[#032B22] px-5 py-8 font-Heavitas text-[#EFEDE7] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mt-6 flex flex-1 flex-col justify-between">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <label className="px-3 text-sm  uppercase ">
                Authentication
              </label>
              <Link
                to="/signin"
                className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 focus:bg-[#EFEDE7] focus:text-[#032B22]`
                }
              >
                <span className="mx-2 text-xs ">
                  Sign In
                </span>
              </Link>
              <Link
                to="/signup"
                className={`flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 focus:bg-[#EFEDE7] focus:text-[#032B22]`
                }
              >
                <span className="mx-2 text-xs ">
                  Sign Up
                </span>
              </Link>
            </div>
          </nav>
        </div>
      </aside>
      <section className="top-0 relative overflow-x-hidden bg-[#060707]">
        <nav className="z-40 relative  flex justify-between items-center px-5 py-5 w-full ">
          <button className={`${isOpen ? 'fixed ' : ' ' } lg:hidden  space-y-1`} onClick={toggleNav}>
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
            {/* <svg
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="#EFEDE7"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg> */}
          </button>

          {/* this div is made so that koala stay in place when side bar is opened  */}
          <div className={`${isOpen ? ' ' : 'hidden'} `}></div>
          
          <div className="text-4xl text-[#EFEDE7] font-Heavitas">Koala</div>
          <div className="hidden lg:flex text-[#EFEDE7] font-Heavitas">
            <Link
              href="/login"
              className=" hover:ring-2 hover:ring-[#02C173] focus:bg-[#02C173] rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-[#EFEDE7] bg-[#02C173] hover:bg-[#15d98bfd] focus:ring-4 rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
            >
              Sign up
            </Link>
          </div>
        </nav>
        <div className="items-center min-h-screen flex justify-around relative flex-wrap px-5">
          <>
            <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
          </>
          <div className="max-w-xl relative">
            <h1 className="text-[#EFEDE7] font-Heavitas text-4xl lg:text-6xl max-w-md text-left uppercase">
              Koala{" "}
              <span className="text-[#02C173] font-StretchPro">Cloud</span>{" "}
              Editor
            </h1>
            <p className="text-[#EFEDE7] text-left">
              A network of coding Koalas, each armed with unique cloud-powered
              tools. Their mission is to transform ideas into powerful code.
            </p>
          </div>
          <div className="z-20">
            <img width="500" height="500" alt="cool-koala" src={koalaImage} />
          </div>
        </div>
        <div className="overflow-y-visible items-center min-h-screen flex justify-around relative flex-wrap px-5">
          <>
            <div className="bg-[#15d98bfd] h-[362px] w-[362px] absolute rounded-full blur-[120px] filter -top-[100px]  -right-20 opacity-75"></div>
          </>
          <div className="max-w-xl relative">
            <h1 className="text-[#EFEDE7] font-Heavitas text-4xl lg:text-6xl max-w-xl text-center uppercase">
              Join <span className="text-[#02C173]">Koala</span> Netowrk
            </h1>
            <p className="text-[#EFEDE7] text-center">
              Write, test, and deploy Python code—no setup, no downloads, no
              hassle. All in one cloud workspace with AI built in
            </p>
            <div className="flex text-[#EFEDE7] font-Heavitas justify-center py-4">
              <Link
                href="/login"
                className=" hover:ring-2 hover:ring-[#02C173] focus:bg-[#02C173] rounded-lg text-xs lg:text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-[#EFEDE7] bg-[#02C173] hover:bg-[#15d98bfd]  rounded-lg text-xs lg:text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
              >
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-6 bg-[#060707] w-full">
        <div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
          <div className="grid grid-cols-12">
            <div className="pb-6 col-span-full md:pb-0 md:col-span-6">
              <Link
                href="#"
                className="flex justify-center space-x-3 md:justify-start"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30">
                  <img alt="cool-koala" src={koalaImage} />
                </div>
                <span className="self-center text-2xl text-[#EFEDE7] hover:text-[#02C173] focus:text-[#02C173] font-Heavitas">
                  Koala editor
                </span>
              </Link>
            </div>
            {/* <div className="col-span-6 text-center md:text-left md:col-span-3">
              <p className="pb-1 text-lg font-medium text-[#EFEDE7] ">Category</p>
              <ul>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-6 text-center md:text-left md:col-span-3">
              <p className="pb-1 text-lg font-medium text-[#EFEDE7]">Category</p>
              <ul>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#02C173] text-[#EFEDE7] focus:text-[#02C173]">
                    Link
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
          <div className="grid justify-center pt-6 lg:justify-between">
            <div className="flex flex-col self-center text-sm text-center md:block lg:col-start-1 md:space-x-6 text-[#EFEDE7]">
              <span>©2025 All rights reserved</span>
            </div>
            <div className="flex justify-center pt-4 space-x-4 lg:pt-0 lg:col-end-13">
              <a
                href="mailto:saadkhan108b@gmail.com"
                title="Email"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/k4saad"
                title="Linkedin"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30"
              >
                <svg
                  fill="#000000"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  className="w-5 h-5"
                  viewBox="0 0 97.75 97.75"
                  xml:space="preserve"
                >
                  <g>
                    <path
                      d="M48.875,0C21.882,0,0,21.882,0,48.875S21.882,97.75,48.875,97.75S97.75,75.868,97.75,48.875S75.868,0,48.875,0z
		 M30.562,81.966h-13.74V37.758h13.74V81.966z M23.695,31.715c-4.404,0-7.969-3.57-7.969-7.968c0.001-4.394,3.565-7.964,7.969-7.964
		c4.392,0,7.962,3.57,7.962,7.964C31.657,28.146,28.086,31.715,23.695,31.715z M82.023,81.966H68.294V60.467
		c0-5.127-0.095-11.721-7.142-11.721c-7.146,0-8.245,5.584-8.245,11.35v21.869H39.179V37.758h13.178v6.041h0.185
		c1.835-3.476,6.315-7.14,13-7.14c13.913,0,16.481,9.156,16.481,21.059V81.966z"
                    />
                  </g>
                </svg>
              </a>
              <a
                href="https://github.com/k4saad"
                title="GitHub"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;
