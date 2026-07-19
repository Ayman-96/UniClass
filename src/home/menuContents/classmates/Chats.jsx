import "./chats.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import { useMessages, useSendMessage } from "../../../hooks/useChats";
import { SendHorizonal, X, Image } from "lucide-react";
import { useProfile } from "../../../hooks/useSaveProfile";
import useChatUIStore from "../../../store/useChatUiStore";

function Chats({ setOpenChat, friendId }) {
  const listEndRef = useRef(null);
  const inputRef = useRef(null);
  const imgInputRef = useRef(null);

  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { data: me } = useProfile();
  const { data: friend } = useProfile(friendId);
  const { data: messages = [], isPending } = useMessages(friendId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  function handleSendChat() {
    sendMessage(
      { receiverId: friendId, content: text, imageFile },
      {
        onSuccess: () => {
          setText("");
          setImageFile(null);
        },
      },
    );
  }
  const imagePreviewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  // cleanup the blob when it's replaced or component unmounts
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="chatting-section">
      <div className="chat-sheet">
        <div className="chat-sec-header">
          <div>{messages?.length} messages</div>
          <button
            onClick={() => {
              (setOpenChat(false),
                useChatUIStore.getState().setOpenChatWithUserId(null));
            }}
          >
            <X />
          </button>
        </div>
        <div className="chat-list">
          {messages?.map((message, i) => {
            const isMine = message.sender_id === me?.id;
            return (
              <div
                className={`messgae-card ${isMine ? "sent" : "received"}`}
                key={i}
              >
                <div className="msg-head">
                  {!isMine && (
                    <span className="sender-name">{friend?.username}</span>
                  )}
                  <span>
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {message.content && (
                  <p className="msg-content">{message.content}</p>
                )}
                {message.image_url && (
                  <img className="msg-image" src={message.image_url} />
                )}
              </div>
            );
          })}
          <div ref={listEndRef} />
        </div>

        {isPending && <LoadingSpinner />}
        <div className="write-chat-section">
          {imageFile && (
            <div className="added-chat-image">
              <img src={imagePreviewUrl} />
              <button
                className="remove-chat-img"
                onClick={() => setImageFile(null)}
              >
                <X />
              </button>
            </div>
          )}

          <div className="chatting">
            <img src={me?.avatar_url || ""} />
            <input
              type="text"
              value={text}
              placeholder="Write Something..."
              onChange={(e) => {
                setText(e.target.value);
              }}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendChat();
              }}
            />
            <button
              className="add-chat-img-btn"
              onClick={() => {
                imgInputRef.current?.click();
              }}
            >
              <Image />
            </button>
            <input
              id="chat-img"
              ref={imgInputRef}
              hidden
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {(text || imageFile) && (
              <button
                disabled={isSending}
                className="send-chat"
                onClick={handleSendChat}
                style={isSending ? { color: "#dceae5" } : {}}
              >
                <SendHorizonal />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chats;
