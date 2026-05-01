// Static-export build helper for GitHub Pages.
//
// Why a script: Next.js' `output: 'export'` is incompatible with
// middleware, route handlers, and Server Actions. We temporarily
// move every server-only file out of /src, run `next build`, then
// restore them — so the dev / Vercel build keeps working while the
// static export only ships the public pages.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const STASH = join(ROOT, ".static-stash");

// Paths that crash a static export — middleware, API routes, anything
// using "use server" or auth/DB at request time.
const SERVER_ONLY = [
  "src/middleware.ts",
  "src/app/api",
  "src/app/admin",
  "src/app/mon-compte",
  "src/app/connexion",
  "src/app/creer-un-compte",
];

function stashFiles() {
  if (existsSync(STASH)) {
    rmSync(STASH, { recursive: true, force: true });
  }
  mkdirSync(STASH, { recursive: true });
  for (const rel of SERVER_ONLY) {
    const src = join(ROOT, rel);
    if (!existsSync(src)) continue;
    const dest = join(STASH, rel);
    mkdirSync(dirname(dest), { recursive: true });
    renameSync(src, dest);
    console.log(`  stashed ${rel}`);
  }
}

function restoreFiles() {
  if (!existsSync(STASH)) return;
  for (const rel of SERVER_ONLY) {
    const stashed = join(STASH, rel);
    if (!existsSync(stashed)) continue;
    const dest = join(ROOT, rel);
    mkdirSync(dirname(dest), { recursive: true });
    renameSync(stashed, dest);
    console.log(`  restored ${rel}`);
  }
  rmSync(STASH, { recursive: true, force: true });
}

// `out/` will become the static site. GitHub Pages requires a
// .nojekyll file at root to keep folders starting with _ (like
// _next/) from being filtered out.
function addNojekyll() {
  const out = join(ROOT, "out");
  if (!existsSync(out)) return;
  writeFileSync(join(out, ".nojekyll"), "");
}

let exitCode = 0;
try {
  console.log("→ Stashing server-only files");
  stashFiles();

  console.log("→ Running next build (BUILD_STATIC=1)");
  const nextBin = join(
    ROOT,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  const result = spawnSync(process.execPath, [nextBin, "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      BUILD_STATIC: "1",
      DEMO_MODE: "1",
      // A dummy URI so any stray DB import doesn't blow up at module load
      // (lib/db.ts is already lazy, but other env-dependent imports stay safe).
      MONGODB_URI: process.env.MONGODB_URI ?? "mongodb://placeholder/",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "static-build-placeholder",
    },
  });
  exitCode = result.status ?? 1;

  if (exitCode === 0) {
    addNojekyll();
    console.log("→ Static export ready in ./out");
  }
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  console.log("→ Restoring server-only files");
  restoreFiles();
}

process.exit(exitCode);
