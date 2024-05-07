import type http from "http";
import { CookiesManager, response } from "../../../core";
// import { response } from "../../../core";
import { SWA_CLI_APP_PROTOCOL } from "../../../core/constants";

export default async function (context: Context, req: http.IncomingMessage) {
  const headers = req?.headers;
  const host = headers ? headers["x-forwarded-host"] || headers.host : undefined;
  if (!host) {
    context.res = response({
      context,
      status: 500,
    });
    return;
  }

  const uri = `${headers["x-forwarded-proto"] || SWA_CLI_APP_PROTOCOL}://${host}`;
  const query = new URL(req?.url || "", uri).searchParams;
  const location = `${uri}${query.get("post_logout_redirect_uri") || "/"}`;

  const cookiesManager = new CookiesManager(req.headers.cookie);
  cookiesManager.addCookieToDelete("StaticWebAppsAuthCookie");

  context.res = response({
    context,
    status: 302,
    cookies: cookiesManager.getCookies(),
    headers: {
      Location: location,
    },
  });
}
