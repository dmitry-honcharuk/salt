export interface FileStorage {
  deleteObjects(keys: string[]): Promise<void>;
}
