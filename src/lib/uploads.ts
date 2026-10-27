import path from "node:path";

/** Folder for uploaded images when no Blob store is configured: UPLOAD_DIR (a mounted volume) or .uploads locally. */
export const uploadDir = () => path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || ".uploads");
