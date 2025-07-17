const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Business types and their search terms for Unsplash
const businessTypes = [
  { type: 'beauty salon', search: 'beauty salon' },
  { type: 'restaurant', search: 'restaurant interior' },
  { type: 'retail store', search: 'retail store' },
  { type: 'coffee shop', search: 'coffee shop' },
  { type: 'barbershop', search: 'barbershop' },
  { type: 'bakery', search: 'bakery' },
  { type: 'gym', search: 'gym equipment' },
  { type: 'auto repair', search: 'auto repair shop' },
  { type: 'laundry', search: 'laundry service' },
  { type: 'pet grooming', search: 'pet grooming' },
  { type: 'tattoo parlor', search: 'tattoo parlor' },
  { type: 'nail salon', search: 'nail salon' },
  { type: 'photography studio', search: 'photography studio' },
  { type: 'consulting', search: 'business consulting' },
  { type: 'daycare', search: 'daycare center' },
  { type: 'cleaning service', search: 'cleaning service' },
  { type: 'food truck', search: 'food truck' },
  { type: 'yoga studio', search: 'yoga studio' },
  { type: 'music school', search: 'music school' },
  { type: 'dance studio', search: 'dance studio' },
  { type: 'art gallery', search: 'art gallery' },
  { type: 'bookstore', search: 'bookstore' },
  { type: 'florist', search: 'florist shop' },
  { type: 'jewelry store', search: 'jewelry store' },
  { type: 'vintage shop', search: 'vintage shop' },
  { type: 'tech startup', search: 'tech startup office' },
  { type: 'dental office', search: 'dental office' },
  { type: 'law firm', search: 'law office' },
  { type: 'real estate', search: 'real estate office' },
  { type: 'insurance agency', search: 'insurance office' },
  { type: 'accounting firm', search: 'accounting office' },
  { type: 'marketing agency', search: 'marketing agency' },
  { type: 'web design', search: 'web design office' },
  { type: 'construction', search: 'construction site' },
  { type: 'landscaping', search: 'landscaping business' },
  { type: 'plumbing', search: 'plumbing tools' },
  { type: 'electrical', search: 'electrical work' },
  { type: 'HVAC', search: 'HVAC system' },
  { type: 'roofing', search: 'roofing work' },
  { type: 'painting', search: 'painting business' },
  { type: 'carpentry', search: 'carpentry workshop' },
  { type: 'other', search: 'small business' }
];

const outputDir = 'frontend/src/assets/businessPhoto';

// Function to download image with proper redirect handling
function downloadImage(businessType, index) {
  return new Promise((resolve, reject) => {
    const fileName = `${businessType.replace(/\s+/g, '-')}.jpg`;
    const filePath = path.join(outputDir, fileName);
    
    // Use a different approach - create simple colored backgrounds with text
    // This will be more reliable and consistent
    const canvas = require('canvas');
    const { createCanvas } = canvas;
    
    const width = 400;
    const height = 400;
    const canvasInstance = createCanvas(width, height);
    const ctx = canvasInstance.getContext('2d');
    
    // Generate a nice gradient background
    const colors = [
      ['#FF6B6B', '#4ECDC4'], // Red to Teal
      ['#45B7D1', '#96CEB4'], // Blue to Green
      ['#FFEAA7', '#DDA0DD'], // Yellow to Plum
      ['#A8E6CF', '#DCEDC8'], // Mint to Light Green
      ['#FFD93D', '#FF6B6B'], // Yellow to Red
      ['#6C5CE7', '#A29BFE'], // Purple to Light Purple
      ['#FD79A8', '#FDCB6E'], // Pink to Orange
      ['#00B894', '#00CEC9'], // Green to Cyan
      ['#E17055', '#FDCB6E'], // Orange to Yellow
      ['#74B9FF', '#0984E3'], // Light Blue to Blue
      ['#A29BFE', '#6C5CE7'], // Light Purple to Purple
      ['#FD79A8', '#E84393'], // Pink to Dark Pink
      ['#00B894', '#00A085'], // Green to Dark Green
      ['#FDCB6E', '#E17055'], // Yellow to Orange
      ['#74B9FF', '#55A3FF']  // Light Blue to Blue
    ];
    
    const colorPair = colors[index % colors.length];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colorPair[0]);
    gradient.addColorStop(1, colorPair[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add a subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Add business type text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if needed
    const words = businessType.split(' ');
    const lineHeight = 30;
    const startY = height / 2 - (words.length - 1) * lineHeight / 2;
    
    words.forEach((word, i) => {
      ctx.fillText(word.charAt(0).toUpperCase() + word.slice(1), width / 2, startY + i * lineHeight);
    });
    
    // Add a subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Save the canvas as a JPEG file
    const buffer = canvasInstance.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(filePath, buffer);
    
    console.log(`✅ Created: ${fileName}`);
    resolve(fileName);
  });
}

// Main function to create all images
async function createAllImages() {
  console.log('🚀 Creating business images...');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Check if canvas is available, if not, create simple placeholder files
  try {
    require('canvas');
  } catch (err) {
    console.log('Canvas not available, creating simple placeholder files...');
    
    // Create simple text files as placeholders
    businessTypes.forEach((business, index) => {
      const fileName = `${business.type.replace(/\s+/g, '-')}.txt`;
      const filePath = path.join(outputDir, fileName);
      const content = `Placeholder for ${business.type} business image.\nIndex: ${index}\nCreated: ${new Date().toISOString()}`;
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created placeholder: ${fileName}`);
    });
    
    console.log(`\n📁 Placeholder files created in: ${outputDir}`);
    console.log('💡 To get actual images, install canvas: npm install canvas');
    return;
  }
  
  const promises = businessTypes.map((business, index) => 
    downloadImage(business.type, index)
      .catch(err => {
        console.error(`Failed to create ${business.type}:`, err);
        return null;
      })
  );
  
  try {
    const results = await Promise.all(promises);
    const successful = results.filter(result => result !== null);
    console.log(`\n🎉 Creation complete! Successfully created ${successful.length}/${businessTypes.length} images.`);
    console.log(`📁 Images saved to: ${outputDir}`);
  } catch (err) {
    console.error('❌ Error during creation:', err);
  }
}

// Run the creation
createAllImages(); 