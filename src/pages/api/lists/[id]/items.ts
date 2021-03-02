import { buildAddItem } from 'core/use-cases/addItem';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';

export default createRoute().post(async (req, res) => {
  const { body } = req;

  const addItem = buildAddItem({ listRepo: listRepository });

  const item = await addItem(body);

  res.json(item);
});
