import { emit } from 'backend/socket/client';
import { buildToggleItem } from 'core/use-cases/toggleItem';
import { listRepository } from 'dependencies';
import { ItemToggledEvent, TOPICS } from 'types/socket';
import { createRoute } from 'utils/api/route';
import { normalizeQueryParam } from 'utils/normalizeQueryParam';

export default createRoute().put(async (req, res) => {
  const {
    query: { listId: listIdQuery, itemId: itemIdQuery },
  } = req;

  const listId = normalizeQueryParam(listIdQuery);
  const itemId = normalizeQueryParam(itemIdQuery);

  const updatedItem = await buildToggleItem({ listRepository })({
    listId,
    itemId,
  });

  emit<ItemToggledEvent>(TOPICS.ITEM_TOGGLED, {
    listId,
    itemId,
    done: updatedItem.done,
  });

  res.json(updatedItem);
});
