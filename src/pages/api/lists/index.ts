import { listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { buildCreateList } from 'core/use-cases/createList';
import { buildGetLists } from 'core/use-cases/getLists';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().get(getAllLists).post(createList);

async function getAllLists(req: NextApiRequest, res: NextApiResponse) {
  const getLists = buildGetLists({ listRepository });

  res.json(await getLists());
}

async function createList(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  const createList = buildCreateList({ listRepository });

  const list = await createList(body);

  res.json(list);
}
