const fs = require('fs');
const path = require('path');
const https = require('https');

// Business types and their corresponding search terms
const businessTypes = {
  'accounting-firm': 'accounting office',
  'art-gallery': 'art gallery',
  'auto-repair': 'auto repair shop',
  'bakery': 'bakery',
  'barbershop': 'barbershop',
  'beauty-salon': 'beauty salon',
  'bookstore': 'bookstore',
  'carpentry': 'carpentry workshop',
  'cleaning-service': 'cleaning service',
  'coffee-shop': 'coffee shop',
  'construction': 'construction site',
  'consulting': 'consulting office',
  'dance-studio': 'dance studio',
  'daycare': 'daycare center',
  'dental-office': 'dental office',
  'electrical': 'electrical work',
  'florist': 'florist shop',
  'food-truck': 'food truck',
  'gym': 'gym fitness center',
  'HVAC': 'HVAC technician',
  'insurance-agency': 'insurance office',
  'jewelry-store': 'jewelry store',
  'landscaping': 'landscaping',
  'laundry': 'laundromat',
  'law-firm': 'law office',
  'marketing-agency': 'marketing agency',
  'music-school': 'music school',
  'nail-salon': 'nail salon',
  'other': 'small business',
  'painting': 'painting contractor',
  'pet-grooming': 'pet grooming',
  'photography-studio': 'photography studio',
  'plumbing': 'plumbing work',
  'real-estate': 'real estate office',
  'restaurant': 'restaurant',
  'retail-store': 'retail store',
  'roofing': 'roofing work',
  'tattoo-parlor': 'tattoo parlor',
  'tech-startup': 'tech startup office',
  'vintage-shop': 'vintage shop',
  'web-design': 'web design office',
  'yoga-studio': 'yoga studio'
};

// Configuration
const PHOTOS_DIR = './frontend/src/assets/businessPhoto';

// Curated high-quality business images from Unsplash (free to use)
const curatedImages = {
  'accounting-firm': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
  'art-gallery': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
  'auto-repair': 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=800&h=600&fit=crop',
  'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
  'barbershop': 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop',
  'beauty-salon': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  'bookstore': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
  'carpentry': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop',
  'cleaning-service': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  'coffee-shop': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop',
  'construction': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
  'consulting': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  'dance-studio': 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop',
  'daycare': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  'dental-office': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  'electrical': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
  'florist': 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=800&h=600&fit=crop',
  'food-truck': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
  'gym': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
  'HVAC': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  'insurance-agency': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
  'jewelry-store': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=600&fit=crop',
  'landscaping': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
  'laundry': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  'law-firm': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
  'marketing-agency': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'music-school': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  'nail-salon': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
  'other': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
  'painting': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
  'pet-grooming': 'https://images.unsplash.com/photo-1601758228041-3ca9f8c0f9c6?w=800&h=600&fit=crop',
  'photography-studio': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop',
  'plumbing': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  'retail-store': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
  'roofing': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
  'tattoo-parlor': 'https://images.unsplash.com/photo-1605289355680-75fb41239154?w=800&h=600&fit=crop',
  'tech-startup': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  'vintage-shop': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
  'web-design': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'yoga-studio': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'
};

// Alternative URLs for failed downloads
const alternativeImages = {
  'food-truck': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
  'pet-grooming': 'https://images.unsplash.com/photo-1601758228041-3ca9f8c0f9c6?w=800&h=600&fit=crop'
};

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

// Function to retry failed downloads
async function retryFailedDownloads() {
  console.log('🔄 Starting retry of failed downloads...');
  let retryCount = 0;
  const maxRetries = 3;
  const failedImages = [];

  for (const [filename, imageUrl] of Object.entries(curatedImages)) {
    try {
      const filepath = path.join(PHOTOS_DIR, `${filename}.jpg`);
      await downloadImage(imageUrl, filepath);
      console.log(`✅ Successfully downloaded ${filename} after retry.`);
    } catch (error) {
      console.error(`❌ Failed to download ${filename} after multiple retries:`, error.message);
      failedImages.push({ filename, imageUrl });
    }
  }

  if (failedImages.length > 0) {
    console.log(`\n�� Failed to download ${failedImages.length} images after multiple retries.`);
    console.log('Attempting to use alternative URLs for these images...');

    for (const { filename, imageUrl } of failedImages) {
      try {
        const filepath = path.join(PHOTOS_DIR, `${filename}.jpg`);
        const alternativeUrl = alternativeImages[filename];
        if (alternativeUrl) {
          console.log(`Attempting to download ${filename} from alternative URL: ${alternativeUrl}`);
          await downloadImage(alternativeUrl, filepath);
          console.log(`✅ Successfully downloaded ${filename} from alternative URL.`);
        } else {
          console.warn(`No alternative URL found for ${filename}. Skipping.`);
        }
      } catch (error) {
        console.error(`❌ Failed to download ${filename} from alternative URL:`, error.message);
      }
    }
  } else {
    console.log('\n✅ All images downloaded successfully after retries.');
  }
}

// Main function to download all business images
async function downloadAllBusinessImages() {
  console.log('🚀 Starting download of real business images...');
  
  // Ensure the directory exists
  if (!fs.existsSync(PHOTOS_DIR)) {
    fs.mkdirSync(PHOTOS_DIR, { recursive: true });
  }

  let successCount = 0;
  let totalCount = Object.keys(curatedImages).length;

  for (const [filename, imageUrl] of Object.entries(curatedImages)) {
    try {
      const filepath = path.join(PHOTOS_DIR, `${filename}.jpg`);
      await downloadImage(imageUrl, filepath);
      successCount++;
      
      // Add a small delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Download completed! Successfully downloaded ${successCount}/${totalCount} images.`);
  console.log(`📁 Images saved to: ${PHOTOS_DIR}`);
}

// Run the download
downloadAllBusinessImages().catch(console.error); 