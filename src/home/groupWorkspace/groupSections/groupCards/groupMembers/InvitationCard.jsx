import "./InvitationCard.css";
import { X } from "lucide-react";
import { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { LuCopyCheck } from "react-icons/lu";
import { PiLinkSimpleBold } from "react-icons/pi";
import { SiSlideshare } from "react-icons/si";
import { toast } from "sonner";

function InvitationCrad({ setCloseInvitation, groupData }) {
  const [copiedLink, setCopiedink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  function handleCopy(copyTxt, setter) {
    navigator.clipboard.writeText(`${copyTxt}`).then(() => {
      setter(true);
      toast.success("Copied to Clipboard !");
      setTimeout(() => setter(false), 2000);
    });
  }
  return (
    <div className="invitation-card">
      <div className="inv-card-header">
        <div className="inv-icon">
          <SiSlideshare style={{ color: groupData?.color }} />
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
              handleCopy(
                `${window.location.origin}/join/${groupData?.id}`,
                setCopiedink,
              )
            }
            style={{ background: groupData?.color }}
          >
            {copiedLink ? <LuCopyCheck /> : <FaRegCopy />}
          </button>
        </div>

        <div className="divider-link">
          <div></div>
          <div>OR USE CODE</div>
          <div></div>
        </div>

        <div
          className="invite-code"
          style={{ border: `1px dashed ${groupData?.color}` }}
        >
          <p style={{ color: groupData?.color }}>GROUP CODE</p>
          <div className="invite-code-row">
            <p>{groupData?.group_code}</p>
            <button
              onClick={() => handleCopy(groupData?.group_code, setCopiedCode)}
              style={{ background: groupData?.color }}
            >
              {copiedCode ? <LuCopyCheck /> : <FaRegCopy />}
            </button>
          </div>
        </div>

        <p id="footer">
          Grow Your Communications With Studiyng Via{" "}
          <span style={{ color: groupData?.color }}>UNICLASS</span>
        </p>
      </div>
    </div>
  );
}

export default InvitationCrad;
