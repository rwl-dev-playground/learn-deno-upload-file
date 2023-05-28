/** @jsx jsx */
import { Hono } from "hono/mod.ts";
import { jsx } from "hono/middleware.ts";
import { serve } from "std/http/mod.ts";

const app = new Hono();

type LayoutProps = {
  children?: string;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
};

app.get("/", (ctx) => {
  return ctx.html(
    <Layout>
      <form
        method="post"
        action="http://localhost:8080"
        enctype="multipart/form-data"
      >
        <label htmlFor="title">title:</label>
        <input type="text" name="title" id="title" />
        <input type="file" name="image" id="" />
        <button type="submit">送信</button>
      </form>
    </Layout>,
  );
});

serve(app.fetch, { port: 8000 });
