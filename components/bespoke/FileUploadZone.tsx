"use client";
import { useRef, useState } from "react";
import { validateFileSize, validateFileType, formatFileSize } from "@/lib/validation/bespokeValidation";

interface FileUploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  errors?: { [key: string]: string };
}

export function FileUploadZone({
  files,
  onChange,
  maxFiles = 5,
  maxSizeMB = 10,
  errors = {},
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];

    // Validate each file
    for (const file of fileArray) {
      if (files.length + validFiles.length >= maxFiles) break;

      if (!validateFileType(file)) {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { type: "error", text: `${file.name} must be PNG or JPG` },
          })
        );
        continue;
      }

      if (!validateFileSize(file, maxSizeMB)) {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: { type: "error", text: `${file.name} is too large (max ${maxSizeMB}MB)` },
          })
        );
        continue;
      }

      validFiles.push(file);

      // Generate preview
      try {
        const preview = await generatePreview(file);
        setPreviews((prev) => ({ ...prev, [file.name]: preview }));
      } catch (error) {
        console.error("Failed to generate preview:", error);
      }
    }

    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);

    // Remove preview
    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fileToRemove.name];
      return newPreviews;
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer ${
          isDragging
            ? "border-[#D4AF37] bg-[#D4AF37]/10"
            : "border-[#6D3D0D]/20 bg-white hover:border-[#D4AF37]/50"
        } ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => {
          if (files.length < maxFiles) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleInputChange}
          className="hidden"
          disabled={files.length >= maxFiles}
        />

        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
              isDragging ? "bg-[#D4AF37] text-white" : "bg-[#6D3D0D]/5 text-[#6D3D0D]/40"
            }`}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <p className="text-[#6D3D0D] text-base font-medium mb-2">
            {isDragging ? "Drop your images here" : "Drag & drop images or click to browse"}
          </p>

          <p className="text-[#6D3D0D]/60 text-sm font-light">
            PNG or JPG up to {maxSizeMB}MB (max {maxFiles} files)
          </p>

          {files.length >= maxFiles && (
            <p className="text-[#D4AF37] text-xs mt-2 font-light">
              Maximum {maxFiles} files reached
            </p>
          )}
        </div>
      </div>

      {/* Error Display */}
      {errors.files && (
        <p className="text-sm text-red-600 font-light">{errors.files}</p>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative group border border-[#6D3D0D]/10 bg-white p-2 hover:border-[#D4AF37]/50 transition-colors duration-300"
            >
              {/* Preview Image */}
              {previews[file.name] && (
                <div className="relative w-full aspect-square mb-2 overflow-hidden bg-[#6D3D0D]/5">
                  <img
                    src={previews[file.name]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="px-1">
                <p className="text-[#6D3D0D] text-xs font-medium truncate mb-1">{file.name}</p>
                <p className="text-[#6D3D0D]/50 text-xs font-light">{formatFileSize(file.size)}</p>
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* File-specific Error */}
              {errors[`file_${index}`] && (
                <p className="text-xs text-red-600 mt-1 font-light">{errors[`file_${index}`]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
