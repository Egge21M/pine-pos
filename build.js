#!/usr/bin/env node

const esbuild = require("esbuild");

esbuild
  .build({
    outdir: "dist/",
    format: "cjs",
    platform: "node",
    entryPoints: ["src/index.ts"],
    bundle: true,
    sourcemap: "linked",
  })
  .then(() => {
    console.log("Server built sucessfully");
  });
