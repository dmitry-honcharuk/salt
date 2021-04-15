import { authorized, listRepository } from '../../../../app/dependencies';
import { createRoute } from '../../../../app/utils/api/route';
import { normalizeQueryParam } from '../../../../app/utils/normalizeQueryParam';
import { shareListUsecaseFactory } from '../../../../core/use-cases/shareList';

export default createRoute()
  .use(authorized())
  .get(async (req, res) => {
    const {
      query: { listId: listIdQuery },
      user,
    } = req;

    const listId = normalizeQueryParam(listIdQuery);

    const shareList = shareListUsecaseFactory({ listRepository });

    await shareList({ listId, currentUserId: user?.id });

    res.json({
      success: true,
    });
  });
