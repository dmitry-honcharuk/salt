import { emit } from 'backend/socket/client';
import { buildUpdateItemContent } from 'core/use-cases/updateItemContent';
import { listRepository } from 'dependencies';
import { ItemContentChangedEvent, TOPICS } from 'types/socket';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().put(async (req, res) => {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
    body: { content },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updatedItem = await buildUpdateItemContent({ listRepository })({
    listId,
    itemId,
    content,
  });

  console.log({
    listId,
    itemId,
    content,
  });

  emit<ItemContentChangedEvent>(TOPICS.ITEM_CONTENT_CHANGED, {
    listId,
    itemId,
    content,
  });

  res.json(updatedItem);
});
