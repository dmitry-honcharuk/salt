import { authorized, listRepository, s3FileStorage } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { removeItemUsecaseFactory } from 'core/use-cases/removeItem';
import { updateItemContentUsecaseFactory } from 'core/use-cases/updateItemContent';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute()
  .use(authorized())
  .put(updateContent)
  .delete(removeItem);

async function updateContent(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
    body: { content },
    user,
  } = req;
  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updateContent = updateItemContentUsecaseFactory({
    listRepository,
  });

  const updatedItem = await updateContent({
    listId,
    itemId,
    content,
    user,
  });

  res.json(updatedItem);
}

async function removeItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
    user,
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  await removeItemUsecaseFactory({
    listRepository,
    fileStorage: s3FileStorage,
  })({
    listId,
    itemId,
    user: user,
  });

  res.json({});
}
