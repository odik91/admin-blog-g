import { BreadCrumb } from "@/components";
import { useGetSinglePost } from "@/hooks/actions/post";
import { useNavigate, useParams } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import { IoArrowBack, IoTrashOutline } from "react-icons/io5";
import { EditIcon } from "lucide-react";
import { PostMainData } from "@/types/postType";
import { format } from "date-fns";
import { api_url } from "@/utils/axios";
import DOMPurify from "dompurify";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    // isError: isErrorGetSinglePost,
    // isRefetching: isRefetchSinglePost,
    isLoading: isLoadingSinglePost,
  } = useGetSinglePost(id || "");

  const singlePostData: PostMainData = data || {};
  const postContent = DOMPurify.sanitize(singlePostData?.content || "");

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
            <div className="flex justify-between items-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <IoArrowBack className="text-xl" />
                <span className="px-2">Back</span>
              </Button>
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
            </div>
            <div className="p-4 border rounded-md shadow-md my-3">
              <div>
                <h2>Author: {singlePostData.get_user.name}</h2>
                <h3>
                  Publish date:{" "}
                  {format(new Date(singlePostData.created_at), "dd-MM-yyyy")}
                </h3>
                <h4>
                  Status:{" "}
                  {singlePostData.is_active === 1 ? "active" : "inactive"}
                </h4>
              </div>
              <div className="my-4">
                <div className="flex justify-center items-center my-6">
                  <img
                    src={api_url + singlePostData.image}
                    alt={singlePostData.image}
                    className="w-96"
                  />
                </div>
                <h1 className="capitalize text-2xl font-bold text-gray-600">
                  {singlePostData.title}
                </h1>
                <div
                  className="custom-html-content"
                  dangerouslySetInnerHTML={{ __html: postContent }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default SinglePost;
