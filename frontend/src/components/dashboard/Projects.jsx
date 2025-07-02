import { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import ProfileDropdown from "../common/ProfileDropdown";
import ProjectCard from "../common/ProjectCard";
import SuccessNotification from "../common/SuccessNotification"
import ErrorNotification from "../common/ErrorNotification"
import { addNewProject, deleteProjectById, getAllProjects, getCollaborationsProjectsApi, getProjectById } from "../utils/api";

// This page shows all the projects of a user

const Projects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [addProject, setAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [collaborationsProjects, setCollaborationsProjects] = useState([]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const fetchAllProjects = async () => {
    setIsLoading(true);
    try {
        const data = await getAllProjects();
        setProjects(data);
        setIsLoading(false);
    } catch (error) {
        console.log(error.message)
        console.log(data)
        setErrorMessage(error.message);
        setTimeout(() => {
            setErrorMessage("")
        }, 3000);
    }
  }

  useEffect(() => {
    fetchAllProjects();
    fetchCollaborationProjects();
  }, []);

  const addProjectToggle = () => {
    setAddProject(!addProject);
  };

  const createProject = async (e) => {
    e.preventDefault()
    setIsButtonDisabled(true);
    try{
        const response = await addNewProject(newProjectName)
        setSuccessMessage("Project created")
        setTimeout(() => {
            setSuccessMessage("")
        },3000);
        setErrorMessage("")
        fetchAllProjects()
    }
    catch(error){
        setErrorMessage(error.message)
        setTimeout(() => {
            setErrorMessage("")
        }, 3000);
    }
    finally{
        setNewProjectName("")
        addProjectToggle()
        setIsButtonDisabled(false);
    }
  };

  const handleInputChange = (e) => {
    setNewProjectName(e.target.value);
  };

  const handleNotification = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  const deleteProject = async (id) => {
  setIsButtonDisabled(true);
  try{
    await deleteProjectById(id);
    setSuccessMessage("Project deleted successfully");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
    fetchAllProjects();
  } catch (error) {
    setErrorMessage(error.message);
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  } finally {
    setIsButtonDisabled(false);
  }
  }

  const fetchCollaborationProjects = async () => {
    setIsLoading(true);
    try {
        const data = await getCollaborationsProjectsApi();
        setCollaborationsProjects(data);
        setIsLoading(false);
    } catch (error) {
        console.log(error.message)
        console.log(data)
        setErrorMessage(error.message);
        setTimeout(() => {
            setErrorMessage("")
        }, 3000);
    }
  }

  return (
    <>
      {addProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={addProjectToggle}
          ></div>
          <div className="relative z-50 mx-auto w-full max-w-xs md:max-w-sm">
            <form
              onSubmit={createProject}
              className="rounded-lg bg-gray-900 p-6 shadow-lg"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="newProjectName"
                    className="text-base font-medium text-[#02C173]"
                  >
                    Project Name
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="newProjectName"
                      name="newProjectName"
                      type="text"
                      value={newProjectName}
                      onChange={handleInputChange}
                      placeholder="Project Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isButtonDisabled}
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#02C173] hover:bg-[#15d98bfd] px-3.5 py-2.5 font-semibold leading-7 text-[#EFEDE7]"
                  >
                    Create Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <Sidebar isOpen={isOpen} />
      <section className="top-0 relative overflow-x-hidden bg-[#060707]">
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

          <ProfileDropdown />
        </nav>
        <>
          <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
        </>
        <>
            <div className="bg-[#15d98bfd] h-[362px] w-[362px] absolute rounded-full blur-[120px] filter bottom-[100px] -right-20 opacity-75"></div>
        </>

        {successMessage && (
            <SuccessNotification successMessage={successMessage}
            handleNotification={handleNotification}/>
        )}
        {errorMessage && (
            <ErrorNotification errorMessage={errorMessage}
            handleNotification={handleNotification}/>
        )}

        <div className="flex flex-col min-h-screen">
          <div className=" flex flex-row mt-32 mb-10 justify-between relative flex-wrap px-5">
            <div className="font-Heavitas text-white text-3xl z-30">
              Projects
            </div>
            <div>
              <button
                onClick={addProjectToggle}
                className="inline-flex w-full items-center justify-center rounded-md  bg-gray-900 hover:bg-gray-700 focus:bg-gray-950 text-gray-400  px-3.5 py-2.5 font-semibold leading-7"
              >
                Create
              </button>
            </div>
          </div>
          {isLoading ? (
            <div className="size-fit mx-auto transform translate-x-1/2 translate-y-1/2 ">
            <div className="border-t-transparent border-solid animate-spin  rounded-full border-[#00634D] border-8 h-10 w-10"></div>
          </div>
          ) : (
            projects.map((project) =>(
                <ProjectCard  project={project} key={project.id} deleteProject={() => deleteProject(project.id)} />
            ))
          )}
          <div className=" flex flex-row mt-32 mb-10 justify-between relative flex-wrap px-5">
            <div className="font-Heavitas text-white text-3xl z-30">
              Collaborations Projects
            </div>
          </div>
          {isLoading ? (
            <div className="size-fit mx-auto transform translate-x-1/2 translate-y-1/2 ">
            <div className="border-t-transparent border-solid animate-spin  rounded-full border-[#00634D] border-8 h-10 w-10"></div>
          </div>
          ) : (
            collaborationsProjects.map((project) =>(
                <ProjectCard  project={project} key={project.id} deleteProject={() => deleteProject(project.id)} />
            ))
          )}
        </div>
      </section>
    </>
  );
};
export default Projects;
