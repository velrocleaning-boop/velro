import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_DIR = path.join(__dirname, 'public', 'Service images');
const OUTPUT_DIR = path.join(__dirname, 'public', 'services');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Map input filenames to clean output filenames
const fileMap = {
  'bathroom cleaning.png': 'bathroom-cleaning.webp',
  'Sofa cleaning.jpg': 'sofa-cleaning.webp',
  'moping.jpg': 'floor-mopping.webp',
  'sweeping.jpg': 'sweeping-dusting.webp',
  'cleaning furniture.jpg': 'kitchen-cleaning.webp',
  'utensils.png': 'utensils-cleaning.webp',
  'Balcony cleaning.jpg': 'balcony-cleaning.webp',
  'Laundry.jpg': 'laundry-cleaning.webp',
};

const TARGET_KB = 95; // aim slightly under 100kb

async function convertImage(inputFile, outputFile) {
  const inputPath = path.join(INPUT_DIR, inputFile);
  const outputPath = path.join(OUTPUT_DIR, outputFile);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Not found: ${inputFile}`);
    return;
  }

  // Start with quality 82 and reduce until under TARGET_KB
  let quality = 82;
  let buffer;

  while (quality >= 30) {
    buffer = await sharp(inputPath)
      .resize(800, 600, { fit: 'cover', position: 'center' })
      .webp({ quality, effort: 6 })
      .toBuffer();
    
    const sizeKB = buffer.length / 1024;
    if (sizeKB <= TARGET_KB) break;
    quality -= 5;
  }

  fs.writeFileSync(outputPath, buffer);
  const finalKB = (buffer.length / 1024).toFixed(1);
  console.log(`✅ ${inputFile.padEnd(30)} → ${outputFile.padEnd(35)} [${finalKB} KB, quality ${quality}]`);
}

async function main() {
  console.log('\n🚀 Converting service images to optimized WebP...\n');
  
  for (const [input, output] of Object.entries(fileMap)) {
    await convertImage(input, output);
  }
  
  console.log('\n✨ All done! Check /public/services/\n');
}

main().catch(console.error);
