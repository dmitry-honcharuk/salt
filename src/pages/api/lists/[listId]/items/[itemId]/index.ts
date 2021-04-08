import { listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { buildRemoveItem } from 'core/use-cases/removeItem';
import { buildUpdateItemContent } from 'core/use-cases/updateItemContent';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().put(updateContent).delete(removeItem);

async function updateContent(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
    body: { content },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updatedItem = await buildUpdateItemContent({ listRepository })({
    listId,
    itemId,
    content,
  });

  res.json(updatedItem);
}

async function removeItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  await buildRemoveItem({ listRepository })({ listId, itemId });

  res.json({});
}
