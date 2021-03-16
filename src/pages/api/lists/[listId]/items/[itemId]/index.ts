import { buildUpdateItemContent } from 'core/use-cases/updateItemContent';
import { listRepository } from 'dependencies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().put(updateContent);

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
