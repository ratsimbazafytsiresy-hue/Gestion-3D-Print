import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv, hasSupabaseEnv } from "./env";

const PUBLIC_PATHS = ["/login"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!hasSupabaseEnv()) {
    return response;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  response.headers.set("Cache-Control", "private, no-store");

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    return redirectToLogin(request, response);
  }

  return response;
}

function isProtectedPath(pathname: string) {
  return !PUBLIC_PATHS.some((publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`));
}

function redirectToLogin(request: NextRequest, response: NextResponse) {
  const loginUrl = request.nextUrl.clone();
  const redirectedFrom = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("redirectedFrom", redirectedFrom);

  const redirectResponse = NextResponse.redirect(loginUrl);

  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  for (const header of ["Cache-Control", "Expires", "Pragma"]) {
    const value = response.headers.get(header);

    if (value) {
      redirectResponse.headers.set(header, value);
    }
  }

  return redirectResponse;
}
