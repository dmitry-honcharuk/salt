import { buildUpdateItemContent } from 'core/use-cases/updateItemContent';
import { listRepository } from 'dependencies';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().put(async (req, res) => {
  const {
    query: { listId, itemId },
    body: { content },
  } = req;

  const updatedItem = await buildUpdateItemContent({ listRepository })({
    listId: normalizeQueryParam(listId),
    itemId: normalizeQueryParam(itemId),
    content,
  });

  res.json(updatedItem);
});
