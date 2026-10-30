// SPDX-FileCopyrightText: 2026 Marcus Baw
// SPDX-License-Identifier: MIT

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { load, dump } from "js-yaml";
import { configureSite } from "../eleventy.config.js";

test("isolated preview defers only missing review and unknown-year earnings (H1,H2,H3,H7,H10)", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fictional-preview-"));
  const practice = path.join(tmp, "practice");
  fs.cpSync("tests/fixtures/demo-practice", practice, { recursive: true });
  const file = path.join(practice, "practice.yaml");
  const data = load(fs.readFileSync(file, "utf8"));
  data.demo = false;
  data.site.custom_domain = "fictional.example.com";
  delete data.site.content_last_reviewed;
  delete data.gp_earnings.financial_year;
  delete data.gp_earnings.locum_gps;
  const save = () => fs.writeFileSync(file, dump(data));
  const run = (preview = true) =>
    spawnSync(
      process.execPath,
      [
        "node_modules/@11ty/eleventy/cmd.cjs",
        `--config=eleventy.${preview ? "preview.config" : "config"}.js`,
        `--output=${path.join(tmp, "output")}`,
      ],
      { env: { ...process.env, PRACTICE_DIR: practice }, encoding: "utf8" },
    );
  try {
    save();
    assert.equal(run().status, 0);
    const previousDir = process.env.PRACTICE_DIR;
    try {
      process.env.PRACTICE_DIR = practice;
      const noop = () => {};
      configureSite(
        {
          addGlobalData: (key, value) => {
            if (key === "practice") assert.equal(Object.hasOwn(value, "gp_earnings"), false);
          },
          addTemplate: noop,
          setLibrary: noop,
          addFilter: noop,
          addPassthroughCopy: noop,
          addWatchTarget: noop,
          addPlugin: noop,
          ignores: { add: noop },
        },
        { draftPreview: true },
      );
    } finally {
      if (previousDir === undefined) delete process.env.PRACTICE_DIR;
      else process.env.PRACTICE_DIR = previousDir;
    }
    const files = fs.readdirSync(path.join(tmp, "output"), { recursive: true });
    for (const f of files.filter((f) => f.endsWith(".html"))) {
      const html = fs.readFileSync(path.join(tmp, "output", f), "utf8");
      assert.equal((html.match(/Unofficial demo/g) ?? []).length, 1);
      assert.match(html, /Not approved by the practice/);
      assert.match(html, /noindex, nofollow/);
      assert.match(html, /data-safety="urgent-help"/);
      assert.match(html, /href="tel:999"/);
      assert.match(html, /href="tel:111"/);
      assert.doesNotMatch(html, /Website content last reviewed|<form\b|GP earnings/);
    }
    assert.ok(!files.includes("CNAME"));
    const production = run(false);
    assert.notEqual(production.status, 0);
    assert.match(production.stderr, /gp_earnings.financial_year/);
    assert.match(production.stderr, /gp_earnings.locum_gps/);
    assert.match(production.stderr, /site.content_last_reviewed/);
    assert.equal(load(fs.readFileSync(file, "utf8")).gp_earnings.locum_gps, undefined);
    data.gp_earnings.financial_year = "2025/26";
    save();
    assert.notEqual(run().status, 0, "known-year incomplete declaration must fail");
    data.gp_earnings.locum_gps = -1;
    save();
    assert.notEqual(run().status, 0, "invalid cohort count must fail");
    delete data.gp_earnings.financial_year;
    delete data.gp_earnings.locum_gps;
    for (const [change, restore] of [
      [
        () => {
          data.contact.phone = "invalid";
        },
        () => {
          data.contact.phone = "01632 960000";
        },
      ],
      [
        () => {
          data.site.content_last_reviewed = "not-a-date";
        },
        () => {
          delete data.site.content_last_reviewed;
        },
      ],
      [
        () => {
          data.gp_earnings.financial_year = "TODO";
        },
        () => {
          delete data.gp_earnings.financial_year;
        },
      ],
      [
        () => {
          data.opening_hours.monday = [];
        },
        () => {
          data.opening_hours.monday = [{ opens: "08:00", closes: "18:30" }];
        },
      ],
      [
        () => {
          data.online_services.online_consultation.embed_html =
            '<script src="https://untrusted.example.com/widget.js"></script>';
        },
        () => {
          data.online_services.online_consultation.embed_html = "";
        },
      ],
    ]) {
      change();
      save();
      assert.notEqual(run().status, 0);
      restore();
    }
    fs.writeFileSync(
      path.join(practice, "pages/appointments.md"),
      "---\ntitle: Appointments\n---\nSource-specific appointment journey.\n",
    );
    save();
    assert.equal(run().status, 0);
    assert.match(
      fs.readFileSync(path.join(tmp, "output/appointments/index.html"), "utf8"),
      /Source-specific appointment journey/,
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("failed demo rebuild removes stale preview but preserves production (H2,H7)", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "demo-output-"));
  try {
    for (const name of [
      "node_modules",
      "src",
      "lib",
      "eleventy.config.js",
      "eleventy.preview.config.js",
      "package.json",
    ]) {
      fs.symlinkSync(path.join(process.cwd(), name), path.join(tmp, name));
    }
    fs.cpSync("tests/fixtures/demo-practice", path.join(tmp, "practice"), { recursive: true });
    fs.mkdirSync(path.join(tmp, "_site"));
    fs.writeFileSync(path.join(tmp, "_site/sentinel"), "untouched");
    const run = () =>
      spawnSync("npm", ["run", "build:demo"], {
        cwd: tmp,
        env: { ...process.env, PRACTICE_DIR: path.join(tmp, "practice") },
        encoding: "utf8",
        timeout: 30000,
      });
    assert.equal(run().status, 0);
    const file = path.join(tmp, "practice/practice.yaml");
    const data = load(fs.readFileSync(file, "utf8"));
    data.contact.phone = "invalid";
    fs.writeFileSync(file, dump(data));
    assert.notEqual(run().status, 0);
    assert.ok(!fs.existsSync(path.join(tmp, "_preview/index.html")));
    assert.equal(fs.readFileSync(path.join(tmp, "_site/sentinel"), "utf8"), "untouched");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
