import formidable from 'formidable';

export type UploadedFile = formidable.File & { location?: string };
