import {
  CalendarDays,
  DoorClosedLocked,
  DoorOpen,
  LinkIcon,
  ShieldUser,
} from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import { FaRegCopy } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { LuCopyCheck } from "react-icons/lu";
import InvitationCard from "./InvitationCard";
import { MdOutgoingMail } from "react-icons/md";

function GroupMembersHeader({ groupData, countRep }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  // const { data: amIRep } = useIsRep(groupData?.id);

  const accessTypes = [
    { label: "Open", value: "open", icon: <DoorOpen size={18} /> },
    {
      label: "Invite Only",
      value: "invite_only",
      icon: <MdOutgoingMail size={18} />,
    },
    { label: "Closed", value: "closed", icon: <DoorClosedLocked size={18} /> },
  ];
  const accessType = accessTypes.find((g) => g.value === groupData?.visibility);
  const countData = [
    {
      label: "Members",
      icon: <HiUserGroup />,
      count: groupData?.group_members[0]?.count,
    },
    {
      label: "Representatives",
      icon: <ShieldUser />,
      count: countRep,
    },
    {
      label: "Created",
      icon: <CalendarDays />,
      count: new Date(groupData?.created_at).toLocaleDateString(),
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(groupData?.group_code).then(() => {
      setCopied(true);
      toast.success("Copied to Clipboard !");
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="gp-members-header">
      {groupData?.banner_url && (
        <img className="group-banner-img" src={groupData?.banner_url} />
      )}
      <div className="header-left-col">
        <img
          src={groupData?.avatar_url}
          style={{ border: `3px solid ${groupData?.color}` }}
        />
      </div>

      <div className="header-mid-col">
        <div className="group-title">
          <p>
            {groupData?.name}{" "}
            <span style={{ color: groupData?.color }}>
              {accessType?.label} {accessType?.icon}
            </span>
          </p>
          <p>By : {groupData?.rep_name}</p>
        </div>
        <div className="group-count-members">
          {countData?.map((data) => {
            return (
              <div className="group-data-count" key={data.label}>
                <div>
                  {React.cloneElement(data?.icon, { color: groupData?.color })}
                </div>
                <div>
                  <p>{data?.count}</p>
                  <p>{data?.label}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="group-description">{groupData?.description}</div>
      </div>
      <div className="header-right-col">
        <p>Join Code</p>
        <div
          className="code-copy"
          style={{
            border: `2px dashed ${groupData?.color}`,
            backgroundColor: groupData?.color + "22",
          }}
        >
          <p>{groupData?.group_code}</p>
          <button onClick={handleCopy} style={{ color: groupData?.color }}>
            {copied ? <LuCopyCheck /> : <FaRegCopy />}
          </button>
        </div>
        <p> Share this code with others to invite them</p>
        <button
          onClick={() => setOpenInvitation(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? "transparent" : groupData?.color,
            border: `1px solid ${groupData?.color}`,
            color: isHovered ? groupData?.color : "white", // optional
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <LinkIcon /> Invite Link
        </button>
      </div>

      {openInvitation && (
        <div className="invitation-overlay">
          <InvitationCard
            setCloseInvitation={setOpenInvitation}
            groupData={groupData}
          />
        </div>
      )}
    </div>
  );
}

export default GroupMembersHeader;
