import { ChevronRightIcon, FileCode2, FolderClosed, FolderOpen } from "lucide-react";
import { useState } from "react";

const Menu = ({node, onFileSelect, path = []}) => {
  let [isOpen, setIsOpen] = useState(false);

  const handleFileClick = () => {
    if(!node.children){
        onFileSelect([...path, node.name])
    }
    else{
        setIsOpen(!isOpen)
    }
  }

  return (
    <ul>
        <li key={node.name}>
        <span className="flex items-center gap-1.5 py-1 cursor-pointer hover:bg-slate-900 rounded-md"
            onClick={handleFileClick}
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
                path={node.children?.length > 0 ? [...path, node.name] : path}/>
            ))}
            </ul>
        )}
        </li>
    </ul>
  );
}

export default Menu;