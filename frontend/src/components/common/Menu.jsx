import { ChevronRightIcon, FileCode2, FolderClosed, FolderOpen } from "lucide-react";
import { useState } from "react";
import { Menu as ContextMenu, Item, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "file-explorer-context-menu";

const Menu = ({node, onFileSelect, onFolderSelect, focusedFile, setFocusedFile, deleteFileOrFolder, renameFileOrFolder, path = []}) => {
  let [isOpen, setIsOpen] = useState(false);
  const { show } = useContextMenu({ id: MENU_ID });

  const handleFileClick = () => {
    setFocusedFile(path)
    if(!node.children){
        onFileSelect(path)
    }
    else{
        onFolderSelect(path)
        setIsOpen(!isOpen)
    }
  }
  const handleContextMenu = (event) => {
    event.preventDefault();
    show({
      event,
      props: {
        path: [...path]
      },
    });
  };

  return (
    <>
    <ul>
        <li key={node.name}>
        <span className={`${path?.join('/') == focusedFile?.join('/') ? "bg-slate-900" : ""} flex items-center gap-1.5 py-1 cursor-pointer hover:bg-slate-900 rounded-md`}
            onClick={handleFileClick}
            onContextMenu={handleContextMenu}
        >
            {node.children && node.children.length > 0 && (
            <div className="p-1 -m-1">
                <ChevronRightIcon
                color="#9ca3af"
                className={`size-4 duration-300 ${isOpen ? 'rotate-90' : ''}`}
                />
            </div>
            )}

            {node.children ? (<>
                {isOpen ? (
                <FolderOpen
                color="#0ea5e9"
                className={`size-5  ${
                node.children.length === 0 ? 'ml-[22px]' : ''
                }`}
            />) : (
            <FolderClosed
                color="#0ea5e9"
                className={`size-5  ${
                node.children.length === 0 ? 'ml-[22px]' : ''
                }`}
            />
        )}</>
            ) : (
            <FileCode2 
            color="#0ea5e9"
            className="ml-[22px] size-5" />
            )}
            {node.name}
        </span>

        {isOpen && (
            <ul className="pl-6">
            {node.children?.map((node) => (
                <Menu 
                node={node} 
                key={node.name} 
                onFileSelect={onFileSelect} 
                onFolderSelect={onFolderSelect}
                focusedFile={focusedFile}
                setFocusedFile={setFocusedFile}
                deleteFileOrFolder={deleteFileOrFolder}
                renameFileOrFolder={renameFileOrFolder}
                path={[...path, node.name]}/>
            ))}
            </ul>
        )}
        </li>
    </ul>
    <ContextMenu id={MENU_ID} theme="dark">
        <Item
          onClick={({ props }) => {
            renameFileOrFolder(props.path);
          }}
        >
          Rename
        </Item>
        <Item
          onClick={({ props }) => {
            console.log(props.path)
            deleteFileOrFolder(props.path);
          }}
        >
          Delete
        </Item>
      </ContextMenu>
      </>
  );
}

export default Menu;