import { PostMainData } from "@/types/postType";
import { api_url } from "@/utils/axios";
import { format } from "date-fns";

const SinglePostPreview = ({
  singlePostData,
  edit,
  postContent,
}: {
  singlePostData: PostMainData;
  edit: boolean;
  postContent: string;
}) => {
  return (
    <div
      className={`p-4 border rounded-md shadow-md my-3 ${edit ? "hidden" : ""}`}
    >
      <div>
        <h2>Author: {singlePostData.get_user.name}</h2>
        <h3>
          Publish date:{" "}
          {format(new Date(singlePostData.created_at), "dd-MM-yyyy")}
        </h3>
        <h4>
          Status: {singlePostData.is_active === 1 ? "active" : "inactive"}
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
  );
};
export default SinglePostPreview;
