'use server';

import * as fs from 'fs';
import path from 'path';

export async function getListFiles(pathOfFiles: string) {
  const postsDirectory = path.join(process.cwd(), `public/${pathOfFiles}`);
  const filenames = fs.readdirSync(postsDirectory);

  return filenames;
}
