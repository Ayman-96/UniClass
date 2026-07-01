import { toast } from "sonner";

async function handleDownload(pdfUrl, title, toastMessage) {
  try {
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}-UniClass.pdf`;
    link.click();
    toast.success(toastMessage);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Download failed. Try again.");
  }
}

export default handleDownload;
