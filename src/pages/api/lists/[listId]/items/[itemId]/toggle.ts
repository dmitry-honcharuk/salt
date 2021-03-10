import { buildToggleItem } from 'core/use-cases/toggleItem';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';

export default createRoute().put(async (req, res) => {
  const { query } = req;

  const updatedItem = await buildToggleItem({ listRepository })(query);

  res.json(updatedItem);
});
