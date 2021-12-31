export interface ItemEntity {
  id: string;
  content: string;
  done: boolean;
  images?: string[];
  doneAt?: number | null;
  createdAt: number;
}
