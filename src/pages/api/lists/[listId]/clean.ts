import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { NextApiRequest, NextApiResponse } from 'next';
import { removeDoneItemsFactory } from '../../../../core/use-cases/removeDoneItems';

export default createRoute().use(authorized()).delete(clean);

async function clean(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    user,
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const removeDoneItems = removeDoneItemsFactory({ listRepository });

  const removedItemIds = await removeDoneItems({
    listId,
    user,
  });

  return res.json(removedItemIds);
}
