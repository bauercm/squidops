/**
 * Seeds 3 sample products (one per line) and uploads their sample files to Storage.
 * Idempotent: products upsert on slug, files upsert on storage_path.
 *
 *   npm run seed            # uses .env.local
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PRODUCT_FILES_BUCKET, type ProductLine } from "../lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const FILES_DIR = join(__dirname, "..", "supabase", "seed-files");

type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description_md: string;
  price_cents: number;
  line: ProductLine;
  lead_url: string;
  files: { file: string; label: string }[];
};

const products: SeedProduct[] = [
  {
    slug: "azure-landing-zone-toolkit",
    name: "Azure Landing Zone Toolkit",
    tagline: "Bicep modules and policy baselines for a production-ready Azure foundation.",
    description_md: `Stand up a hub-and-spoke landing zone in an afternoon instead of a quarter.

The toolkit packages the Bicep modules, Azure Policy assignments, and naming conventions
I use on every new tenant, with a runbook that walks you from empty subscription to
governed platform.

## Who it's for

Platform engineers who need guardrails in place before app teams arrive.`,
    price_cents: 4900,
    line: "toolkit",
    lead_url: "/blog/tagging-policy-that-sticks",
    files: [
      { file: "README.md", label: "Start here" },
      { file: "policy-baseline.md", label: "Policy baseline" },
    ],
  },
  {
    slug: "azure-openai-in-production",
    name: "Azure OpenAI in Production",
    tagline: "A self-paced course on shipping LLM features on Azure without surprises.",
    description_md: `Go from a notebook demo to a monitored, rate-limited, cost-capped production service.

Covers private networking, managed identity, content filtering, evaluation, and the
observability you need to sleep at night.

## Format

Written modules with diagrams and a workbook of exercises. Lifetime updates.`,
    price_cents: 14900,
    line: "course",
    lead_url: "/blog/azure-openai-429s",
    files: [
      { file: "module-01-architecture.md", label: "Module 1: Reference architecture" },
      { file: "workbook.md", label: "Course workbook" },
    ],
  },
  {
    slug: "cost-sentinel-agent",
    name: "Cost Sentinel Agent",
    tagline: "An AI agent that watches Azure spend and explains anomalies in plain English.",
    description_md: `Cost Sentinel reads Cost Management exports daily, flags anomalies against your
baseline, and posts a short explanation of *what changed and why* to Teams or Slack.

Runs in your tenant as an Azure Function with a managed identity. No data leaves your
subscription except the model call you configure.`,
    price_cents: 7900,
    line: "agent",
    lead_url: "/blog/tagging-policy-that-sticks",
    files: [
      { file: "SETUP.md", label: "Setup guide" },
      { file: "agent-config.yaml", label: "Agent config template" },
    ],
  },
];

async function main() {
  for (const p of products) {
    const { files, ...row } = p;
    const { data: product, error } = await supabase
      .from("products")
      .upsert({ ...row, status: "live", version: "1.0.0" }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw error;

    const available = new Set(readdirSync(join(FILES_DIR, p.slug)));
    for (const [i, f] of files.entries()) {
      if (!available.has(f.file)) throw new Error(`Missing seed file ${p.slug}/${f.file}`);
      const storagePath = `${p.slug}/${f.file}`;
      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_FILES_BUCKET)
        .upload(storagePath, readFileSync(join(FILES_DIR, p.slug, f.file)), {
          upsert: true,
          contentType: "text/plain",
        });
      if (uploadError) throw uploadError;

      const { error: fileError } = await supabase.from("product_files").upsert(
        { product_id: product.id, storage_path: storagePath, label: f.label, sort_order: i },
        { onConflict: "storage_path" },
      );
      if (fileError) throw fileError;
    }
    console.log(`seeded ${p.slug} (${files.length} files)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
