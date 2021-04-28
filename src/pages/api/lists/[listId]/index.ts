import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { removeListUsecaseFactory } from 'core/use-cases/removeList';
import { updateListNameUsecaseFactory } from 'core/use-cases/updateListName';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute()
  .use(authorized())
  .patch(updateItemName)
  .delete(removeList);

async function updateItemName(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { name },
    user,
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const updateListName = updateListNameUsecaseFactory({
    listRepository,
  });

  const updatedList = await updateListName({ listId, name, creator: user });

  res.json(updatedList);
}

async function removeList(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    user,
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  await removeListUsecaseFactory({ listRepository })({ listId, creator: user });

  return res.json({});
}
