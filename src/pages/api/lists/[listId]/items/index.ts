import { buildAddItem } from 'core/use-cases/addItem';
import { listRepository } from 'dependencies';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().post(createItem);

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { content, done },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const addItem = buildAddItem({ listRepository });

  const item = await addItem({
    listId,
    content,
    done,
  });

  res.json(item);
}
