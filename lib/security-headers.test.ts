import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

/**
 * The site proxies every unmatched path to app.preventli.ai (see the fallback
 * rewrite in next.config.ts). Vercel applies `headers` rules to proxied
 * responses too, *overwriting* whatever the app sent — so a blanket `/(.*)`
 * rule silently replaces the app's own security headers.
 *
 * That is not hypothetical: a blanket `X-Frame-Options: DENY` overrode the
 * app's `SAMEORIGIN`, which broke the same-origin PDF/questionnaire iframes on
 * the partner approval screen for everyone arriving via preventli.ai.
 *
 * Rule: the proxy sets headers only on responses this repo actually generates.
 */

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

type HeaderRule = { source: string; headers: { key: string; value: string }[] };

const vercelConfig: { headers: HeaderRule[] } = JSON.parse(
  readFileSync(join(repoRoot, "vercel.json"), "utf8"),
);

/**
 * Minimal path-to-regexp subset covering the syntax used in vercel.json:
 * literals, `:name`, `:name(a|b)` and `:name*`.
 */
function sourceToRegExp(source: string): RegExp {
  const pattern = source
    .split("/")
    .map((segment) => {
      if (!segment.startsWith(":")) {
        return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      const alternation = segment.match(/^:\w+\((.+)\)$/);
      if (alternation) {
        const options = alternation[1]
          .split("|")
          .map((option) => option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        return `(?:${options.join("|")})`;
      }
      if (segment.endsWith("*")) return ".*";
      return "[^/]+";
    })
    .join("/");
  return new RegExp(`^${pattern}$`);
}

function matchingRules(path: string): HeaderRule[] {
  return vercelConfig.headers.filter((rule) => sourceToRegExp(rule.source).test(path));
}

/** Routes this repo serves itself, derived from the App Router tree. */
function ownRoutes(): string[] {
  const routes: string[] = [];
  const walk = (dir: string, urlPath: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        // Dynamic segments ([id]) get a concrete stand-in value.
        const segment = entry.name.startsWith("[") ? "sample-value" : entry.name;
        walk(join(dir, entry.name), `${urlPath}/${segment}`);
      } else if (entry.name === "page.tsx" || entry.name === "route.ts") {
        routes.push(urlPath === "" ? "/" : urlPath);
      }
    }
  };
  walk(join(repoRoot, "app"), "");
  return routes;
}

describe("vercel.json security headers", () => {
  it("covers every route this repo serves", () => {
    const uncovered = ownRoutes().filter((route) => matchingRules(route).length === 0);
    expect(uncovered).toEqual([]);
  });

  it("covers the generated metadata and static asset routes", () => {
    for (const path of ["/robots.txt", "/sitemap.xml", "/welcome/intro.mp4"]) {
      expect(matchingRules(path).length, path).toBeGreaterThan(0);
    }
  });

  /**
   * The regression guard. These paths are served by the app behind the proxy,
   * so the app's own helmet config — not this repo — must decide their headers.
   */
  it("never sets headers on paths proxied to app.preventli.ai", () => {
    const proxiedPaths = [
      "/login",
      "/dashboard",
      "/partner/approvals/e3ee3b1a-5900-441f-97d8-8d32e86bacf2",
      "/api/partner/checks/sample-value/medical-report.pdf",
      "/api/health",
      "/api/auth/user",
    ];
    for (const path of proxiedPaths) {
      const stamped = matchingRules(path).flatMap((rule) => rule.headers.map((h) => h.key));
      expect(stamped, `${path} must inherit the app's headers`).toEqual([]);
    }
  });

  it("does not reintroduce a catch-all rule", () => {
    const catchAlls = vercelConfig.headers
      .map((rule) => rule.source)
      .filter((source) => /^\/\(?\.?\*/.test(source) || source === "/:path*");
    expect(catchAlls).toEqual([]);
  });
});
