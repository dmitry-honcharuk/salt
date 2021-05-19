import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { changeOrderUsecaseFactory } from 'core/use-cases/changeOrder';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().use(authorized()).put(changeOrder);

async function changeOrder(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { itemIds },
    user,
  } = req;
  const listId = normalizeQueryParam(listIdQuery);

  const changeOrder = changeOrderUsecaseFactory({ listRepository });

  await changeOrder({
    user,
    listId,
    itemIds,
  });

  res.json({});
}
