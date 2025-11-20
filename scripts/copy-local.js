#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const DEST = process.argv[2] || '/Users/ashutosh/www/unifyn';
const OUT = path.resolve(__dirname, '..', 'out');

function rimrafDirContents(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) {
      fs.rmSync(full, { recursive: true, force: true });
    } else {
      fs.rmSync(full, { force: true });
    }
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  if (!fs.existsSync(OUT)) {
    console.error(`Error: ${OUT} does not exist. Build first (npm run build).`);
    process.exit(1);
  }
  if (!fs.existsSync(DEST)) {
    console.error(`Error: destination ${DEST} does not exist.`);
    process.exit(1);
  }
  console.log(`Clearing destination: ${DEST}`);
  rimrafDirContents(DEST);
  console.log(`Copying ${OUT} -> ${DEST}`);
  copyRecursive(OUT, DEST);
  
  // Copy nginx.conf for local nginx server
  const nginxSrc = path.resolve(__dirname, '..', 'nginx.conf');
  const nginxDest = path.join(DEST, 'nginx.conf');
  if (fs.existsSync(nginxSrc)) {
    console.log('Copying nginx.conf for security headers...');
    fs.copyFileSync(nginxSrc, nginxDest);
    console.log('⚠️  Remember to include nginx.conf in your nginx server block!');
    console.log('   See LIGHTHOUSE_BEST_PRACTICES_IMPROVEMENTS.md for instructions.');
  }
  
  console.log('Copy completed.');
}

main();



