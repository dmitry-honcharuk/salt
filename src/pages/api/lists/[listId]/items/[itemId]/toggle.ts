import { listRepository } from 'app/dependencies';
import { authServiceFactory } from 'app/implementations/services/authService';
import { cookieServiceFactory } from 'app/implementations/services/cookieService';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { toggleItemUsecaseFactory } from 'core/use-cases/toggleItem';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().put(toggleItem);

async function toggleItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;
  const cookeService = cookieServiceFactory(req, res);
  const authService = authServiceFactory(cookeService);

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updateItem = toggleItemUsecaseFactory({
    authService,
    listRepository,
  });

  const updatedItem = await updateItem({ listId, itemId });

  res.json(updatedItem);
}
