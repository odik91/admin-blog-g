import { BreadCrumb } from "@/components";
import SingePostEdit from "@/components/post/SingePostEdit";
import SinglePostPreview from "@/components/post/SinglePostPreview";
import { Button } from "@/components/ui/button";
import { useDeletePost, useGetSinglePost } from "@/hooks/actions/post";
import { PostMainData } from "@/types/postType";
import DOMPurify from "dompurify";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { IoArrowBack, IoTrashOutline } from "react-icons/io5";
import { Triangle } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const SinglePost = () => {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    // isError: isErrorGetSinglePost,
    isRefetching: isRefetchSinglePost,
    isLoading: isLoadingSinglePost,
  } = useGetSinglePost(id || "");

  const singlePostData: PostMainData = data || {};
  const postContent = DOMPurify.sanitize(singlePostData?.content || "");

  const { mutateAsync: deletePost, isPending: isDeletePost } = useDeletePost();

  const removePost = () => {
    Swal.fire({
      title: "Warning!",
      icon: "warning",
      html: `Are you sure want to delete<br><b>${singlePostData.title}?</b>`,
      confirmButtonText: "Confirm",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const label = singlePostData.title;
        deletePost(singlePostData.id).then((res) => {
          if (res?.status === 200) {
            Swal.fire({
              title: "Success!",
              icon: "success",
              html: res.data.message,
            });
            navigate("/post");
          } else {
            Swal.fire({
              title: "Error!",
              icon: "error",
              html: `Fail to delete article ${label}`,
            });
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Item not deleted", "", "info");
      }
    });
  };

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
        {isLoadingSinglePost || isRefetchSinglePost || isDeletePost ? (
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
                  disabled={edit || isDeletePost}
                >
                  <EditIcon className="text-xl" />
                  <span className="px-2">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  className="text-white bg-red-500 shadow-md"
                  disabled={edit || isDeletePost}
                  onClick={removePost}
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

            <SingePostEdit
              postData={singlePostData}
              edit={edit}
              setEdit={setEdit}
            />
          </div>
        )}
      </main>
    </div>
  );
};
export default SinglePost;
