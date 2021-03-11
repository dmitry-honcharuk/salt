import { buildAddItem } from 'core/use-cases/addItem';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().post(async (req, res) => {
  const {
    query: { listId },
    body: { content },
  } = req;

  const addItem = buildAddItem({ listRepository });

  const item = await addItem({
    listId: normalizeQueryParam(listId),
    content: content,
  });

  res.json(item);
});
