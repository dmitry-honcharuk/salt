import { listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { buildAddItem } from 'core/use-cases/addItem';
import { NextApiRequest, NextApiResponse } from 'next';

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
