import { appAuthServiceFactory, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { createListUsecaseFactory } from 'core/use-cases/createList';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().post(createList);

async function createList(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  const authService = appAuthServiceFactory(req, res);

  const createList = createListUsecaseFactory({ listRepository, authService });

  const list = await createList(body);

  res.json(list);
}
