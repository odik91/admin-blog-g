import { BreadCrumb } from "@/components";
import SinglePostPreview from "@/components/post/SinglePostPreview";
import { Button } from "@/components/ui/button";
import { useGetSinglePost } from "@/hooks/actions/post";
import { PostMainData } from "@/types/postType";
import DOMPurify from "dompurify";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { IoArrowBack, IoTrashOutline } from "react-icons/io5";
import { Triangle } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";

const SinglePost = () => {
  const [edit, setEdit] = useState(false);
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
              <Button variant="outline" onClick={() => navigate("/post")}>
                <IoArrowBack className="text-xl" />
                <span className="px-2">Back</span>
              </Button>
              <div className="flex justify-end items-center gap-3">
                <Button
                  variant="outline"
                  className="text-white bg-orange-500 shadow-md"
                  onClick={() => setEdit(true)}
                  disabled={edit}
                >
                  <EditIcon className="text-xl" />
                  <span className="px-2">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  className="text-white bg-red-500 shadow-md"
                  disabled={edit}
                >
                  <IoTrashOutline className="text-xl" />
                  <span className="px-2">Delete</span>
                </Button>
              </div>
            </div>

            {/* preview post */}
            <SinglePostPreview
              singlePostData={singlePostData}
              edit={edit}
              postContent={postContent}
            />
          </div>
        )}
      </main>
    </div>
  );
};
export default SinglePost;
