import {
  Cake,
  Calendar,
  IdCard,
  Landmark,
  Layers,
  Tag,
  University,
  UserStar,
  VenusAndMars,
  Mail,
  LocateIcon,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaWhatsapp,
  FaTelegram,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export const socialBaseUrls = {
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/",
  twitter: "https://twitter.com/",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  telegram: "https://t.me/",
  phone: "https://wa.me/",
};
export function fetchProfile(userInfo) {
  const personalInfoTable = [
    {
      label: "Full Name",
      key: "full_name",
      value: userInfo?.full_name || "",
      icon: <IdCard />,
    },
    {
      label: "City",
      key: "city",
      value: userInfo?.city || "",
      icon: <LocateIcon />,
    },
    {
      label: "Username",
      key: "username",
      value: userInfo?.username || "",
      icon: <Tag />,
    },
    {
      label: "University / College",
      key: "college",
      value: userInfo?.college || "",
      icon: <University />,
    },
    {
      label: "Gender",
      key: "gender",
      value: userInfo?.gender || "",
      options: ["male", "female"],
      type: "select",
      icon: <VenusAndMars />,
    },
    {
      label: "Department",
      key: "department",
      value: userInfo?.department || "",
      icon: <Landmark />,
    },
    {
      label: "Age",
      key: "age",
      value: userInfo?.dob
        ? new Date().getFullYear() - new Date(userInfo.dob).getFullYear()
        : "",
      disabled: true,
      icon: <Calendar />,
    },
    {
      label: "Role",
      key: "role",
      value: userInfo?.role || "",
      type: "select",
      options: ["student", "lecturer", "professor", "doctor", "other"],
      icon: <UserStar />,
    },
    {
      label: "Date of Birth",
      key: "dob",
      value: userInfo?.dob || "",
      type: "date",
      icon: <Cake />,
    },
    {
      label: "Stage / Year",
      key: "stage",
      options: [
        "First Year",
        "Second Year",
        "3rd Year",
        "4th Year",
        "5th Year",
        "6th Year",
        "Graduated",
      ],
      value: userInfo?.stage || "",
      type: "select",
      icon: <Layers />,
    },
  ];

  const userContacts = [
    {
      label: "Email",
      key: "email",
      value: userInfo?.email || "",
      disabled: true,
      icon: <Mail />,
      warning: "Set to your account email",
    },
    {
      label: "Phone",
      key: "phone",
      value: userInfo?.phone || "",
      icon: <FaWhatsapp />,
      warning:
        "Country code + Phone number. or go to Whatsapp -> Three dot top right -> Settings -> Click Profile -> Phone",
    },
    {
      label: "GitHub",
      key: "github",
      value: userInfo?.github || "",
      icon: <FaGithub />,
      warning:
        "Enter your github username. You can find it in your github profile",
    },
    {
      label: "LinkedIn",
      key: "linkedin",
      value: userInfo?.linkedin || "",
      icon: <FaLinkedin />,
      warning: "Enter your LinkedIn handle only.",
    },
    {
      label: "Telegram",
      key: "telegram",
      value: userInfo?.telegram || "",
      icon: <FaTelegram />,
      warning:
        "Enter your username (without the @). You can find it in your telegram Profile, Third row",
    },
    {
      label: "Twitter/X",
      key: "twitter",
      value: userInfo?.twitter || "",
      icon: <FaXTwitter />,
      warning:
        "Enter your username (without @). You can find it in your profile under your account name",
    },
    {
      label: "Facebook",
      key: "facebook",
      value: userInfo?.facebook || "",
      icon: <FaFacebook />,
      warning:
        "Enter the username after the link. Open your facebook profile -> Three dot on top right -> Scroll to bottom -> Username after link .com/___",
    },
    {
      label: "Instagram",
      key: "instagram",
      value: userInfo?.instagram || "",
      icon: <FaInstagram />,
      warning:
        "Enter your username. You can find it in your instagram profile -> at the top lays the username.",
    },
  ];

  return { personalInfoTable, userContacts };
}
