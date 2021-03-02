import { buildAddItem } from 'core/use-cases/addItem';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';

export default createRoute().post(async (req, res) => {
  const { body, query } = req;
  console.log({
    listId: Array.isArray(query.id) ? query.id.join() : query.id,
    content: body.content,
  });

  const addItem = buildAddItem({ listRepo: listRepository });

  const item = await addItem({
    listId: Array.isArray(query.id) ? query.id.join() : query.id,
    content: body.content,
  });

  res.json(item);
});
