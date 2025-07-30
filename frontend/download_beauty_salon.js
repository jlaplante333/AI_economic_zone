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

async function downloadBeautySalonImage() {
  console.log('🎨 Downloading new beauty salon image...');
  
  const assetsDir = path.join(__dirname, 'src', 'assets', 'businessPhoto');
  
  // Try a different beauty salon image - this one shows salon equipment
  const url = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop';
  const tempFilename = path.join(assetsDir, 'beauty-salon-new.jpg');
  const finalFilename = path.join(assetsDir, 'beauty-salon.jpg');
  
  try {
    await downloadImage(url, tempFilename);
    
    // Remove old file and rename new one
    if (fs.existsSync(finalFilename)) {
      fs.unlinkSync(finalFilename);
      console.log('🗑️ Removed old beauty salon image');
    }
    
    fs.renameSync(tempFilename, finalFilename);
    console.log('✅ Beauty salon image updated successfully!');
    
  } catch (error) {
    console.error(`❌ Failed to download beauty salon image:`, error.message);
  }
}

downloadBeautySalonImage(); 