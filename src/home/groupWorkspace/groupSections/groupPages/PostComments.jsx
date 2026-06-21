import "./comments.css";
import { formatDistanceToNow } from "date-fns";
import { useAddComment, useDeleteComment } from "../../../../hooks/usePosts";
import {
  CornerDownLeft,
  Heart,
  Image,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react";
import LoadingSpinner from "../../../../components/loadingSpinner/LoadingSpinner.jsx";
import { useReducer } from "react";
import { useAuth } from "../../../../AuthContext.jsx";
import { useIsRep } from "../../../../hooks/useIsRep.js";
import { useParams } from "react-router-dom";
import TextCollapser from "../../../../components/loadingSpinner/TextExpnder.jsx";

const initialState = {
  content: "",
  image: null,
  replyTo: null,
};
function commentReducer(state, action) {
  switch (action.type) {
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "REMOVE_IMAGE":
      return { ...state, image: null };

    case "SET_REPLY_TO":
      return { ...state, replyTo: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function PostComments({ setOpenComments, storedComments, postId }) {
  const { groupId } = useParams();
  const { user } = useAuth();
  const { mutate: addComment, isPending, isError } = useAddComment();
  const { mutate: deleteComment } = useDeleteComment();
  const [newComment, dispatch] = useReducer(commentReducer, initialState);

  const { data: isRep } = useIsRep(groupId);
  function handleAddComment() {
    if (!newComment.content && !newComment.image) return;

    addComment({
      postId: postId,
      content: newComment.content,
      parentCommentId: newComment.replyTo,
      file: newComment.image,
    });
    dispatch({ type: "RESET" });
  }
  if (isError) return <div>Error Occured...</div>;
  return (
    <div className="post-comment-section">
      <div className="comment-sheet">
        <div className="comment-sec-header">
          <div>{storedComments?.length} comments</div>
          <button onClick={() => setOpenComments(false)}>
            <X />
          </button>
        </div>
        <div className="comments-list">
          {storedComments?.map((comment) => {
            return (
              <div className="comment-container" key={comment.id}>
                <div className="user-comment">
                  <img
                    className="user-pro"
                    src={comment.profiles?.avatar_url || null}
                  />
                  <div className="user-comm">
                    <div className="comm-head">
                      {comment.profiles?.username}
                      <span>
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="comm-content">
                      <TextCollapser color="#1a9e78">
                        {comment.content}
                      </TextCollapser>
                      {comment.image && <img src={comment.image} />}
                    </div>
                  </div>
                </div>

                <div className="comm-interactions">
                  <div className="act-comnt">
                    <button className="like-comment">
                      <Heart /> #
                    </button>
                    <button
                      className="reply-button"
                      onClick={() =>
                        dispatch({
                          type: "SET_REPLY_TO",
                          payload: comment.id,
                        })
                      }
                    >
                      <CornerDownLeft /> Reply
                    </button>
                  </div>
                  <button
                    className="delete-comnt"
                    onClick={() => deleteComment({ commentId: comment.id })}
                  >
                    {(user.id === comment.user_id || isRep) && <Trash2 />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {isPending && <LoadingSpinner />}
        <div className="write-comment-section">
          {newComment.image && (
            <div className="added-image">
              <img src={URL.createObjectURL(newComment.image)} />
              <button
                className="remove-img"
                onClick={() => dispatch({ type: "REMOVE_IMAGE" })}
              >
                <X />
              </button>
            </div>
          )}

          <div className="commenting">
            <img />
            <input
              type="text"
              value={newComment.content}
              placeholder="Write a comment..."
              onChange={(e) => {
                dispatch({ type: "SET_CONTENT", payload: e.target.value });
              }}
            />
            <button
              className="add-img-btn"
              onClick={() => {
                document.getElementById("comment-img").click();
              }}
            >
              <Image />
            </button>
            <input
              id="comment-img"
              hidden
              type="file"
              onChange={(e) =>
                dispatch({ type: "SET_IMAGE", payload: e.target.files[0] })
              }
            />
            {(newComment.content || newComment.image) && (
              <button className="post-comment" onClick={handleAddComment}>
                <SendHorizonal />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default PostComments;
