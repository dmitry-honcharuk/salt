import { authorized, listRepository } from 'app/dependencies';
import { createRoute } from 'app/utils/api/route';
import { NextFunction } from 'express';
import formidable, { File } from 'formidable';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import { PassThrough, Writable } from 'stream';
import { s3 } from '../../../../../app/implementations/services/s3';
import { UploadedFile } from '../../../../../app/types/uploadedFile';
import { normalizeQueryParam } from '../../../../../app/utils/normalizeQueryParam';
import { addItemUsecaseFactory } from '../../../../../core/use-cases/addItem';

function* makeRangeIterator<T>(total: number): Generator<T[], T[], T> {
  const results: T[] = [];

  for (let i = 0; i < total; i += 1) {
    results.push(yield results);
  }

  return results;
}

const upload =
  (fileFields: string[]) =>
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    let it: Generator<string[], string[], string>;

    const uploadStream = (file: File): Writable => {
      const pass = new PassThrough();
      const nameParts = file.originalFilename?.split('.') ?? [];

      s3.upload(
        {
          ACL: 'public-read',
          Bucket: 'prod',
          Key: [file.newFilename, nameParts[nameParts.length - 1]]
            .filter(Boolean)
            .join('.'),
          Body: pass,
        },
        (err, data) => {
          const files = req.files ? Object.values(req.files).flat() : [];

          files
            .filter(({ filepath }) => filepath === file.filepath)
            .forEach((parsedFile) => {
              parsedFile.location = data.Location;
            });

          const optionalParams = it.next(data.Location);

          if (optionalParams.done) {
            pass.end();

            next();
          }

          if (err) {
            console.log('FILE UPLOAD ERROR');
            console.log(err);
          }
        }
      );

      return pass;
    };

    const form = formidable({
      multiples: true,
      fileWriteStreamHandler: <any>uploadStream,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log('PARSE ERROR');
        console.log(err);
        next(err);
        return;
      }

      const filesCount = Object.values(files).flat().length;

      req.body = fields;
      req.files =
        filesCount > 0
          ? fileFields.reduce<Record<string, UploadedFile[]>>(
              (result, field) => {
                const fieldFiles = files[field];

                return {
                  [field]: Array.isArray(fieldFiles)
                    ? fieldFiles
                    : [fieldFiles],
                };
              },
              {}
            )
          : {};

      if (filesCount > 0) {
        it = makeRangeIterator<string>(filesCount);
        it.next();
      } else {
        next();
      }
    });
  };

export default createRoute()
  .use(authorized())
  .use(upload(['files']))
  .post(createItem);

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { listId: listIdQuery },
    body: { content, done },
    user,
  } = req;

  const { files = [] } = req.files!;

  const listId = normalizeQueryParam(listIdQuery);

  const addItem = addItemUsecaseFactory({ listRepository });

  const item = await addItem({
    user: user,
    listId,
    content: Array.isArray(content) ? content[0] : content,
    done: done === 'true',
    images: <string[]>files.map(({ location }) => location).filter(Boolean),
  });

  res.json(item);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
