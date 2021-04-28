import { authorized, listRepository } from '../../../app/dependencies';
import { createRoute } from '../../../app/utils/api/route';
import { participateUsecaseFactory } from '../../../core/use-cases/participate';

export default createRoute()
  .use(authorized())
  .put(async (req, res) => {
    const {
      body: { token },
      user,
    } = req;

    const participate = participateUsecaseFactory({ listRepository });
    const listId = await participate({ token, currentUser: user });

    res.json({
      listId,
    });
  });
