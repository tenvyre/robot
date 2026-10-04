#!/usr/bin/env node
/**
 * Extract Robot-main.zip and push files to GitHub
 * Usage: node extract-zip.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadZip() {
  return new Promise((resolve, reject) => {
    const url = 'https://raw.githubusercontent.com/tenvyre/robot/main/Robot-main.zip';
    const zipPath = '/tmp/Robot-main.zip';
    
    https.get(url, (res) => {
      const file = fs.createWriteStream(zipPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(zipPath);
      });
    }).on('error', reject);
  });
}

async function extractZip(zipPath) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();
  
  console.log(`Found ${entries.length} files in zip`);
  
  const files = {};
  entries.forEach(entry => {
    if (!entry.isDirectory) {
      const data = entry.getData().toString('utf8');
      files[entry.entryName] = data;
      console.log(`✓ ${entry.entryName}`);
    }
  });
  
  return files;
}

async function main() {
  try {
    console.log('1. Downloading Robot-main.zip...');
    const zipPath = await downloadZip();
    
    console.log('2. Extracting files...');
    const files = await extractZip(zipPath);
    
    console.log('3. Files ready for upload:');
    Object.keys(files).forEach(name => console.log(`   - ${name}`));
    
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
