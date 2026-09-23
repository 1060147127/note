import { createHash, randomBytes } from "crypto";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";

function storageRoot() {
  return path.resolve(process.env.STORAGE_DIR || "./storage");
}

export function fileHash(buf: Buffer) {
  return createHash("sha256").update(buf).digest("hex");
}

export async function saveObject(subdir: string, filename: string, data: Buffer) {
  const key = `${subdir}/${Date.now()}-${randomBytes(6).toString("hex")}-${filename}`;
  const full = path.join(storageRoot(), key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  return { storageKey: key, hash: fileHash(data), size: data.length };
}

export async function readObject(storageKey: string) {
  const full = path.join(storageRoot(), storageKey);
  return readFile(full);
}
