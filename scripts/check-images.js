#!/usr/bin/env node
// Checks all image paths referenced in content/*.json against public/images/
const fs = require("fs");
const path = require("path");

const contentDir = path.join(__dirname, "../content");
const publicDir = path.join(__dirname, "../public");

const errors = [];
let checked = 0;

function extractImagePaths(obj) {
  const paths = [];
  if (typeof obj === "string") {
    if (obj.startsWith("/images/") && /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(obj)) {
      paths.push(obj);
    }
  } else if (Array.isArray(obj)) {
    for (const item of obj) paths.push(...extractImagePaths(item));
  } else if (obj && typeof obj === "object") {
    for (const val of Object.values(obj)) paths.push(...extractImagePaths(val));
  }
  return paths;
}

const jsonFiles = fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"));

for (const file of jsonFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
  const imagePaths = extractImagePaths(data);

  for (const imgPath of imagePaths) {
    checked++;
    const absPath = path.join(publicDir, imgPath);
    if (!fs.existsSync(absPath)) {
      errors.push(`  [${file}] Missing: ${imgPath}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Found ${errors.length} broken image reference(s):\n`);
  errors.forEach((e) => console.error(e));
  process.exit(1);
} else {
  console.log(`✅ All ${checked} image references are valid.`);
}
