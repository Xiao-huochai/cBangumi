const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const UPSTREAM_HEADERS_TO_STRIP = new Set([
  "access-control-allow-credentials",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-allow-origin",
  "access-control-expose-headers",
  "access-control-max-age",
  "access-control-request-headers",
  "access-control-request-method",
  "vary",
]);

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, "");
}

function getApiPath(event) {
  const prefix = "/.netlify/functions/api-proxy";
  const path = event.path.startsWith(prefix)
    ? event.path.slice(prefix.length)
    : event.path;

  if (path === "/api" || path.startsWith("/api/")) {
    return path;
  }

  return `/api${path.startsWith("/") ? path : `/${path}`}`;
}

function getRequestHeaders(headers) {
  const nextHeaders = {};

  for (const [name, value] of Object.entries(headers || {})) {
    const lowerName = name.toLowerCase();

    if (!HOP_BY_HOP_HEADERS.has(lowerName) && value) {
      nextHeaders[name] = value;
    }
  }

  return nextHeaders;
}

function getResponseHeaders(response) {
  const headers = {};

  response.headers.forEach((value, name) => {
    const lowerName = name.toLowerCase();

    if (
      !HOP_BY_HOP_HEADERS.has(lowerName) &&
      !UPSTREAM_HEADERS_TO_STRIP.has(lowerName) &&
      lowerName !== "set-cookie"
    ) {
      headers[name] = value;
    }
  });

  return headers;
}

function getQueryString(event) {
  if (event.rawQuery) {
    return event.rawQuery;
  }

  const searchParams = new URLSearchParams();
  const multiValueParams = event.multiValueQueryStringParameters || {};

  for (const [name, values] of Object.entries(multiValueParams)) {
    for (const value of values || []) {
      if (value !== undefined && value !== null) {
        searchParams.append(name, value);
      }
    }
  }

  const singleValueParams = event.queryStringParameters || {};

  for (const [name, value] of Object.entries(singleValueParams)) {
    if (
      value !== undefined &&
      value !== null &&
      !Object.prototype.hasOwnProperty.call(multiValueParams, name)
    ) {
      searchParams.append(name, value);
    }
  }

  return searchParams.toString();
}

exports.handler = async (event) => {
  const apiOrigin = process.env.API_ORIGIN;

  if (!apiOrigin) {
    return {
      statusCode: 500,
      body: "Missing API_ORIGIN environment variable.",
    };
  }

  const queryString = getQueryString(event);
  const query = queryString ? `?${queryString}` : "";
  const targetUrl = `${normalizeOrigin(apiOrigin)}${getApiPath(event)}${query}`;
  const method = event.httpMethod;
  const hasBody = method !== "GET" && method !== "HEAD" && event.body;

  const response = await fetch(targetUrl, {
    method,
    headers: getRequestHeaders(event.headers),
    body: hasBody
      ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
      : undefined,
  });

  const body = Buffer.from(await response.arrayBuffer());
  const headers = {
    ...getResponseHeaders(response),
    "cache-control": "no-store",
  };
  const setCookie = typeof response.headers.getSetCookie === "function"
    ? response.headers.getSetCookie()
    : [];

  return {
    statusCode: response.status,
    headers,
    multiValueHeaders: setCookie.length ? { "set-cookie": setCookie } : undefined,
    body: body.toString("base64"),
    isBase64Encoded: true,
  };
};
