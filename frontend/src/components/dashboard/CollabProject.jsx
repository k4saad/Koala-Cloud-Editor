import { useEffect, useState } from "react";
import Split from "react-split";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import Menu from "../common/Menu";
import { SkeletonProject } from "./SkeletonProject";
import { pythonCompletions } from "../utils/pythonAutoCompletionList";
import { FilePlus, FolderPlus, Play, UserPlus, X } from "lucide-react";
import ErrorNotification from "../common/ErrorNotification";
import SuccessNotification from "../common/SuccessNotification";
import { getToken } from "../utils/auth";
import useWebSocket, {ReadyState} from "react-use-websocket";
import { getProjectById } from "../utils/api";

const CollabProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectStructure, setProjectStructure] = useState({});
  const [selectedFilePath, setSelectedFilePath] = useState();
  const [selectedFolderPath, setSelectedFolderPath] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addFile, setAddFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [addFolder, setAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localUpdate, setLocalUpdate] = useState(false);
  const [focusedFile, setFocusedFile] = useState();
  const [renameFileOrDir, setRenameFileOrDir] = useState(false);
  const [renamePath, setRenamePath] = useState([]);
  const [renameName, setRenameName] = useState("")

  const {sendJsonMessage, lastJsonMessage, readyState, lastMessage} = useWebSocket(`${import.meta.env.VITE_BACKEND_WEBSOCKET_URL}`,{
    shouldReconnect : () => true,
    reconnectAttempts : 10,
    reconnectInterval : 5000,
    queryParams : {projectId : id, Authorization : `Bearer ${getToken()}`},
  });


  const navigateToProjects = () => {
    navigate("/projects");
  };

  const handleNotification = () => {
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handleEditorChange = (code) => {
    if(code !== undefined && selectedFilePath) {
      setLocalUpdate(true);
      setProjectStructure((prev) => {
        // i created a deep copy, because changes wasnt reflected
        const newStructure = JSON.parse(JSON.stringify(prev));
        let current = newStructure.root;
        for(let i = 0; i < selectedFilePath.length; i++) {
          const segment = selectedFilePath[i];
          if(i === selectedFilePath.length - 1) {
            current.children = current.children.map((node) =>
              node.name === segment ? { ...node, content: code } : node
            );
          } else {
            current = current.children.find((node) => node.name === segment);
            if (!current) {
              console.log("Path not found");
              return prev;
            }
          }
        }
        return newStructure;
      });
    }
  };

  const getProject = async () => {
    setIsLoading(true);
    try {
      const data = await getProjectById(id);
      setProjectStructure(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

useEffect(() => {
    if (lastJsonMessage !== null) {
      try {
        setProjectStructure(lastJsonMessage);
      } catch (error) {
        console.log("Error parsing WebSocket message:", error);
        setErrorMessage("Invalid WebSocket message");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN && localUpdate) {
      sendJsonMessage(projectStructure);
      setLocalUpdate(false);
    }
  }, [projectStructure, sendJsonMessage, readyState]);

  const handleFileSelect = (path) => {
    setSelectedFilePath(path);
  };
  
  const handleFolderSelect = (path) => {
    setSelectedFolderPath(path);
  }

  const getSelectedFileContent = () => {
    if (!selectedFilePath || !projectStructure.root) return null;
    let current = projectStructure.root;
    for (const segment of selectedFilePath) {
      current = current.children?.find((node) => node.name === segment);
      if (!current) {
        console.log("Path not found");
        return null;
      }
    }
    return current.content || null;
  };

  const addFileToggle = () => {
      setAddFile(!addFile)
  }

  const handleFileChange = (e) => {
    setNewFileName(e.target.value)
  }


  const createFile = async (e) => {
    e.preventDefault();
      setLocalUpdate(true);
      setProjectStructure((prev) => {
        const newStructure = JSON.parse(JSON.stringify(prev))
        let current = newStructure.root;
        if(selectedFolderPath.length < 1){
          if(current.children.some(element => element.name === newFileName)){
            setErrorMessage("File with same name exists");
            setTimeout(() => setErrorMessage(""), 3000);
            return prev;
          }
          current.children = [...current.children,{name: newFileName, content: ""}]
        }
        else{
          for(let i = 0; i < selectedFolderPath.length; i++){
            const segment = selectedFolderPath[i];
            current = current.children.find((node) => node.name === segment);
            if (!current) {
              console.log("Path not found");
              return prev;
            }
            if(i === selectedFolderPath.length - 1){
              if(current.children.some(element => element.name === newFileName)){
                setErrorMessage("File with same name exists");
                setTimeout(() => setErrorMessage(""), 3000);
                return prev;
              }
              current.children = [...current.children,{name: newFileName, content: ""}]
            }
          }
        }
        setNewFileName("");
        addFileToggle();   
        return newStructure;
      });
  }

  const addFolderToggle = () => {
      setAddFolder(!addFolder)
  }

  const handleFolderChange = (e) => {
    setNewFolderName(e.target.value)
  }

  const createFolder = async (e) => {
    e.preventDefault();
      setLocalUpdate(true);
      setProjectStructure((prev) => {
        const newStructure = JSON.parse(JSON.stringify(prev))
        let current = newStructure.root;
          if(selectedFolderPath.length < 1){
            if(current.children.some(element => element.name === newFolderName)){
              setErrorMessage("Directory with same name exists");
              setTimeout(() => setErrorMessage(""), 3000);
              return prev;
            }
            current.children = [...current.children, {name: newFolderName, children: []}]
          }
          else{
          for(let i = 0; i < selectedFolderPath.length; i++){
            const segment = selectedFolderPath[i];
            current = current.children.find((node) => node.name === segment);
            if (!current) {
              console.log("Path not found");
              return prev;
            }
            if(i === selectedFolderPath.length - 1){
              if(current.children.some(element => element.name === newFolderName)){
                setErrorMessage("Directory with same name exists");
                setTimeout(() => setErrorMessage(""), 3000);
                return prev;
              }
              current.children = [...current.children,{name: newFolderName, children: []}]
            }
          }
        }
        setNewFolderName("");
        addFolderToggle();   
        return newStructure;
      });
  }
  const deleteFileOrFolder = (path) => {
    if(path.length > 0){
      setLocalUpdate(true);
      setProjectStructure((prev) => {
        const newStructure = JSON.parse(JSON.stringify(prev))
        let current = newStructure.root;
        for(let i = 0; i < path.length - 1; i++){
          const segment = path[i];
          current = current.children.find((node) => node.name === segment);
          if(!current){
            console.log("Path not found");
            return prev;
          }
        }
        current.children = current.children.filter((node) => node.name !== path[path.length - 1])
        return newStructure;
      })
    }
  }

  const renameFileOrFolder = (path) => {
    setRenamePath(path)
    renameFileOrFolderToggle()
  }

  const handleRenameName = (e) => {
    setRenameName(e.target.value)
  }

  const rename = (e) => {
    e.preventDefault();
    if(renamePath.length > 0){
      setLocalUpdate(true);
      setProjectStructure((prev) => {
        const newStructure = JSON.parse(JSON.stringify(prev))
        let current = newStructure.root;
        for(let i = 0; i < renamePath.length; i++){
          const segment = renamePath[i];
          current = current.children.find((node) => node.name === segment);
          if(!current){
            console.log("Path not found");
            return prev;
          }
        }
        current.name = renameName;
        setRenameName("");
        setRenamePath([]);
        renameFileOrFolderToggle()
        return newStructure;
      })
    }
    else{
      renameFileOrFolderToggle()
    }
  }
  const renameFileOrFolderToggle = () => {
      setRenameFileOrDir(!renameFileOrDir);
  }
  
  const runCode = () => {
    return;
  }

  return (
    <>
      {renameFileOrDir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={renameFileOrFolderToggle}
          ></div>
          <div className="relative z-50 mx-auto w-full max-w-xs md:max-w-sm">
            <form
              onSubmit={rename}
              className="rounded-lg bg-gray-900 p-6 shadow-lg"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="renameName"
                    className="text-base font-medium text-[#02C173]"
                  >
                    Rename /{selectedFolderPath.map(segment => segment + "/")}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="renameName"
                      name="renameName"
                      type="text"
                      value={renameName}
                      onChange={handleRenameName}
                      placeholder="File Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#02C173] hover:bg-[#15d98bfd] px-3.5 py-2.5 font-semibold leading-7 text-[#EFEDE7]"
                  >
                    Rename
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {addFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={addFileToggle}
          ></div>
          <div className="relative z-50 mx-auto w-full max-w-xs md:max-w-sm">
            <form
              onSubmit={createFile}
              className="rounded-lg bg-gray-900 p-6 shadow-lg"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="newFileName"
                    className="text-base font-medium text-[#02C173]"
                  >
                    Add file at /{selectedFolderPath.map(segment => segment + "/")}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="newFileName"
                      name="newFileName"
                      type="text"
                      value={newFileName}
                      onChange={handleFileChange}
                      placeholder="File Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#02C173] hover:bg-[#15d98bfd] px-3.5 py-2.5 font-semibold leading-7 text-[#EFEDE7]"
                  >
                    Create File
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {addFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={addFolderToggle}
          ></div>
          <div className="relative z-50 mx-auto w-full max-w-xs md:max-w-sm">
            <form
              onSubmit={createFolder}
              className="rounded-lg bg-gray-900 p-6 shadow-lg"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="newFolderName"
                    className="text-base font-medium text-[#02C173]"
                  >
                    Add directory at /{selectedFolderPath.map(segment => segment + "/")}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border text-[#02C173] font-semibold border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#15d98bfd] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      id="newFolderName"
                      name="newFolderName"
                      type="text"
                      value={newFolderName}
                      onChange={handleFolderChange}
                      placeholder="Directory Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#02C173] hover:bg-[#15d98bfd] px-3.5 py-2.5 font-semibold leading-7 text-[#EFEDE7]"
                  >
                    Create Directory
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <section className="top-0 relative bg-[#060707] min-h-screen flex flex-col">
        <nav className="z-40 relative flex justify-between items-center px-5 py-1 w-full">
          <button onClick={navigateToProjects}>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EFEDE7"
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
              />
              <path
                fill="#EFEDE7"
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              />
            </svg>
          </button>
          <button
            onClick={runCode}
            className="inline-flex items-center justify-center rounded-md bg-[#02C173] hover:bg-[#15d98bfd] px-2.5 py-1 font-semibold leading-7 text-[#EFEDE7]"
          >
            <Play className="size-6 pr-1"/> Run
          </button>
          <div></div>
          
        </nav>

        {/* Main content with Split */}
        <div className="flex-1 relative">
          <>
            <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
          </>
          {successMessage && (
              <SuccessNotification successMessage={successMessage}
              handleNotification={handleNotification}/>
          )}
          {errorMessage && (
              <ErrorNotification errorMessage={errorMessage}
              handleNotification={handleNotification}/>
          )}
          {isLoading ? (
            <SkeletonProject />
          ) : (
            <Split sizes={[15, 50, 35]} minSize={0} className="split flex w-full">
              <div className="z-40 flex flex-col gap-2 p-4 bg-[#252526] overflow-y-auto text-white rounded-xl ml-0.5">
                <nav className="w-full flex flex-row justify-between py-1 px-3 rounded-md  bg-[#141414]">
                  <div>File</div>
                  <div className="flex flex-row gap-2">
                    <button
                      onClick={addFileToggle}
                    >
                      <FilePlus color="#0ea5e9" className="size-5 hover:size-6"/>
                    </button>
                    <button
                      onClick={addFolderToggle}
                    >
                      <FolderPlus color="#0ea5e9" className="size-5 hover:size-6"/>
                    </button>
                  </div>
                </nav>
                <Menu
                  node={projectStructure.root}
                  onFileSelect={handleFileSelect}
                  onFolderSelect={handleFolderSelect}
                  focusedFile={focusedFile}
                  setFocusedFile={setFocusedFile}
                  deleteFileOrFolder={deleteFileOrFolder}
                  renameFileOrFolder={renameFileOrFolder}
                />
              </div>
              <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
                <Editor
                  language="python"
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  value={getSelectedFileContent()}
                  beforeMount={(monaco) => {
                    monaco.languages.registerCompletionItemProvider("python", {
                      provideCompletionItems: () => {
                        return {
                          suggestions: pythonCompletions,
                        };
                      },
                    });
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    renderWhitespace: "selection",
                    fontFamily:
                      '"Fira Code", "Cascadia Code", "Consolas", monospace',
                    fontLigatures: true,
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    contextmenu: true,
                    renderLineHighlight: "all",
                    lineHeight: 1.6,
                    letterSpacing: 0.5,
                    roundedSelection: true,
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                  }}
                />
              </div>
              <div className="p-4 bg-black text-green-400 overflow-y-auto">
                <h2 className="font-bold text-lg text-white mb-2">
                  Output Console
                </h2>
                <pre>$ python main.py{"\n"}Hello World!</pre>
              </div>
            </Split>
          )}
        </div>
      </section>
    </>
  );
};

export default CollabProject;
