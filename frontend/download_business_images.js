const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file if download failed
      reject(err);
    });
  });
}

// Better image URLs for business types
const imageUrls = {
  'beauty-salon': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  'pet-grooming': 'https://images.unsplash.com/photo-1587764379873-97837921fd44?w=400&h=300&fit=crop'
};

async function downloadBusinessImages() {
  console.log('🎨 Downloading better business images...');
  
  const assetsDir = path.join(__dirname, 'src', 'assets', 'businessPhoto');
  
  for (const [businessType, url] of Object.entries(imageUrls)) {
    const filename = path.join(assetsDir, `${businessType}.jpg`);
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`❌ Failed to download ${businessType}:`, error.message);
    }
  }
  
  console.log('✨ Image download complete!');
}

downloadBusinessImages(); 