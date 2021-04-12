import { listRepository } from 'app/dependencies';
import { authServiceFactory } from 'app/implementations/services/authService';
import { cookieServiceFactory } from 'app/implementations/services/cookieService';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { removeItemUsecaseFactory } from 'core/use-cases/removeItem';
import { updateItemContentUsecaseFactory } from 'core/use-cases/updateItemContent';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().put(updateContent).delete(removeItem);

async function updateContent(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
    body: { content },
  } = req;
  const cookeService = cookieServiceFactory(req, res);
  const authService = authServiceFactory(cookeService);

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updateContent = updateItemContentUsecaseFactory({
    authService,
    listRepository,
  });

  const updatedItem = await updateContent({
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
  const cookeService = cookieServiceFactory(req, res);
  const authService = authServiceFactory(cookeService);

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  await removeItemUsecaseFactory({ authService, listRepository })({
    listId,
    itemId,
  });

  res.json({});
}
