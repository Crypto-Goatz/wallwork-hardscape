import { google } from "googleapis";
import { getAuthFromCredentials } from "@/lib/google/auth";

interface DriveSetupResult {
  rootFolderId: string;
  subfolders: Record<string, string>;
}

const SUBFOLDER_NAMES = ["portfolio", "team", "blog", "general"] as const;

/**
 * Create Google Drive folder structure for site media.
 * Uses credentials directly (for setup before env vars exist).
 */
export async function createDriveFolders(
  credentials: object,
  businessName: string
): Promise<DriveSetupResult> {
  const auth = getAuthFromCredentials(credentials);
  const drive = google.drive({ version: "v3", auth });

  // Create root folder
  const rootFolder = await drive.files.create({
    requestBody: {
      name: `${businessName} — Site Media`,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  const rootFolderId = rootFolder.data.id!;

  // Make root folder accessible via link
  await drive.permissions.create({
    fileId: rootFolderId,
    requestBody: {
      role: "writer",
      type: "anyone",
    },
  });

  // Create subfolders
  const subfolders: Record<string, string> = {};

  for (const name of SUBFOLDER_NAMES) {
    const subfolder = await drive.files.create({
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [rootFolderId],
      },
      fields: "id",
    });
    subfolders[name] = subfolder.data.id!;
  }

  return { rootFolderId, subfolders };
}
