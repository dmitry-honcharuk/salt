import { CoreError } from 'core/errors/CoreError';
import { NextApiRequest, NextApiResponse } from 'next';
import createHandler from 'next-connect';

export const route = createHandler<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    if (err instanceof CoreError) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  },
});
