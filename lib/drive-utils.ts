/**
 * Pure utility functions for Google Drive URLs.
 * These are safe to import from client components (no googleapis dependency).
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  createdTime?: string;
}

export function getPublicUrl(fileIdOrUrl: string): string {
  // If it's already a full URL (e.g. from an imported site), return as-is
  if (fileIdOrUrl.startsWith("http://") || fileIdOrUrl.startsWith("https://")) {
    return fileIdOrUrl;
  }
  return `https://drive.google.com/uc?export=view&id=${fileIdOrUrl}`;
}

export function getThumbnailUrl(fileIdOrUrl: string, size: number = 400): string {
  if (fileIdOrUrl.startsWith("http://") || fileIdOrUrl.startsWith("https://")) {
    return fileIdOrUrl;
  }
  return `https://drive.google.com/thumbnail?id=${fileIdOrUrl}&sz=w${size}`;
}
