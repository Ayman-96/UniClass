import {
  BookOpen,
  Users,
  Star,
  FileText,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
export const previewCards = [
  {
    id: 1,
    type: "lecture",
    label: "Data Structures · Fall 2025",
    title: "Lec 3 — Trees and BSTs",
    subtitle: "12 discussions · 3 questions",
    badge: { text: "Live", color: "#4f46e5" },
    icon: FileText,
    iconColor: "#4f46e5",
    bgColor: "rgba(79, 70, 229, 0.1)",
  },
  {
    id: 2,
    type: "discussion",
    label: "Discussion · 09:48",
    title: 'Is "hierarchical" just a fancy word for parent-child?',
    subtitle: "Sara R. · 4 likes",
    badge: { text: "+4", color: "#0d9488" },
    icon: MessageCircle,
    iconColor: "#0d9488",
    bgColor: "rgba(13, 148, 136, 0.1)",
  },
  {
    id: 3,
    type: "note",
    label: "Note pinned by rep · 09:15",
    title: "Focus on section 3.2 — BST property is key for midterm",
    subtitle: "Ali Karim · Class representative",
    badge: null,
    icon: Lightbulb,
    iconColor: "#d97706",
    bgColor: "rgba(217, 119, 6, 0.1)",
  },
];
export const previewFetures = [
  {
    id: 1,
    title: "Lecture viewer",
    description:
      "Read PDFs inline with numbered anchors tied directly to discussion threads — so every comment has context.",
    icon: BookOpen, // Passing the component reference directly
    theme: "purple",
  },
  {
    id: 2,
    title: "Class discussion",
    description:
      "Ask questions, leave notes, and see what your classmates think — all synced in real time during and after the lecture.",
    icon: Users,
    theme: "green",
  },
  {
    id: 3,
    title: "Rep highlights",
    description:
      "Class representatives can pin key reminders, exam tips, and corrections so nothing important gets buried.",
    icon: Star,
    theme: "yellow",
  },
];
