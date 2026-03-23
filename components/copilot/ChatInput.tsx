"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export type AttachedFile = {
  name: string;
  type: string;
  size: number;
};

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  attachedFiles?: AttachedFile[];
  onRemoveFile?: (index: number) => void;
  onFilesAdded?: (files: AttachedFile[]) => void;
};

export function ChatInput({ onSend, disabled, attachedFiles = [], onRemoveFile, onFilesAdded }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed && attachedFiles.length === 0) return;
    if (disabled) return;
    onSend(trimmed || `Uploaded ${attachedFiles.length} document${attachedFiles.length > 1 ? "s" : ""}`);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFilesAdded) {
      onFilesAdded(files.map((f) => ({ name: f.name, type: f.type, size: f.size })));
    }
    e.target.value = "";
  }

  function getFileIcon(type: string) {
    if (type.startsWith("image/")) return "bx bx-image";
    if (type.includes("pdf")) return "bx bxs-file-pdf";
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) return "bx bx-spreadsheet";
    return "bx bx-file";
  }

  return (
    <div className="input-card-wrap">
    <div className="input-card">
      {/* Attached files */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            className="attached-files"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {attachedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                className="attached-file"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <i className={getFileIcon(file.type)} />
                <span className="attached-file-name">{file.name}</span>
                <button
                  type="button"
                  className="attached-file-remove"
                  onClick={() => onRemoveFile?.(index)}
                >
                  <i className="bx bx-x" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={disabled}
        rows={1}
        className="input-card-textarea"
      />
      <div className="input-card-toolbar">
        <div className="input-card-actions">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="sr-only"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="sr-only"
          />
          <div className="tooltip-wrap">
            <button className="input-card-action" type="button" onClick={() => fileInputRef.current?.click()}>
              <i className="bx bx-paperclip" />
            </button>
            <span className="tooltip">Attach documents</span>
          </div>
          <div className="tooltip-wrap">
            <button className="input-card-action" type="button" onClick={() => fileInputRef.current?.click()}>
              <i className="bx bx-file" />
            </button>
            <span className="tooltip">Upload invoice</span>
          </div>
          <div className="tooltip-wrap">
            <button className="input-card-action" type="button" onClick={() => cameraInputRef.current?.click()}>
              <i className="bx bx-camera" />
            </button>
            <span className="tooltip">Take a photo</span>
          </div>
        </div>
        <motion.button
          className="input-card-submit"
          onClick={handleSend}
          disabled={disabled || (!value.trim() && attachedFiles.length === 0)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
        >
          <i className="bx bx-up-arrow-alt" />
        </motion.button>
      </div>
    </div>
    <div className="security-badge">
      <i className="bx bx-lock-alt" />
      <span>256-bit SSL encrypted. SOC 2 compliant. Your data is secure.</span>
    </div>
    </div>
  );
}
