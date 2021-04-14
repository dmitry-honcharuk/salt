import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { addItemUsecaseFactory } from 'core/use-cases/addItem';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().use(authorized()).post(createItem);

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { content, done },
    user,
  } = req;
  const listId = normalizeQueryParam(listIdQuery);

  const addItem = addItemUsecaseFactory({ listRepository });

  const item = await addItem({
    creator: user,
    listId,
    content,
    done,
  });

  res.json(item);
}
