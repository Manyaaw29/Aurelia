// This script shows the correct format for the Product model

const correctedProducts = [
  {
    name: "Multicolor Heart Open Ring",  // Changed from 'title'
    category: "Rings",  // Capital R (enum: Bracelets, Earrings, Necklaces, Rings)
    price: 3699,
    originalPrice: 4099,
    discount: 30,  // Changed from 'discountPercent'
    images: [  // Array of objects with url and alt
      {
        url: "https://palmonas.com/cdn/shop/files/SSWRG0502-A.jpg?v=1749557671&width=900",
        alt: "Multicolor Heart Open Ring - Main View"
      },
      {
        url: "https://palmonas.com/cdn/shop/files/SSWRG0502-A_2.jpg?v=1749557671",
        alt: "Multicolor Heart Open Ring - Side View"
      },
      {
        url: "https://palmonas.com/cdn/shop/files/SSWRG0502-1_bf42c457-6709-4a15-868e-e502a1f4fe4f.jpg?v=1749557671",
        alt: "Multicolor Heart Open Ring - Detail"
      },
      {
        url: "https://palmonas.com/cdn/shop/files/SSWRG0502-A_1.jpg?v=1749557671",
        alt: "Multicolor Heart Open Ring - Lifestyle"
      }
    ],
    description: "The Multicolour Heart Open Ring is a vibrant and playful accessory for women who love a splash of color. Crafted from durable stainless steel with dual-tone plating, its open-heart design showcases multicoloured accents for a cheerful, eye-catching look. Adjustable, waterproof, and anti-tarnish, this ring is perfect for everyday wear, gifting, or adding a fun pop of color to any outfit.",
    sku: "SKU-R001",
    material: "18K Gold Plated Stainless Steel",
    weight: 10,  // Number only, not "10g"
    dimensions: {
      length: 6.5  // Adjustable
    },
    stockQuantity: 15,  // Required field
    productPage: "products/rings/product1.html",  // Required field
    tags: ["rings", "heart", "colorful", "adjustable"],
    newArrival: true,
    featured: false
  }
];

console.log('CORRECT FORMAT FOR ONE PRODUCT:');
console.log(JSON.stringify(correctedProducts[0], null, 2));

console.log('\n\n=== FIELD MAPPING ===');
console.log('title → name');
console.log('category: "rings" → "Rings" (Capital first letter)');
console.log('discountPercent → discount');
console.log('images: ["url"] → [{url: "url", alt: "description"}]');
console.log('weight: "10g" → 10 (number only)');
console.log('length: "Adjustable" → dimensions: { length: 6.5 }');
console.log('ADD: stockQuantity (required)');
console.log('ADD: productPage (required)');
console.log('ADD: tags (array)');
console.log('ADD: newArrival, featured, bestSeller, mostGifted (booleans)');

console.log('\n\n=== CATEGORY VALUES (case-sensitive enum) ===');
console.log('✅ "Rings"');
console.log('✅ "Earrings"');
console.log('✅ "Necklaces"');
console.log('✅ "Bracelets"');
console.log('❌ "rings", "earrings", "necklaces", "bracelets" (lowercase)');
console.log('❌ "featured" (not a category, use featured: true instead)');
