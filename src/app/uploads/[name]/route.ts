import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadDir } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};

/** Serves admin-uploaded images from the upload folder. Names are generated on upload and never change. */
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  const type = TYPES[name.split(".").pop()?.toLowerCase() ?? ""];
  if (!type || name !== path.basename(name)) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(path.join(uploadDir(), name));
    return new Response(body, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
