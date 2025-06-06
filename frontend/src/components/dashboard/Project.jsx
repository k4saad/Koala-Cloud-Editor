import { useEffect, useState } from "react";
import Split from "react-split";
import ProfileDropdown from "../common/ProfileDropdown";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import Menu from "../common/Menu";
import { SkeletonProject } from "./SkeletonProject";
import { pythonCompletions } from "../utils/pythonAutoCompletionList";

const Project = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectStructure, setProjectStructure] = useState({});
  const [selectedFilePath, setSelectedFilePath] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const navigateToProjects = () => {
    navigate("/projects");
  };

  const handleEditorChange = (code) => {
    if (code !== undefined && selectedFilePath) {
      setProjectStructure((prev) => {
        // i created a deep copy, because changes wasnt reflected
        const newStructure = JSON.parse(JSON.stringify(prev));
        let current = newStructure.root;
        for (let i = 0; i < selectedFilePath.length; i++) {
          const segment = selectedFilePath[i];
          if (i === selectedFilePath.length - 1) {
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
      const data = {
        project_id: 1,
        root: {
          name: "root",
          children: [
            {
              name: "app",
              children: [
                { name: "__init__.py", content: "" },
                {
                  name: "core",
                  children: [
                    { name: "__init__.py", content: "" },
                    {
                      name: "config",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "settings.py",
                          content: `# settings.py\n\nDB_NAME = "mydb"\nDEBUG = True`,
                        },
                      ],
                    },
                    {
                      name: "empty_dir",
                      children: [],
                    },
                    {
                      name: "utils",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "logger.py",
                          content: `# logger.py\n\nimport logging\nlogger = logging.getLogger("app")`,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "features",
                  children: [
                    { name: "__init__.py", content: "" },
                    {
                      name: "auth",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "controller",
                          children: [
                            { name: "__init__.py", content: "" },
                            {
                              name: "login_controller.py",
                              content: `# login_controller.py\n\ndef login():\n    print("Logging in...")`,
                            },
                          ],
                        },
                        {
                          name: "service",
                          children: [
                            { name: "__init__.py", content: "" },
                            {
                              name: "auth_service.py",
                              content: `# auth_service.py\n\ndef validate_user(username, password):\n    return username == "admin"`,
                            },
                          ],
                        },
                        {
                          name: "model",
                          children: [
                            { name: "__init__.py", content: "" },
                            {
                              name: "user.py",
                              content: `# user.py\n\nclass User:\n    def __init__(self, username):\n        self.username = username`,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "calculator",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "operations",
                          children: [
                            { name: "__init__.py", content: "" },
                            {
                              name: "basic_ops.py",
                              content: `# basic_ops.py\n\nclass Calculator:\n    def add(self, a, b): return a + b`,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "infrastructure",
                  children: [
                    { name: "__init__.py", content: "" },
                    {
                      name: "db",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "connection.py",
                          content: `# connection.py\n\ndef connect():\n    print("Connecting to DB")`,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "main.py",
                  content: `# main.py\n\nfrom app.core.utils.logger import logger\nlogger.info("App started")`,
                },
              ],
            },
            {
              name: "tests",
              children: [
                { name: "__init__.py", content: "" },
                {
                  name: "features",
                  children: [
                    { name: "__init__.py", content: "" },
                    {
                      name: "auth",
                      children: [
                        { name: "__init__.py", content: "" },
                        {
                          name: "test_login.py",
                          content: `# test_login.py\n\ndef test_login():\n    assert True`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      setProjectStructure(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

  const handleFileSelect = (path) => {
    setSelectedFilePath(path);
  };

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

  return (
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
              fill="#9ca3af"
              d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            />
            <path
              fill="#9ca3af"
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            />
          </svg>
        </button>
        <ProfileDropdown />
      </nav>

      {/* Main content with Split */}
      <div className="flex-1 relative">
        <>
          <div className="bg-[#15d98bfd] h-[181px] w-[181px] lg:h-[362px] lg:w-[362px] absolute rounded-full blur-[60px] lg:blur-[120px] filter -top-[100px]  -left-20 opacity-75"></div>
        </>
        {isLoading ? (
          <SkeletonProject />
        ) : (
          <Split sizes={[15, 50, 35]} minSize={0} className="split flex w-full">
            <div className="z-40  p-4 bg-[#252526] overflow-y-auto text-white rounded-xl ml-0.5">
              <Menu
                node={projectStructure.root}
                onFileSelect={handleFileSelect}
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
  );
};

export default Project;
