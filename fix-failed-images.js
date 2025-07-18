const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const PHOTOS_DIR = './frontend/src/assets/businessPhoto';

// Function to download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if download failed
      reject(err);
    });
  });
}

// Fix the failed images
async function fixFailedImages() {
  console.log('🔧 Fixing failed image downloads...');
  
  const failedImages = {
    'food-truck': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    'pet-grooming': 'https://images.unsplash.com/photo-1601758228041-3ca9f8c0f9c6?w=800&h=600&fit=crop'
  };

  // Updated URLs that should work
  const workingImages = {
    'food-truck': 'https://images.pexels.com/photos/1565299624946/pexels-photo-1565299624946.jpeg?w=800&h=600&fit=crop',
    'pet-grooming': 'https://images.pexels.com/photos/1601758228041/pexels-photo-1601758228041.jpeg?w=800&h=600&fit=crop'
  };

  for (const [filename, imageUrl] of Object.entries(workingImages)) {
    try {
      const filepath = path.join(PHOTOS_DIR, `${filename}.jpg`);
      await downloadImage(imageUrl, filepath);
    } catch (error) {
      console.error(`❌ Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log('✅ Fix completed!');
}

// Run the fix
fixFailedImages().catch(console.error); 