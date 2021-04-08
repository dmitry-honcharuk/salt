import { listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { buildToggleItem } from 'core/use-cases/toggleItem';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().put(toggleItem);

async function toggleItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updatedItem = await buildToggleItem({ listRepository })({
    listId,
    itemId,
  });

  res.json(updatedItem);
}
