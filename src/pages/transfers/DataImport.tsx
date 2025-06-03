
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

const DataImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Implement your upload logic here, e.g., upload to server or cloud storage
      console.log("Uploading file:", file.name);
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(`File "${file.name}" uploaded successfully!`);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Data Import</h1>
        <p className="text-muted-foreground mt-2">
          Import player data or reports from external sources
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Supported formats: CSV, XLSX, JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-10 text-center hover:border-gray-400"
            >
              <UploadCloud className="h-10 w-10 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">
                {file ? file.name : "Click to select a file or drag and drop"}
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full max-w-xs"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataImport;
