import { Hono, HTTPException } from "hono/mod.ts";
import { BodyData } from "hono/utils/body.ts";
import { serve } from "std/http/mod.ts";
import { Status } from "std/http/http_status.ts";

const app = new Hono();
const kv = await Deno.openKv();

interface BodyParams extends BodyData {
  title: string;
  image: File;
}

interface JsonResponse {
  status: Status;
  detail: string;
  message: string;
}

app.get("/:slug", async (ctx) => {
  const slug = ctx.req.param("slug");
  // TODO: 取得するものがないので試せてない
  const image = await kv.get<ArrayBuffer>([slug]);

  return ctx.body(image.value);
});

app.post("/", async (ctx) => {
  const body = await ctx.req.parseBody() as BodyParams;

  console.debug({
    title: body.title,
    image: {
      name: body.image.name,
      size: body.image.size,
      type: body.image.type,
      last_modified: Intl.DateTimeFormat("ja-JP", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "Asia/Tokyo",
      }).format(new Date(body.image.lastModified)),
    },
  });

  // TODO: 65KBの画像は多分そうそうないので、Deno KVに画像を入れるのは無理筋
  kv.set([body.image.name], await body.image.arrayBuffer());

  return ctx.body(await body.image.arrayBuffer());
});

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return ctx.json<JsonResponse>({
      status: err.status,
      detail: "100000",
      message: err.message,
    });
  }
  return ctx.json<JsonResponse>({
    status: Status.InternalServerError,
    detail: "999999",
    message:
      "予期しないエラーが発生しました。サーバー管理者に問い合わせてください。",
  });
});

serve(app.fetch, { port: 8080 });
