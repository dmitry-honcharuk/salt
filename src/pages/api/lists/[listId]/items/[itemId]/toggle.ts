import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { toggleItemUsecaseFactory } from 'core/use-cases/toggleItem';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().put(toggleItem);

async function toggleItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;
  const authService = appAuthServiceFactory(req, res);

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updateItem = toggleItemUsecaseFactory({
    authService,
    listRepository,
  });

  const updatedItem = await updateItem({ listId, itemId });

  res.json(updatedItem);
}
