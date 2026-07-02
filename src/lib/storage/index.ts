import { IStorageService } from "./types";
import { LocalStorageService } from "./local";

const getStorageProvider = (): IStorageService => {
  // Configured via environment variables to allow seamless switching
  const provider = process.env.STORAGE_PROVIDER || "local";

  switch (provider) {
    case "cloudinary":
      throw new Error("CloudinaryStorageService is not configured/implemented yet");
    case "s3":
      throw new Error("S3StorageService is not configured/implemented yet");
    case "local":
    default:
      return new LocalStorageService();
  }
};

export const storageService = getStorageProvider();
export type { IStorageService } from "./types";
