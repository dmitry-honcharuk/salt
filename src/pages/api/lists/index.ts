import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { createListUsecaseFactory } from 'core/use-cases/createList';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().use(authorized()).post(createList);

async function createList(req: NextApiRequest, res: NextApiResponse) {
  const {
    body: { name: nameQuery },
    user,
  } = req;

  const name = normalizeQueryParam(nameQuery);

  const createList = createListUsecaseFactory({ listRepository });

  const list = await createList({
    name,
    creator: user,
  });

  res.json(list);
}
