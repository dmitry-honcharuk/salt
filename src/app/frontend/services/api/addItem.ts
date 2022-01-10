import { post } from 'app/implementations/services/request-client';
import { ItemEntity } from 'core/entities/Item';

export const addItem = (options: {
  listId: string;
  content: string;
  done: boolean;
  files?: File[];
}): Promise<ItemEntity> => {
  const formData = new FormData();

  formData.set('content', options.content);
  formData.set('done', `${options.done}`);

  options.files?.forEach((file) => formData.append('files', file, file.name));

  return post(`/api/lists/${options.listId}/items`, formData);
};
