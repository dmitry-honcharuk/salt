import { buildGetListById } from 'core/use-cases/getListById';
import { buildUpdateListName } from 'core/use-cases/updateListName';
import { listRepository } from 'dependencies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().get(getList).patch(updateItemName);

async function getList(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;

  const getList = buildGetListById({ listRepository });

  const list = await getList(query);

  return res.status(list ? 200 : 404).json(list);
}

async function updateItemName(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { name },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const updateListName = buildUpdateListName({ listRepository });

  const updatedList = await updateListName({ listId, name });

  res.json(updatedList);
}
