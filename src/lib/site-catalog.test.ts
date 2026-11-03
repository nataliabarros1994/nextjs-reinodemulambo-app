import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { catalogPriceTable } from "../data/services.js";
import { offerCatalogJsonLd, pathToServicePage, priceBRL, SITE_URL } from "./offers-schema.ts";
import { isServiceLandingId, SERVICE_LANDING_IDS, serviceLandings } from "./service-landings.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

describe("landings e JSON-LD", () => {
  it("tem landing para cada oferta pública, com o preço certo", () => {
    assert.deepEqual([...SERVICE_LANDING_IDS], catalogPriceTable.map((item: { id: string }) => item.id));
    for (const item of catalogPriceTable) {
      assert.equal(isServiceLandingId(item.id), true);
      const landing = serviceLandings[item.id as keyof typeof serviceLandings];
      assert.ok(landing.h1);
      assert.match(landing.seoTitle, /Reino de Mulambo/);
      assert.equal(pathToServicePage(item.id), `/servicos/${item.id}`);
      assert.equal(priceBRL(item.amountCents), (item.amountCents / 100).toFixed(2));
    }
    const catalog = offerCatalogJsonLd();
    assert.equal(catalog.itemListElement.length, 6);
    assert.equal(catalog.itemListElement[0].priceCurrency, "BRL");
    assert.equal(catalog.itemListElement[0].url, `${SITE_URL}/servicos/taro-texto`);
    assert.equal(catalog.itemListElement[0].price, "60.00");
    assert.equal(catalog.itemListElement[5].price, "400.00");
  });
});

describe("código morto Stripe e Calendly", () => {
  it("não resta identificador de Stripe ou Calendly em app/ e src/", async () => {
    const roots = [path.join(ROOT, "app"), path.join(ROOT, "src")];
    const hits: string[] = [];
    const skip = new Set(["node_modules", ".next", "dist"]);

    async function walk(dir: string) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        if (skip.has(entry.name) || entry.name.endsWith(".test.ts")) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
          continue;
        }
        if (!/\.(ts|tsx|js|jsx|css)$/.test(entry.name)) continue;
        const text = await readFile(full, "utf8");
        if (/\bstripe\b|calendly/i.test(text)) hits.push(path.relative(ROOT, full));
      }
    }

    for (const dir of roots) await walk(dir);
    assert.deepEqual(hits, []);
  });
});
