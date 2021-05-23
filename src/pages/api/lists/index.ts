import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { normalizeQueryParam } from 'app/utils/normalizeQueryParam';
import { createListUsecaseFactory } from 'core/use-cases/createList';
import { NextApiRequest, NextApiResponse } from 'next';
import { getListsUsecaseFactory } from '../../../core/use-cases/getLists';

export default createRoute().use(authorized()).get(getLists).post(createList);

async function getLists(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req;

  const getLists = getListsUsecaseFactory({
    listRepository,
  });

  res.json(await getLists({ user }));
}

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
