import { Link } from "react-router-dom";

// TODO -- Modify this to look better
const ProjectCard = ({project}) => {
    return(
    <Link 
        to={`/projects/${project.name}`}
        className="z-20 font-Heavitas text-left inline-flex mb-0.5  mx-5 rounded-md  bg-gray-900 hover:bg-gray-700 focus:bg-gray-950 text-gray-400  px-3.5 py-4 font-semibold leading-7"
        
    >
        {project.name}
    </Link>
    )
}
export default ProjectCard;