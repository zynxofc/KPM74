import fs from "fs";
import path from "path";
import { IStorageService } from "./types";

export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    // Files are saved inside public/uploads for direct Next.js static asset serving
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer | File, filename: string, folder = ""): Promise<string> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Sanitize filename to avoid directory traversal
    const sanitizedFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}-${sanitizedFilename}`;
    const filePath = path.join(targetFolder, uniqueName);

    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.promises.writeFile(filePath, buffer);
    } else {
      await fs.promises.writeFile(filePath, file);
    }

    // Return the relative URL path accessible by the browser
    return `/uploads/${folder ? folder + "/" : ""}${uniqueName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Only delete files belonging to the local uploads directory
    if (fileUrl.startsWith("/uploads/")) {
      const relativePath = fileUrl.replace("/uploads/", "");
      
      // Prevent directory traversal attacks
      const resolvedPath = path.resolve(path.join(this.uploadDir, relativePath));
      if (!resolvedPath.startsWith(this.uploadDir)) {
        throw new Error("Invalid file path");
      }

      if (fs.existsSync(resolvedPath)) {
        await fs.promises.unlink(resolvedPath);
      }
    }
  }
}
