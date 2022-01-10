import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { randomBytes } from 'crypto';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { s3 } from '../../../../../app/implementations/services/s3';
import { UploadedFile } from '../../../../../app/types/uploadedFile';
import { normalizeQueryParam } from '../../../../../app/utils/normalizeQueryParam';
import { addItemUsecaseFactory } from '../../../../../core/use-cases/addItem';

const upload = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: 'prod',
    key: function (req, file, cb) {
      const nameParts = file.originalname.split('.');
      const extension = nameParts[nameParts.length - 1];

      cb(null, `${randomBytes(16).toString('hex')}.${extension}`);
    },
  }),
});

export default createRoute()
  .use(authorized())
  .use(upload.array('files'))
  .post(createItem);

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { content, done },
    user,
  } = req;

  const files = <UploadedFile[]>req.files;

  const listId = normalizeQueryParam(listIdQuery);

  const addItem = addItemUsecaseFactory({ listRepository });

  const item = await addItem({
    user: user,
    listId,
    content: Array.isArray(content) ? content[0] : content,
    done: done === 'true',
    images: files.map(({ location }) => location),
  });

  res.json(item);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
