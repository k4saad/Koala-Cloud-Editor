import { Link } from "react-router-dom";

// TODO -- Modify this to look better
const ProjectCardCollab = ({project, deleteProject}) => {

    return(
        <div
        className="z-20 flex"
        >
            <Link 
                to={`/collaborations/projects/${project.id}`}
                className="w-full font-Heavitas text-left mb-1  m-5 rounded-md  bg-gray-900 hover:bg-gray-700 focus:bg-gray-950 text-gray-400  px-3.5 py-4 font-semibold leading-7"
                
            >
                <div>{project.name}</div>
            </Link>
        </div>
    )
}
export default ProjectCardCollab;