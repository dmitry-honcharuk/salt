import { createRoute } from 'app/utils/api/route';
import { NextApiRequest, NextApiResponse } from 'next';
import { authorized, listRepository } from '../../../../app/dependencies';
import { normalizeQueryParam } from '../../../../app/utils/normalizeQueryParam';
import { generateShareTokenFactory } from '../../../../core/use-cases/generateShareToken';

export default createRoute().use(authorized()).get(generateShareToken);

async function generateShareToken(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    user,
  } = req;

  const listId = normalizeQueryParam(listIdQuery);

  const token = await generateShareTokenFactory({ listRepository })({
    listId,
    currentUserId: user?.id,
  });

  res.json({ token });
}
