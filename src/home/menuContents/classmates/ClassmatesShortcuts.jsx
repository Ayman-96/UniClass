import { formatDistanceToNow } from "date-fns";
import { useFriendRequests } from "../../../hooks/useFriends";
import { FaRegCopy, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { LiaHourglassHalfSolid } from "react-icons/lia";
import { useAuth } from "../../../AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { LuCopyCheck } from "react-icons/lu";
function ClassmatesShortcuts({ setActiveTab }) {
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  const { received } = useFriendRequests();
  const receivedRequests = received?.data;
  const { sent } = useFriendRequests();
  const sentRequests = sent?.data;

  function handleCopy() {
    navigator.clipboard.writeText(user?.id).then(() => {
      setCopied(true);
      toast.success("Copied to Clipboard !");
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="side-card-container">
      <div className="pending-card">
        <div>
          <p>Received Requests</p> <p>{receivedRequests?.length}</p>
        </div>
        <div className="received-people-add">
          {receivedRequests?.slice(0, 4).map((requester) => {
            return (
              <div className="requester-card" key={requester.id}>
                <div className="received-left-grid">
                  <img src={requester.requester?.avatar_url} />
                  <div>
                    <p>{requester.requester?.full_name}</p>
                    <p>
                      @
                      {requester.requester?.username
                        ?.trim()
                        .replace(/[\s\u00A0]+/g, "_")
                        .toLowerCase()}
                    </p>
                    <p>
                      Requested{" "}
                      {formatDistanceToNow(new Date(requester.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="received-right-grid">
                  <button>
                    <FaUserCheck />
                  </button>
                  <button>
                    <FaUserTimes />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="view-pendings-btn" onClick={() => setActiveTab(1)}>
          <p>View All Pendings</p>
          <p>
            <ChevronRight />
          </p>
        </div>
      </div>

      <div className="request-card">
        <div>
          <p>Sent Requests</p> <p>{sentRequests?.length}</p>
        </div>
        <div className="received-people-add">
          {sentRequests?.slice(0, 4).map((addressee) => {
            return (
              <div className="requester-card" key={addressee.addressee?.id}>
                <div className="received-left-grid">
                  <img src={addressee.addressee?.avatar_url} />
                  <div>
                    <p>{addressee.addressee?.full_name}</p>
                    <p>
                      @
                      {addressee.addressee?.username
                        ?.trim()
                        .replace(/[\s\u00A0]+/g, "_")
                        .toLowerCase()}
                    </p>
                    <p>
                      Requested{" "}
                      {formatDistanceToNow(new Date(addressee.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="received-right-grid">
                  <LiaHourglassHalfSolid /> <span> Pending</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="view-pendings-btn" onClick={() => setActiveTab(1)}>
          <p>View All Requests</p>
          <p>
            <ChevronRight />
          </p>
        </div>
      </div>

      <div className="add-me-card">
        <p>Add Me By</p>
        <p>Share tour code with others so they can add you </p>
        <div className="my-id-copy">
          <p>{user?.id}</p>
          <button onClick={handleCopy}>
            {copied ? <LuCopyCheck /> : <FaRegCopy />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassmatesShortcuts;
