import { BreadCrumb } from "@/components";
import { useGetSinglePost } from "@/hooks/actions/post";
import { useParams } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { IoTrashOutline } from "react-icons/io5";
import { EditIcon } from "lucide-react";
import { PostMainData } from "@/types/postType";

const SinglePost = () => {
  const { id } = useParams();

  const {
    data,
    isError: isErrorGetSinglePost,
    isRefetching: isRefetchSinglePost,
    isLoading: isLoadingSinglePost,
  } = useGetSinglePost(id || "");

  const singlePostData: PostMainData = data || {};

  return (
    <div
      className="p-3 bg-gray-100 overflow-y-scroll overflow-x-hidden border-red-600"
      style={{
        height: "calc(100vh - 150px)",
        minHeight: "calc(100vh - 150px)",
      }}
    >
      <BreadCrumb link="/post" target="post" current={`detail post`} />
      <main className="m-2 p-3 bg-white rounded-md shadow-md">
        {isLoadingSinglePost ? (
          <div className="flex justify-center item-center h-full w-full">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-end items-center gap-3">
              <Button
                variant="outline"
                className="text-white bg-orange-500 shadow-md"
              >
                <EditIcon className="text-xl" />
                <span className="px-2">Edit</span>
              </Button>
              <Button
                variant="outline"
                className="text-white bg-red-500 shadow-md"
              >
                <IoTrashOutline className="text-xl" />
                <span className="px-2">Delete</span>
              </Button>
            </div>
            <div className="p-4 border rounded-md shadow-md my-3">
              <h1 className="capitalize text-xl">{singlePostData.title}</h1>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default SinglePost;
