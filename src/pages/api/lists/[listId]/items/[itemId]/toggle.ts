import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { toggleItemUsecaseFactory } from 'core/use-cases/toggleItem';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().use(authorized()).put(toggleItem);

async function toggleItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    user,
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;
  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updateItem = toggleItemUsecaseFactory({
    listRepository,
  });

  const updatedItem = await updateItem({ listId, itemId, creator: user });

  res.json(updatedItem);
}
