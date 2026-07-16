import {
  CodeXml,
  Cpu,
  Database,
  Earth,
  SquarePi,
  PresentationIcon,
  SheetIcon,
  FileTextIcon,
  ImageIcon,
  FileIcon,
} from "lucide-react";

export const colorOptions = [
  "#00a86b", // Emerald Green
  "#065f46", // Deep Forest Green
  "#3b82f6", // Vibrant Blue
  "#e05626", // Burnt Orange
  "#d24d74", // Rose Pink
  "#c07014", // Ochre Gold
];

export const seasons = ["fall", "spring", "summer", "winter"];

export const COURSE_ICON_MAP = {
  database: Database,
  code: CodeXml,
  cpu: Cpu,
  math: SquarePi,
  earth: Earth,
};
const fileTypeStyles = {
  "application/pdf": {
    icon: FileTextIcon,
    label: "PDF",
    bg: "#faeeda",
    color: "#854f0b",
  },
  "application/msword": {
    icon: FileTextIcon,
    label: "DOC",
    bg: "#e6f1fb",
    color: "#185fa5",
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    icon: FileTextIcon,
    label: "DOC",
    bg: "#e6f1fb",
    color: "#185fa5",
  },
  "application/vnd.ms-powerpoint": {
    icon: PresentationIcon,
    label: "PPT",
    bg: "#faece7",
    color: "#993c1d",
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    icon: PresentationIcon,
    label: "PPT",
    bg: "#faece7",
    color: "#993c1d",
  },
  "application/vnd.ms-excel": {
    icon: SheetIcon,
    label: "XLS",
    bg: "#e1f5ee",
    color: "#0f6e56",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    icon: SheetIcon,
    label: "XLS",
    bg: "#e1f5ee",
    color: "#0f6e56",
  },
};

export function getFileStyle(type) {
  if (type.startsWith("image/")) {
    return { icon: ImageIcon, label: "IMG", bg: "#f1efe8", color: "#5f5e5a" };
  }
  return (
    fileTypeStyles[type] || {
      icon: FileIcon,
      label: "FILE",
      bg: "#f1efe8",
      color: "#5f5e5a",
    }
  );
}
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
