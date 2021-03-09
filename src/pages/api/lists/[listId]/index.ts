import { buildGetListById } from 'core/use-cases/getListById';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';

export default createRoute().get(async (req, res) => {
  const { query } = req;

  const getList = buildGetListById({ listRepository });

  const list = await getList(query);

  return res.status(list ? 200 : 404).json(list);
});
