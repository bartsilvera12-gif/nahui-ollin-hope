import sharp from "sharp";
import { readdir, stat, readFile, writeFile, unlink } from "node:fs/promises";
import { join, parse } from "node:path";

const DIR = "public/img-cartas-referenciales";
const MAX_W = 1600;
const QUALITY = 82;
const THRESHOLD = 400 * 1024;

const files = (await readdir(DIR)).filter((f) =>
  /\.(jpe?g|webp|png)$/i.test(f),
);

for (const f of files) {
  const src = join(DIR, f);
  const before = (await stat(src)).size;
  if (before < THRESHOLD) {
    console.log(`skip ${f} (${(before / 1024).toFixed(0)}KB)`);
    continue;
  }
  const { name } = parse(f);
  const buf = await readFile(src);
  const out = await sharp(buf)
    .rotate()
    .resize({ width: MAX_W, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();
  if (f !== `${name}.jpg`) await unlink(src);
  const finalPath = join(DIR, `${name}.jpg`);
  await writeFile(finalPath, out);
  console.log(
    `${f} -> ${name}.jpg  ${(before / 1024 / 1024).toFixed(2)}MB -> ${(out.length / 1024).toFixed(0)}KB`,
  );
}
