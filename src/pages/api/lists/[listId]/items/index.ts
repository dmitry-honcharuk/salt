import { emit } from 'backend/socket/client';
import { buildAddItem } from 'core/use-cases/addItem';
import { listRepository } from 'dependencies';
import { ItemAddedEvent, TOPICS } from 'types/socket';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().post(async (req, res) => {
  const {
    query: { listId: listIdQuery },
    body: { content },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const addItem = buildAddItem({ listRepository });

  const item = await addItem({
    listId,
    content,
  });

  emit<ItemAddedEvent>(TOPICS.ITEM_ADDED, { listId, item });

  res.json(item);
});
