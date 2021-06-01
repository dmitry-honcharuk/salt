export interface ItemEntity {
  id: string;
  content: string;
  done: boolean;
  doneAt?: number | null;
  createdAt: number;
}
