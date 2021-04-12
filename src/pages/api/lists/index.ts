import { listRepository } from 'app/dependencies';
import { authServiceFactory } from 'app/implementations/services/authService';
import { cookieServiceFactory } from 'app/implementations/services/cookieService';
import { createRoute } from 'app/utils/api/route';
import { createListUsecaseFactory } from 'core/use-cases/createList';
import { NextApiRequest, NextApiResponse } from 'next';

export default createRoute().post(createList);

async function createList(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;

  const cookeService = cookieServiceFactory(req, res);
  const authService = authServiceFactory(cookeService);

  const createList = createListUsecaseFactory({ listRepository, authService });

  const list = await createList(body);

  res.json(list);
}
