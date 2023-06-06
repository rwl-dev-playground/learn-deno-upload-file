import { Hono, HTTPException } from "hono/mod.ts";
import { BodyData } from "hono/utils/body.ts";
import { serve } from "std/http/mod.ts";
import { Status } from "std/http/http_status.ts";
import { extname } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import "std/dotenv/load.ts";

const app = new Hono();

interface BodyParams extends BodyData {
  title: string;
  image: File;
}

interface JsonResponse {
  status: Status;
  detail: string;
  message: string;
}

app.get("/:slug{.+$}", async (ctx) => {
  const slug = ctx.req.param("slug");

  const response = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${
      Deno.env.get("PROJECT_ID")
    }/o/${encodeURIComponent(slug)}?alt=media`,
    {
      headers: {
        // TODO: [Google Developers OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)でJSON APIのアクセストークンが発行できるが、かなり有限
        "Authorization": `Bearer ${Deno.env.get("ACCESS_TOKEN")}`,
      },
    },
  );

  if (response.status !== Status.OK) {
    throw new HTTPException(response.status, { message: response.statusText });
  }

  return ctx.body(await response.arrayBuffer(), Status.OK, {
    "Content-Type": contentType(extname(slug)) || contentType(".txt"),
  });
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

  // TODO: Google Cloud StorageのJSON APIだとアクセストークンの期限が短いので、POST実装の確認は一旦しない

  return ctx.body(await body.image.arrayBuffer());
});

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return ctx.json<JsonResponse>({
      status: err.status,
      detail: "100000",
      message: err.message,
    }, err.status);
  }
  return ctx.json<JsonResponse>({
    status: Status.InternalServerError,
    detail: "999999",
    message:
      "予期しないエラーが発生しました。サーバー管理者に問い合わせてください。",
  }, Status.InternalServerError);
});

serve(app.fetch, { port: 8080 });
