import { buildToggleItem } from 'core/use-cases/toggleItem';
import { listRepository } from 'dependencies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

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
