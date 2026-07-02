export interface IStorageService {
  /**
   * Uploads a file buffer or File object to the storage provider
   * @param file The file content (Buffer or File object)
   * @param filename The original filename
   * @param folder Optional directory or folder pathway
   * @returns The public URL of the uploaded file
   */
  uploadFile(file: Buffer | File, filename: string, folder?: string): Promise<string>;

  /**
   * Deletes a file from the storage provider using its URL
   * @param fileUrl The public URL of the file to delete
   */
  deleteFile(fileUrl: string): Promise<void>;
}
