// Attachments carry their own lifecycle so the composer can render each state.

export type AttachmentStatus = "pending" | "uploading" | "uploaded" | "error";

export type AttachmentKind = "image" | "document" | "data" | "text";

export interface Attachment {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  mimeType: string;
  extension: string;
  kind: AttachmentKind;
  status: AttachmentStatus;
  /** 0–100, only meaningful while uploading. */
  progress: number;
  /** Object URL for image previews; revoked when the attachment is dropped. */
  previewUrl?: string;
  /** Present when status is "error". */
  error?: string;
  /** Where a real backend would return the stored object. */
  url?: string;
}

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_ATTACHMENTS_PER_MESSAGE = 5;

export const ACCEPTED_EXTENSIONS = [
  "pdf",
  "txt",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "csv",
  "json",
] as const;

export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number];
