import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { removeListUsecaseFactory } from 'core/use-cases/removeList';
import { updateListNameUsecaseFactory } from 'core/use-cases/updateListName';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().patch(updateItemName).delete(removeList);

async function updateItemName(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { name },
  } = req;
  const authService = appAuthServiceFactory(req, res);

  const listId = normalizeQueryParam(listIdQuery);

  const updateListName = updateListNameUsecaseFactory({
    authService,
    listRepository,
  });

  const updatedList = await updateListName({ listId, name });

  res.json(updatedList);
}

async function removeList(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
  } = req;
  const authService = appAuthServiceFactory(req, res);

  const listId = normalizeQueryParam(listIdQuery);

  await removeListUsecaseFactory({ authService, listRepository })({ listId });

  return res.json({});
}
