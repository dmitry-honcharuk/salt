import { authorized, listRepository } from '../../../app/dependencies';
import { createRoute } from '../../../app/utils/api/route';
import { participateListUsecaseFactory } from '../../../core/use-cases/participate';

export default createRoute()
  .use(authorized())
  .put(async (req, res) => {
    const {
      body: { token },
      user,
    } = req;


    const participate = participateListUsecaseFactory({ listRepository });
    const listId = await participate({ token, currentUserId: user?.id });

    res.json({
        listId,
    });
  });
