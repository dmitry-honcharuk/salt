import { buildCreateList } from 'core/use-cases/createList';
import { buildGetLists } from 'core/use-cases/getLists';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';

export default createRoute()
  .get(async (req, res) => {
    const getLists = buildGetLists({ listRepository });

    res.json(await getLists());
  })
  .post(async (req, res) => {
    const { body } = req;

    const createList = buildCreateList({ listRepository });

    const list = await createList(body);

    res.json(list);
  });
