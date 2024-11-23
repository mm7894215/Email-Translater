import { Download } from "lucide-react";
import { Button } from "./ui/button";

interface DownloadButtonProps {
  htmlContent: string;
  fileName: string;
  language: string;
}

export function DownloadButton({ htmlContent, fileName, language }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_${language}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Download className="h-4 w-4" />
      Download HTML
    </Button>
  );
}
