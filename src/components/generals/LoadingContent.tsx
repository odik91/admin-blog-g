import { FaRedoAlt } from "react-icons/fa";

const LoadingContent = () => {
  return (
    <div className="flex justify-center items-center gap-3">
      <FaRedoAlt className="text-2xl animate-spin text-blue-500" />
      <span className="text-xl">Loading...</span>
    </div>
  );
};
export default LoadingContent;
