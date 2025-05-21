import { NavLink } from "react-router-dom";

const Sidebar = ({isOpen}) => {
    return(
        <aside
        className={`fixed z-40 flex h-screen w-52 flex-col overflow-y-auto border-r bg-gray-900 px-5 py-8 font-Heavitas transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mt-10 flex flex-1 flex-col justify-between">
          <nav className="-mx-3 space-y-6 ">
            <div className="space-y-3 ">
              <label className="px-3 text-sm  uppercase text-gray-400">
                Label
              </label>
              <NavLink
                to="/~"
                className={({isActive}) => `${isActive ? "text-gray-300 bg-gray-700" : "text-gray-400"} flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300  hover:bg-gray-700 hover:text-gray-300`
                }
              >
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M15 18H9" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <span className="mx-2 text-xs ">
                  Home
                </span>
              </NavLink>
              <NavLink
                to="/projects"
                className={({isActive}) => `${isActive ? "text-gray-300 bg-gray-700" : "text-gray-400"} flex transform items-center rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-gray-700 hover:text-gray-300`
                }
              >
                <svg fill="#9ca3af" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.25 6a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5A.75.75 0 007.25 6zM12 6a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 0012 6zm4 .75a.75.75 0 011.5 0v9.5a.75.75 0 01-1.5 0v-9.5z"/><path fill-rule="evenodd" d="M3.75 2A1.75 1.75 0 002 3.75v16.5c0 .966.784 1.75 1.75 1.75h16.5A1.75 1.75 0 0022 20.25V3.75A1.75 1.75 0 0020.25 2H3.75zM3.5 3.75a.25.25 0 01.25-.25h16.5a.25.25 0 01.25.25v16.5a.25.25 0 01-.25.25H3.75a.25.25 0 01-.25-.25V3.75z"/></svg>
                <span className="mx-2 text-xs ">
                  Projects
                </span>
              </NavLink>
            </div>
          </nav>
        </div>
      </aside>
    );
};

export default Sidebar;