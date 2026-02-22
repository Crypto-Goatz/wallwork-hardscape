import { getDriveClient } from "./auth";
import { Readable } from "stream";
import type { DriveFile } from "@/lib/drive-utils";

export type { DriveFile } from "@/lib/drive-utils";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID!;

/**
 * List files in a Drive folder. Optionally specify a subfolder name.
 */
export async function listFiles(subfolder?: string): Promise<DriveFile[]> {
  const drive = getDriveClient();
  let parentId = FOLDER_ID;

  if (subfolder) {
    const folderRes = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and name = '${subfolder}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id)",
    });
    if (folderRes.data.files?.[0]?.id) {
      parentId = folderRes.data.files[0].id;
    }
  }

  const res = await drive.files.list({
    q: `'${parentId}' in parents and trashed = false and mimeType contains 'image/'`,
    fields: "files(id, name, mimeType, thumbnailLink, webContentLink, createdTime)",
    orderBy: "createdTime desc",
    pageSize: 100,
  });

  return (res.data.files || []) as DriveFile[];
}

/**
 * Upload a file to Drive. Returns the created file metadata.
 */
export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  subfolder?: string
): Promise<DriveFile> {
  const drive = getDriveClient();
  let parentId = FOLDER_ID;

  if (subfolder) {
    // Find or create the subfolder
    const folderRes = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and name = '${subfolder}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id)",
    });

    if (folderRes.data.files?.[0]?.id) {
      parentId = folderRes.data.files[0].id;
    } else {
      const newFolder = await drive.files.create({
        requestBody: {
          name: subfolder,
          mimeType: "application/vnd.google-apps.folder",
          parents: [FOLDER_ID],
        },
        fields: "id",
      });
      parentId = newFolder.data.id!;
    }
  }

  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [parentId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, name, mimeType, thumbnailLink, webContentLink, createdTime",
  });

  // Make the file publicly readable
  await drive.permissions.create({
    fileId: res.data.id!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return res.data as DriveFile;
}

/**
 * Delete a file from Drive.
 */
export async function deleteFile(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}

// Re-export URL utilities for backward compatibility in server code
export { getPublicUrl, getThumbnailUrl } from "@/lib/drive-utils";
