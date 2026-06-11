const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Wrapper = require('./models/Wrapper');
const seedData = require('./seedData.json');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sthamil1016_db_user:oYRDfndBhKrOchEw@hoassetscluster.pb24m8d.mongodb.net/?appName=HOAssetsCluster';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const mapCategoryToBrand = (category) => {
  const cat = category.toUpperCase();
  if (cat.startsWith('FJD')) {
    return 'FJDynamics';
  } else if (cat.startsWith('BIPOD') || cat.startsWith('TRIPOD') || cat === 'BIPODTRIPODPRODUCTS') {
    return 'Huntsman Tripod and Bipod';
  } else if (cat.startsWith('MAG') || cat === 'MAGNETECH') {
    return 'Magne-Tech';
  } else if (cat === 'SPERAS') {
    return 'Speras Au/Nz';
  } else {
    return 'Hikmicro'; // Default/Fallback to Hikmicro
  }
};

const formatCategoryName = (category) => {
  const cat = category.toUpperCase();
  if (cat === 'LYNX3.0') return 'LYNX 3.0';
  if (cat === 'THUNDER3.0') return 'THUNDER 3.0';
  if (cat === 'THUNDER2.0') return 'THUNDER 2.0';
  if (cat === 'PANTHER2.0') return 'PANTHER 2.0';
  if (cat === 'HABROK') return 'HABROK 4K';
  if (cat === 'BIPODTRIPODPRODUCTS') return 'BIPOD & TRIPOD';
  return category;
};

const seed = async () => {
  await connectDB();
  try {
    await Wrapper.deleteMany({});
    console.log('Previous wrappers cleared.');

    // Create a map to hold Brand -> Category (First-level Collection) -> Products (Second-level Tiles)
    const brandMap = {
      'Hikmicro': {},
      'Speras Au/Nz': {},
      'Magne-Tech': {},
      'FJDynamics': {},
      'Huntsman Tripod and Bipod': {}
    };

    seedData.forEach(item => {
      const brand = mapCategoryToBrand(item.category);
      const categoryName = formatCategoryName(item.category);

      if (!brandMap[brand][categoryName]) {
        brandMap[brand][categoryName] = [];
      }

      // Map assets directly to tiles
      const assets = [];
      if (item.assets && Array.isArray(item.assets)) {
        item.assets.forEach(asset => {
          assets.push({
            title: asset.title || 'Link',
            url: asset.url || '#',
            icon: asset.icon || ''
          });
        });
      }

      // Push to collection
      brandMap[brand][categoryName].push({
        name: item.name,
        image: (item.assets && item.assets[0]?.icon) || '', // Use first asset's icon as tile preview
        assets: assets
      });
    });

    // Save brand structures to MongoDB
    for (const [brandName, categories] of Object.entries(brandMap)) {
      const tiles = [];
      for (const [categoryName, products] of Object.entries(categories)) {
        tiles.push({
          name: categoryName,
          tiles: products, // collection.tiles contains tileSchema objects
        });
      }

      const wrapper = new Wrapper({
        name: brandName,
        description: `${brandName} premium product catalog`,
        tiles: tiles
      });

      await wrapper.save();
      console.log(`Seeded brand: ${brandName} with ${tiles.length} categories.`);
    }

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
