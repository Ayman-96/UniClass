import "./InvitationCard.css";
import { X } from "lucide-react";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";
import { PiLinkSimpleBold } from "react-icons/pi";
import { SiSlideshare } from "react-icons/si";
import { toast } from "sonner";

function InvitationCrad({ setCloseInvitation, groupData }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(copyTxt) {
    navigator.clipboard.writeText(`${copyTxt}`).then(() => {
      setCopied(true);
      toast.success("Copied to Clipboard !");
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="invitation-card">
      <div className="inv-card-header">
        <div className="inv-icon">
          <SiSlideshare />
        </div>
        <div className="share-inv">
          <div>
            <p>Share Invitation</p>
            <p>Anyone ith this link can join you</p>
          </div>
          <button onClick={() => setCloseInvitation(false)}>
            <X />
          </button>
        </div>
      </div>

      <div className="inv-card-body">
        <div className="invite-link">
          <PiLinkSimpleBold />
          <p>{window.location.origin + "/join/" + groupData?.id}</p>
          <button
            onClick={() =>
              handleCopy(`${window.location.origin}/join/${groupData?.id}`)
            }
          >
            {copied ? <LuCopyCheck /> : <FaRegCopy />}
          </button>
        </div>

        <div className="divider-link">
          <div></div>
          <div>OR USE CODE</div>
          <div></div>
        </div>

        <div className="invite-code">
          <p>GROUP CODE</p>
          <div className="invite-code-row">
            <p>{groupData?.group_code}</p>
            <button onClick={() => handleCopy(groupData?.group_code)}>
              {copied ? <LuCopyCheck /> : <FaRegCopy />}
            </button>
          </div>
        </div>

        <p id="footer">
          Grow Your Communications With Studiyng Via <span>UNICLASS</span>
        </p>
      </div>
    </div>
  );
}

export default InvitationCrad;
