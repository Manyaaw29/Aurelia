require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Converted products data - Auto-generated from autoConvertSeed.js
const products = [
  {
    "name": "Multicolor Heart Open Ring",
    "category": "Rings",
    "description": "The Multicolour Heart Open Ring is a vibrant and playful accessory for women who love a splash of color. Crafted from durable stainless steel with dual-tone plating, its open-heart design showcases multicoloured accents for a cheerful, eye-catching look. Adjustable, waterproof, and anti-tarnish, this ring is perfect for everyday wear, gifting, or adding a fun pop of color to any outfit.",
    "price": 3699,
    "originalPrice": 4099,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWRG0502-A.jpg?v=1749557671&width=900",
        "alt": "Multicolor Heart Open Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWRG0502-A_2.jpg?v=1749557671",
        "alt": "Multicolor Heart Open Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWRG0502-1_bf42c457-6709-4a15-868e-e502a1f4fe4f.jpg?v=1749557671",
        "alt": "Multicolor Heart Open Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWRG0502-A_1.jpg?v=1749557671",
        "alt": "Multicolor Heart Open Ring - View 4"
      }
    ],
    "sku": "SKU-R001",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 14,
    "productPage": "products/rings/product1.html",
    "tags": [
      "rings",
      "multicolor"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Thin Twig Ring",
    "category": "Rings",
    "description": "The Thin Twig Ring is a graceful piece inspired by nature’s elegance. Crafted in 18k gold tone over stainless steel, this waterproof and anti-tarnish ring brings a modern organic charm to your look. Its delicate twig-like design makes it perfect for women who love understated yet unique jewellery. A versatile everyday accessory that blends simplicity with sophistication, making it a must-have in your collection.",
    "price": 1799,
    "originalPrice": 2199,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-090.jpg?v=1761797858&width=900",
        "alt": "Thin Twig Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Artboard5_7.jpg?v=1761797858&width=900",
        "alt": "Thin Twig Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-090.webp?v=1761797858&width=900",
        "alt": "Thin Twig Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/rg212_1.jpg?v=1744525554",
        "alt": "Thin Twig Ring - View 4"
      }
    ],
    "sku": "SKU-R002",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 15,
    "productPage": "products/rings/product2.html",
    "tags": [
      "rings",
      "thin"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Droplet Blush Ring",
    "category": "Rings",
    "description": "The Droplet Blush Ring is a delicate jewellery piece crafted from stainless steel with 18k gold plating. Featuring a single pink synthetic stone, it is waterproof and anti-tarnish for everyday wear. Its minimalist, droplet-inspired design adds a soft, feminine touch to any outfit, making it perfect for stacking or wearing solo, and a versatile addition to any jewellery collection.",
    "price": 4299,
    "originalPrice": 4899,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/1_2_319697b3-28ee-46e1-b2f9-2da21c10e56e.jpg?v=1744525211&width=900",
        "alt": "Droplet Blush Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG226_1_15335201-6e30-4f4a-9df7-fe92c4d55280.jpg?v=1744525211&width=900",
        "alt": "Droplet Blush Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG226_1_fa56dd3f-8370-4223-8824-06f4bd996a7c.jpg?v=1744525211",
        "alt": "Droplet Blush Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG226_2d95dbc4-892b-4e03-a79b-56a4f0c27c07.jpg?v=1744525211",
        "alt": "Droplet Blush Ring - View 4"
      }
    ],
    "sku": "SKU-R003",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 15,
    "productPage": "products/rings/product3.html",
    "tags": [
      "rings",
      "droplet"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Graceful Curve Ring",
    "category": "Rings",
    "description": "Graceful open-loop ring featuring a flowing, abstract design set with a row of dazzling stones. The fluid curves create an artistic silhouette, offering a perfect blend of modern minimalism and subtle sparkle.",
    "price": 2999,
    "originalPrice": 3499,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMWLDRG814-G_1_a4af23b0-00f1-42ce-a2ec-8eecf8b3153b.jpg?v=1757489821&width=900",
        "alt": "Graceful Curve Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMWLDRG814-G_a61b0a80-546d-4803-8fa0-ec8bbd1b712e.jpg?v=1757489821&width=900",
        "alt": "Graceful Curve Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMWLDRG814-G_2_2813147d-e9ce-4465-9a9c-0541a576dda9.jpg?v=1757489821&width=900",
        "alt": "Graceful Curve Ring - View 3"
      },
      {
        "url": "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw49c545a9/images/hi-res/50D5B2FHMAA02_3.jpg?sw=640&sh=640",
        "alt": "Graceful Curve Ring - View 4"
      }
    ],
    "sku": "SKU-R004",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/rings/product4.html",
    "tags": [
      "rings",
      "graceful"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Chevron Ring",
    "category": "Rings",
    "description": "The Chevron Ring is a chic jewellery piece crafted from stainless steel with 18k gold plating. Adorned with a white cubic zirconia, it is waterproof and anti-tarnish for everyday wear. Its sleek chevron design adds modern elegance, making it perfect for stacking or wearing solo.",
    "price": 3989,
    "originalPrice": 4599,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/RG164_1_ae769c26-5c65-413a-bf8d-d08fd22f64b9.jpg?v=1744526556&width=900",
        "alt": "Chevron Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG164-1_b2e81734-2c1f-46b3-bea2-a2bd2cd5a209.jpg?v=1744526556&width=900",
        "alt": "Chevron Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/rg1642_23d431d2-9a68-43ec-837a-6055a07b63f5.jpg?v=1744526556&width=900",
        "alt": "Chevron Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/fridaydrop1_2.jpg?v=1744526556&width=900",
        "alt": "Chevron Ring - View 4"
      }
    ],
    "sku": "SKU-R005",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 15,
    "productPage": "products/rings/product5.html",
    "tags": [
      "rings",
      "chevron"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Blush Bloom Rose Gold Ring",
    "category": "Rings",
    "description": "A romantic flourish for your fingers, the Blush Bloom ring is sculpted in 925 silver and finished with radiant rose gold. Inspired by fresh spring petals, its delicate curves and soft polish bring a touch of blooming elegance to any look, day or night.",
    "price": 2599,
    "originalPrice": 3399,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/STWRG0721-5_0040.jpg?v=1752498388",
        "alt": "Blush Bloom Rose Gold Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC00355.jpg?v=1753683921",
        "alt": "Blush Bloom Rose Gold Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/STWRG0721-5_2_0040.jpg?v=1756363976",
        "alt": "Blush Bloom Rose Gold Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC00351.jpg?v=1756363976",
        "alt": "Blush Bloom Rose Gold Ring - View 4"
      }
    ],
    "sku": "SKU-R006",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 20,
    "productPage": "products/rings/product6.html",
    "tags": [
      "rings",
      "blush"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Stack it Multilayer Ring Set",
    "category": "Rings",
    "description": "Stack It Multilayer Ring Set is a versatile and stylish accessory crafted from high-quality 18K gold plated brass. This layered ring set can be stacked together or worn individually for a personalized look. Waterproof and anti-tarnish, perfect for everyday styling.",
    "price": 2399,
    "originalPrice": 2799,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/RingSet002_ac7ee60d-178c-4cbc-9b75-6d574ed146db.jpg?v=1744527068",
        "alt": "Stack it Multilayer Ring Set - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG-SET-002-3.jpg?v=1744527068",
        "alt": "Stack it Multilayer Ring Set - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG-SET-002-2_61aaf80e-5961-4c74-b09d-eca606a2b20e.jpg?v=1744527068",
        "alt": "Stack it Multilayer Ring Set - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG-SET-002_07157199-796c-49b8-a484-63ece6888deb.jpg?v=1744527068",
        "alt": "Stack it Multilayer Ring Set - View 4"
      }
    ],
    "sku": "SKU-R007",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/rings/product7.html",
    "tags": [
      "rings",
      "stack"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Diamond Studded Ring",
    "category": "Rings",
    "description": "Add a radiant sparkle to your collection with the Diamond Studded Ring. Crafted in durable stainless steel and finished with 18k gold tone, it features dazzling white cubic zirconia that captures the brilliance of diamonds. Waterproof and anti-tarnish, this ring blends timeless elegance with modern wearability, making it a versatile piece of jewellery for both daily wear and special evenings.",
    "price": 6299,
    "originalPrice": 6599,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-051-6.jpg?v=1744528304&width=900",
        "alt": "Diamond Studded Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PAL_SHRADDHA_230524_0884new-copy_280145fb-e956-46d7-9b13-9ff162419378.jpg?v=1756221250&width=900",
        "alt": "Diamond Studded Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-051-6_1.jpg?v=1756221250&width=900",
        "alt": "Diamond Studded Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-051_1_55187478-fc9c-4202-bb5f-a2c1abc2ae8a.jpg?v=1756221250&width=900",
        "alt": "Diamond Studded Ring - View 4"
      }
    ],
    "sku": "SKU-R008",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 15,
    "productPage": "products/rings/product8.html",
    "tags": [
      "rings",
      "diamond"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Cross Over Stones Lined Twist Ring",
    "category": "Rings",
    "description": "The Criss Cross Ring is a modern essential, crafted from stainless steel with a radiant 18k gold tone finish. Its intersecting bands, adorned with sparkling white cubic zirconia, create a dazzling yet minimal design that’s perfect for daily wear or evening occasions. Waterproof and anti-tarnish, this durable ring is built for lasting shine. A versatile piece of jewellery, it blends contemporary elegance with timeless charm.",
    "price": 5499,
    "originalPrice": 6499,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-041.jpg?v=1744528549&width=900",
        "alt": "Cross Over Stones Lined Twist Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/products/01_f6808819-bcb7-4533-9ebd-2b6d3787cb7d.jpg?v=1744528549&width=900",
        "alt": "Cross Over Stones Lined Twist Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Ring-041_365f5490-9342-4554-b6fa-2cf5a47da13d.jpg?v=1744528549",
        "alt": "Cross Over Stones Lined Twist Ring - View 3"
      },
      {
        "url": "https://roohjewel.in/cdn/shop/files/FC905209-78B1-469E-9A1E-118CD64A53A9.jpg?v=1738000498&width=1445",
        "alt": "Cross Over Stones Lined Twist Ring - View 4"
      }
    ],
    "sku": "SKU-R009",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 17,
    "productPage": "products/rings/product9.html",
    "tags": [
      "rings",
      "cross"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Glossy Enamel Ring",
    "category": "Rings",
    "description": "The Glossy Enamel Ring is a vibrant statement piece crafted from stainless steel and coated in lustrous 18k gold tone. Its smooth enamel finish delivers a modern, playful touch while maintaining a polished and elegant appeal. Ideal for adding a pop of color and texture, this ring works for both casual and semi-formal occasions, letting your fingers stand out effortlessly.",
    "price": 4299,
    "originalPrice": 4599,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/RG104-B.jpg?v=1744527645",
        "alt": "Glossy Enamel Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG104-B-6_60057bbd-fd66-4dbe-9122-791a001c915e.jpg?v=1744527645",
        "alt": "Glossy Enamel Ring - View 2"
      },
      {
        "url": "https://assets-jiocdn.ajio.com/medias/sys_master/root/20230720/fr1X/64b961baeebac147fc7f8ade/-473Wx593H-466374171-gold-MODEL.jpg",
        "alt": "Glossy Enamel Ring - View 3"
      },
      {
        "url": "https://m.media-amazon.com/images/I/61w0b5BdjCL._AC_UY1100_.jpg",
        "alt": "Glossy Enamel Ring - View 4"
      }
    ],
    "sku": "SKU-R010",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/rings/product10.html",
    "tags": [
      "rings",
      "glossy"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "White Heart Ring",
    "category": "Rings",
    "description": "Charming and elegant, the White Heart Ring features a lustrous mother-of-pearl heart set in 18k gold-plated stainless steel. Its delicate design exudes romance while remaining versatile for everyday wear. This piece is perfect for adding a subtle, feminine touch to your jewellery collection, making it ideal for both casual and formal occasions.",
    "price": 1999,
    "originalPrice": 2199,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-RING-031.jpg?v=1744528593",
        "alt": "White Heart Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/products/04_812ef8e3-a36d-493b-abdb-b62f90e0a26a.jpg?v=1744528593&width=900",
        "alt": "White Heart Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Ring-031_0d949820-b221-4f8b-ab74-b9d4bd22a8c0.jpg?v=1744528592",
        "alt": "White Heart Ring - View 3"
      },
      {
        "url": "https://prya.co.uk/cdn/shop/products/CarysRing-Opal-01_PRYA-Edit.jpg?v=1649337871&width=920",
        "alt": "White Heart Ring - View 4"
      }
    ],
    "sku": "SKU-R011",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 18,
    "productPage": "products/rings/product11.html",
    "tags": [
      "rings",
      "white"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Moonshell Ring",
    "category": "Rings",
    "description": "The Moonshell Ring is a chic jewellery piece crafted from stainless steel with 18k gold plating. Its elegant shell-inspired design is waterproof and anti-tarnish, adding a touch of modern sophistication to any outfit. Perfect for stacking or wearing solo, this versatile ring elevates casual, office, or evening looks, making it a stylish addition to any jewellery collection.",
    "price": 2099,
    "originalPrice": 2499,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/RG204.jpg?v=1744525573",
        "alt": "Moonshell Ring - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG204_1.jpg?v=1744525573",
        "alt": "Moonshell Ring - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG204_3eb16023-0af9-4d87-a429-9ce602e47747.png?v=1744525572",
        "alt": "Moonshell Ring - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/RG204_2.jpg?v=1744525573",
        "alt": "Moonshell Ring - View 4"
      }
    ],
    "sku": "SKU-R012",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 10,
    "productPage": "products/rings/product12.html",
    "tags": [
      "rings",
      "moonshell"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Diamond Studded Hoop Earrings",
    "category": "Earrings",
    "description": "Add a touch of sparkle to any outfit with these 18k gold plated hoop earrings, adorned with dazzling white cubic zirconia stones. Perfect for both day and night, they elevate casual ensembles or complement formal attire with understated glamour. Waterproof and anti-tarnish, these hoops are designed to shine while keeping your look effortlessly elegant.",
    "price": 2299,
    "originalPrice": 2499,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/diamondearring_486729eb-e12d-4beb-acc2-198eb63ecd81.jpg?v=1744526497",
        "alt": "Diamond Studded Hoop Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Artboard44.jpg?v=1744526497",
        "alt": "Diamond Studded Hoop Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/er1545_3a7c6634-c49b-415c-b565-682e4ff15861.jpg?v=1744526497",
        "alt": "Diamond Studded Hoop Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/er1542_23141ee9-0ab7-47f8-8a29-e7e7d590feaf.jpg?v=1744526497",
        "alt": "Diamond Studded Hoop Earrings - View 4"
      }
    ],
    "sku": "SKU-E001",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 14,
    "productPage": "products/earrings/product1.html",
    "tags": [
      "earrings",
      "diamond"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Athena Soltaire Hoop Earrings",
    "category": "Earrings",
    "description": "Sleek and elegant, these 18k gold plated Athena solitaire hoop earrings feature sparkling white cubic zirconia stones for a refined, minimalist look. Their versatile hoop design adds subtle sophistication to any outfit, while the waterproof and anti-tarnish finish ensures lasting shine. Perfect for everyday wear, office styling, or evening occasions, these earrings are a timeless addition to your jewellery collection.",
    "price": 2258,
    "originalPrice": 2550,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-032_3_0040.jpg?v=1744528692&width=900",
        "alt": "Athena Soltaire Hoop Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-032_1_ca866188-eb2f-491f-ae6d-e42e9501725b.jpg?v=1744528692",
        "alt": "Athena Soltaire Hoop Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-032_1_cfbf10fe-7c26-4949-ac3d-63cc32a59e34.png?v=1744528692",
        "alt": "Athena Soltaire Hoop Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-032_2_d97b530f-3794-4ace-a029-e8d1cb5df8f3.png?v=1744528692",
        "alt": "Athena Soltaire Hoop Earrings - View 4"
      }
    ],
    "sku": "SKU-E002",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 10,
    "productPage": "products/earrings/product2.html",
    "tags": [
      "earrings",
      "athena"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Small Heart Hoop Earrings",
    "category": "Earrings",
    "description": "The Small Heart Hoop Earrings are a sweet blend of elegance and charm, designed in a classic hoop silhouette with delicate heart accents. Crafted from durable stainless steel and plated with radiant 18k gold, these earrings are waterproof and anti-tarnish, ensuring lasting shine. Lightweight yet eye-catching, they’re perfect for adding a touch of romance and everyday sophistication to your jewellery collection.",
    "price": 2611,
    "originalPrice": 2899,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-037_1_0040.jpg?v=1744528665",
        "alt": "Small Heart Hoop Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-037-1_a6d51a25-cc06-42de-b944-b9e47ebc40d0.jpg?v=1744528665",
        "alt": "Small Heart Hoop Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/smallhh_cce992f5-8d84-49b0-acb8-02f199f51d22.jpg?v=1744528665",
        "alt": "Small Heart Hoop Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-EARRINGS-037_3_f5de02cb-a35e-49bf-8faa-06836496d0fa.jpg?v=1744528665",
        "alt": "Small Heart Hoop Earrings - View 4"
      }
    ],
    "sku": "SKU-E003",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 17,
    "productPage": "products/earrings/product3.html",
    "tags": [
      "earrings",
      "small"
    ],
    "featured": false,
    "newArrival": true,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Emerald Hoop Earrings",
    "category": "Earrings",
    "description": "Luxurious and eye-catching, these 18k gold plated emerald hoop earrings feature vibrant green stones that add a pop of color to any outfit. The sleek hoop design combines elegance with a touch of glamour, while the waterproof and anti-tarnish finish ensures lasting shine. Perfect for casual chic looks, office styling, or evening occasions, these earrings make a sophisticated statement.",
    "price": 2235,
    "originalPrice": 2500,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/ER-117-2_755a195f-d588-40be-8402-f7b5e148a9b1.jpg?v=1749035189",
        "alt": "Emerald Hoop Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER-117_11bf7df1-3fa4-464f-8cb4-60b85e0ddc06.jpg?v=1749035189",
        "alt": "Emerald Hoop Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER-117-1_9e92cd0c-4ca6-4281-8b53-ccedaa37a46d.jpg?v=1749035189",
        "alt": "Emerald Hoop Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER-117_3_03796d17-44b5-4209-966f-62424594bc52.jpg?v=1749035189",
        "alt": "Emerald Hoop Earrings - View 4"
      }
    ],
    "sku": "SKU-E004",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/earrings/product4.html",
    "tags": [
      "earrings",
      "emerald"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Classic Textured Hoops",
    "category": "Earrings",
    "description": "Elegant and versatile, these 18k gold plated classic textured hoops feature subtle detailing that adds a refined touch to any outfit. The polished gold finish ensures lasting shine, while the waterproof and anti-tarnish properties keep them looking flawless. Perfect for everyday wear, office settings, or evening occasions, these huggie hoops elevate your style with effortless charm.",
    "price": 3299,
    "originalPrice": 3599,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER046.jpg?v=1744523551&width=900",
        "alt": "Classic Textured Hoops - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER046-2_52c99a7b-dd3b-4b55-b436-2006f54896e0.jpg?v=1744523551",
        "alt": "Classic Textured Hoops - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER046_01_42dad273-7c11-480f-a692-00ea2da02936.jpg?v=1744523551",
        "alt": "Classic Textured Hoops - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER046-1_0a0bf700-919f-46a6-b9cc-9cdf7ba82ee5.jpg?v=1744523551",
        "alt": "Classic Textured Hoops - View 4"
      }
    ],
    "sku": "SKU-E005",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/earrings/product5.html",
    "tags": [
      "earrings",
      "classic"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Bi-metal Wrapped with Love Earrings",
    "category": "Earrings",
    "description": "The Bi-metal Wrapped With Love Earrings are a stunning fusion of gold and silver tones, symbolising unity and timeless charm. Crafted with stainless steel and finished with 18k multi-tone plating, these earrings feature a modern wrapped knot design that adds sophistication to any outfit. Waterproof and anti-tarnish, they’re designed for versatility—perfect for both formal occasions and chic everyday wear.",
    "price": 1299,
    "originalPrice": 2299,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/ER276_2_94336f49-b38b-4179-86bc-fc93b4a67c9b.png?v=1744524043&width=900",
        "alt": "Bi-metal Wrapped with Love Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER276_1_6a6e28ba-07f2-4d42-b470-8d7c77b98796.jpg?v=1744524043&width=900",
        "alt": "Bi-metal Wrapped with Love Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER2763_7daa0ee4-1b78-439f-a65d-2f292f5d0b8a.jpg?v=1744524043&width=900",
        "alt": "Bi-metal Wrapped with Love Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER276_e4ffc9aa-319a-46b6-8315-49d6e79dccce.jpg?v=1744524043&width=900",
        "alt": "Bi-metal Wrapped with Love Earrings - View 4"
      }
    ],
    "sku": "SKU-E006",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 17,
    "productPage": "products/earrings/product6.html",
    "tags": [
      "earrings",
      "bi-metal"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Curvy Embrace Earrings",
    "category": "Earrings",
    "description": "Elegant and contemporary, the Curvy Embrace Earrings feature a flowing hoop design adorned with sparkling cubic zirconia for a sophisticated shimmer. Crafted with 18k gold plating on stainless steel, they are waterproof, anti-tarnish, and perfect for casual, office, or evening wear.",
    "price": 3499,
    "originalPrice": 3699,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/ER148_1.png?v=1744526611",
        "alt": "Curvy Embrace Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER148-01_f482ae93-1cbc-4877-bf3e-150dc716c55d.jpg?v=1744526611",
        "alt": "Curvy Embrace Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/fridaydrop10_1_9e3b260f-54d2-4dd5-89ba-a08ef743bf06.jpg?v=1744526611",
        "alt": "Curvy Embrace Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER148-MD4.jpg?v=1745910159",
        "alt": "Curvy Embrace Earrings - View 4"
      }
    ],
    "sku": "SKU-E007",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 11,
    "productPage": "products/earrings/product7.html",
    "tags": [
      "earrings",
      "curvy"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Butterfly Wing Stud Earrings",
    "category": "Earrings",
    "description": "Delicate and whimsical, these 18k gold plated butterfly wing stud earrings bring a playful charm to any outfit. The intricate wing design adds subtle elegance, while the waterproof and anti-tarnish finish ensures lasting shine. Perfect for everyday wear, casual chic looks, or light evening styling, these earrings are a versatile and feminine addition to your jewellery collection.",
    "price": 1959,
    "originalPrice": 2199,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/butterfly_6b03725e-3bda-43d4-9804-3eebda758a11.jpg?v=1744527016",
        "alt": "Butterfly Wing Stud Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER118-2.jpg?v=1744527016",
        "alt": "Butterfly Wing Stud Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER118_1_1be34446-73ee-48dc-a8b8-963dc386359e.jpg?v=1744527016",
        "alt": "Butterfly Wing Stud Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER118-3_9ba8328e-c862-4b55-b37d-8388876b68a6.jpg?v=1744527016",
        "alt": "Butterfly Wing Stud Earrings - View 4"
      }
    ],
    "sku": "SKU-E008",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 20,
    "productPage": "products/earrings/product8.html",
    "tags": [
      "earrings",
      "butterfly"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Pearl Hook Earrings",
    "category": "Earrings",
    "description": "Timeless and graceful, these 18k gold plated pearl hook earrings combine classic elegance with everyday versatility. Featuring lustrous white pearls, they add a subtle sophistication to any outfit, while the waterproof and anti-tarnish finish ensures long-lasting shine. Perfect for casual chic looks, office styling, or evening occasions, these earrings are a must-have jewellery essential.",
    "price": 2499,
    "originalPrice": 2799,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/ER153_1_aebbfddc-7d12-42eb-bb36-f2a3dec2ff67.jpg?v=1744526505&width=900",
        "alt": "Pearl Hook Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER153_1_1f0b5b63-6be1-481a-bb02-6ddfb9b405f1.jpg?v=1744526505",
        "alt": "Pearl Hook Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER153_2_7b635fdc-e3d3-418a-af16-3e2d34f010a9.jpg?v=1744526505",
        "alt": "Pearl Hook Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER153_2_4239a245-467e-4d5c-a6e1-cc5e932e3739.jpg?v=1744526505",
        "alt": "Pearl Hook Earrings - View 4"
      }
    ],
    "sku": "SKU-E009",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/earrings/product9.html",
    "tags": [
      "earrings",
      "pearl"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Pearl and Moon Stud Earrings",
    "category": "Earrings",
    "description": "Add celestial elegance to your look with these pearl and moon stud earrings. Crafted from durable stainless steel with 18k gold plating and adorned with lustrous white pearls, these earrings blend modern sophistication with dreamy charm. Waterproof and anti-tarnish, they are perfect for women who love jewellery that shines both day and night.",
    "price": 4199,
    "originalPrice": 5099,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMWSSER233-G.jpg?v=1744520382&width=900",
        "alt": "Pearl and Moon Stud Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/1728660577715_ba21f398-2b4e-42bf-8481-b09760e63695.png?v=1744520382",
        "alt": "Pearl and Moon Stud Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/1728660698817_e46d0ed6-8a0c-481f-b24a-71b81324cff2.png?v=1744520382",
        "alt": "Pearl and Moon Stud Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/1728660703790_08809420-e99a-4fd0-8304-9316b923449d.png?v=1744520382",
        "alt": "Pearl and Moon Stud Earrings - View 4"
      }
    ],
    "sku": "SKU-E010",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 18,
    "productPage": "products/earrings/product10.html",
    "tags": [
      "earrings",
      "pearl"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Pearl Drop Diamond Earrings",
    "category": "Earrings",
    "description": "The Pearl Drop Diamond Earrings exude timeless elegance with a modern twist. Featuring lustrous pearls paired with sparkling cubic zirconia, these earrings are plated in luxurious 18k gold for a radiant finish. Designed with a push-back closure for comfort and security, they bring sophistication to any look. Waterproof and anti-tarnish, these earrings are versatile enough to transition from everyday elegance to evening glamour with effortless grace.",
    "price": 3999,
    "originalPrice": 4999,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/er1566_5ae0623a-ccea-473b-803f-abf2381eb774.jpg?v=1744526472",
        "alt": "Pearl Drop Diamond Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/ER156-2_1_72d988c3-f456-4bac-98e8-62591aea63b5.jpg?v=1744526472",
        "alt": "Pearl Drop Diamond Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/FRIDAYDROP_11_276348f6-d40e-40c2-bd4b-05c37855f5ce.jpg?v=1744526472",
        "alt": "Pearl Drop Diamond Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/er1561_06e2acec-4a86-4620-a9ca-52591c4026ed.jpg?v=1744526472",
        "alt": "Pearl Drop Diamond Earrings - View 4"
      }
    ],
    "sku": "SKU-E011",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 11,
    "productPage": "products/earrings/product11.html",
    "tags": [
      "earrings",
      "pearl"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Golden Bow and Tassle Drop Earrings",
    "category": "Earrings",
    "description": "Playful yet elegant, these 18k gold plated Gold Bow and Tassel drop earrings feature a chic bow design paired with delicate tassels, creating movement and charm with every turn. The polished gold finish ensures lasting shine, while the waterproof and anti-tarnish properties keep them flawless. Perfect for both casual and festive occasions, these earrings make a statement while maintaining sophistication.",
    "price": 2999,
    "originalPrice": 3499,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER157-1_810f70f9-1c7c-434f-9793-4a7c674cd4e4.jpg?v=1744522091",
        "alt": "Golden Bow and Tassle Drop Earrings - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER157_1_d8d0955e-8fab-4279-90c9-99e3d8e7a7f1.jpg?v=1744522091",
        "alt": "Golden Bow and Tassle Drop Earrings - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER157-4_0a7abd36-01cc-4ba7-b680-4403ab423079.jpg?v=1744522091",
        "alt": "Golden Bow and Tassle Drop Earrings - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01ER157_3_5b320b5a-0f47-4b0f-b283-3136a9b90891.jpg?v=1744522091",
        "alt": "Golden Bow and Tassle Drop Earrings - View 4"
      }
    ],
    "sku": "SKU-E012",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 19,
    "productPage": "products/earrings/product12.html",
    "tags": [
      "earrings",
      "golden"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Classic Emerald Necklace",
    "category": "Necklaces",
    "description": "The Classic Emerald Necklace features a vibrant green emerald pendant set on a sleek 18k gold-tone chain, exuding elegance and sophistication. Crafted in stainless steel with a durable gold finish, this waterproof and anti-tarnish necklace enhances casual, office, or evening outfits, making it a versatile accessory for everyday wear or special occasions.",
    "price": 2258,
    "originalPrice": 3226,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK-40_1_0040.jpg?v=1744524127&width=1000",
        "alt": "Classic Emerald Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/product_images_f349bdcc-e064-4744-9be2-2e09dcdd28c5.jpg?v=1744524127&width=1000",
        "alt": "Classic Emerald Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK496_4_4ff77314-880c-4d5a-ba50-ea634c18fa66.jpg?v=1744524127",
        "alt": "Classic Emerald Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK496_265cf562-4776-42be-9348-5d6b7a6894e4.jpg?v=1744524127",
        "alt": "Classic Emerald Necklace - View 4"
      }
    ],
    "sku": "SKU-N001",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/necklaces/product1.html",
    "tags": [
      "necklaces",
      "classic"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Delicate Diamond Studded Necklace",
    "category": "Necklaces",
    "description": "Timeless and radiant, this necklace features a sparkling white cubic zirconia pendant in a radiant gold-tone finish. Its minimalist design adds subtle elegance to any outfit, perfect for everyday wear or special occasions.",
    "price": 2611,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK484_3_88bbcc99-8a1e-415c-9e14-44e6a3123557.jpg?v=1744524486&width=1000",
        "alt": "Delicate Diamond Studded Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK484_deea71b7-4af3-4b36-8048-79a5c413dba8.jpg?v=1748420308&width=1000",
        "alt": "Delicate Diamond Studded Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK484-MD2_62386ed4-932f-4a2e-8365-0bdb191525e6.jpg?v=1748420308&width=1000",
        "alt": "Delicate Diamond Studded Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK484_2_b0702c19-5993-4bff-b350-fab962953fe9.jpg?v=1748420308&width=1000",
        "alt": "Delicate Diamond Studded Necklace - View 4"
      }
    ],
    "sku": "SKU-N002",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/necklaces/product2.html",
    "tags": [
      "necklaces",
      "delicate"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Golden Infinity Necklace",
    "category": "Necklaces",
    "description": "The Golden Infinity Necklace embodies eternal elegance with its beautifully crafted infinity symbol pendant. Made from premium 18k gold-plated brass, this stunning piece features a delicate infinity design that symbolizes endless love and limitless possibilities. Waterproof and anti-tarnish, this versatile necklace adds a meaningful, sophisticated touch to any ensemble. Perfect for everyday wear, romantic occasions, or as a thoughtful gift to celebrate enduring connections.",
    "price": 2991,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK4892_1911bfed-cba1-4fb9-b20d-d44718cfe71b.jpg?v=1744524152&width=900",
        "alt": "Golden Infinity Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09654_545007ea-5051-4ef3-b1d4-e82db266ac41.jpg?v=1744524152&width=900",
        "alt": "Golden Infinity Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK489_1_c5be272a-c490-4fa9-998c-9b9e357bf65d.jpg?v=1744524152",
        "alt": "Golden Infinity Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09655_055ee629-d651-4e12-9293-f1be17bfc29f.jpg?v=1744524152",
        "alt": "Golden Infinity Necklace - View 4"
      }
    ],
    "sku": "SKU-N003",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 14,
    "productPage": "products/necklaces/product3.html",
    "tags": [
      "necklaces",
      "golden"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Ribbon Pendant Necklace",
    "category": "Necklaces",
    "description": "Tie your look together in gold. Crafted from high-quality stainless steel and plated in radiant 18K gold, our Ribbon Pendant Necklace captures the essence of feminine grace and modern minimalism. Designed especially for you, it adds a soft, sculptural charm to your everyday style.",
    "price": 1611,
    "originalPrice": 2730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/CopyofPMW01NC030.jpg?v=1744519728&width=1000",
        "alt": "Ribbon Pendant Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC00429_1d2df1c6-7466-4893-a69e-f750a0604ad3.jpg?v=1744519728&width=1000",
        "alt": "Ribbon Pendant Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01NC030_1_dcb23fee-6f93-4586-b3bf-66a2246d4c1e.jpg?v=1744519728&width=1000",
        "alt": "Ribbon Pendant Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC00431_87894d06-7c5e-47dc-99cb-21e49c13be23.jpg?v=1744519728&width=1000",
        "alt": "Ribbon Pendant Necklace - View 4"
      }
    ],
    "sku": "SKU-N004",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 15,
    "productPage": "products/necklaces/product4.html",
    "tags": [
      "necklaces",
      "ribbon"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Glided Rings Layered Necklace",
    "category": "Necklaces",
    "description": "Introducing our all-new Gilded Rings Layered Necklace. Embrace the art of stacking with this mesmerizing piece featuring two rings dangling gracefully, one of which is studded with shimmery cubic zirconia.",
    "price": 2411,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01NC023_4_c503499e-0334-4432-be9f-a0f752ff7bf2.jpg?v=1744523751&width=1000",
        "alt": "Glided Rings Layered Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01NC023_1.jpg?v=1744523751&width=1000",
        "alt": "Glided Rings Layered Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01NC023_4_66c5c4c2-402a-4c33-af62-3fc77936c581.jpg?v=1744523751",
        "alt": "Glided Rings Layered Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01NC023-MD1_ac25480a-6142-4995-92d9-36e869cb2ebb.jpg?v=1744523751",
        "alt": "Glided Rings Layered Necklace - View 4"
      }
    ],
    "sku": "SKU-N005",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 20,
    "productPage": "products/necklaces/product5.html",
    "tags": [
      "necklaces",
      "glided"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Black Vixen Necklace",
    "category": "Necklaces",
    "description": "Bold, edgy, and irresistibly stylish — the Black Vixen Necklace is crafted in stainless steel with a striking 18k gold tone finish and accented by deep black detailing. Its sleek design makes it the perfect statement jewellery piece for those who love to stand out while keeping things effortlessly chic.",
    "price": 2651,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK486-MD1_9b8b9c96-5a1c-4054-9178-976c9c3d4685.jpg?v=1744524169&width=1000",
        "alt": "Black Vixen Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK486_1.jpg?v=1744524169&width=1000",
        "alt": "Black Vixen Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK486_4cf1517c-16c4-4986-83e0-4c5347537924.jpg?v=1744524169&width=1000",
        "alt": "Black Vixen Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK486_3_8a72ded2-3ffc-49b5-9e14-d7659f35bd85.jpg?v=1744524169&width=1000",
        "alt": "Black Vixen Necklace - View 4"
      }
    ],
    "sku": "SKU-N006",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/necklaces/product6.html",
    "tags": [
      "necklaces",
      "black"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Plain Chain Two Layer Necklace",
    "category": "Necklaces",
    "description": "The Plain Chain Two Layer Necklace brings versatile elegance with its minimalist layered design. Crafted in stainless steel with a radiant 18k gold tone, this waterproof and anti-tarnish necklace adds a chic, modern accent to any outfit. Perfect for casual, office, or evening wear, it enhances both everyday and festive ensembles with subtle sophistication.",
    "price": 2258,
    "originalPrice": 3730,
    "discount": 40,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-170_1.jpg?v=1744528483&width=1000",
        "alt": "Plain Chain Two Layer Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-170_3.jpg?v=1745910332&width=1000",
        "alt": "Plain Chain Two Layer Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-170-ML3.jpg?v=1745910304&width=1000",
        "alt": "Plain Chain Two Layer Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-170_4.jpg?v=1745910303&width=1000",
        "alt": "Plain Chain Two Layer Necklace - View 4"
      }
    ],
    "sku": "SKU-N007",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/necklaces/product7.html",
    "tags": [
      "necklaces",
      "plain"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Daisy Flower Necklace",
    "category": "Necklaces",
    "description": "Fresh, charming, and feminine, the Daisy Flower Necklace features delicate daisy motifs in a radiant gold-tone finish. Its playful station design adds elegance and a touch of whimsy, making it perfect for casual days, romantic outings, or layering with other necklaces for a modern look.",
    "price": 2511,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK346_c66afb20-7267-4bba-9de8-890e73bf463b.jpg?v=1744526702&width=1000",
        "alt": "Daisy Flower Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK346_3_c98372a1-8e47-4a91-bce6-9739094ea871.jpg?v=1744526702",
        "alt": "Daisy Flower Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK346_2_b5847f44-f5ad-4a16-af7c-3730fbb53316.jpg?v=1744526702",
        "alt": "Daisy Flower Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK346_1_101590d9-75c5-4211-9f0b-4ebb259762a3.jpg?v=1744526702",
        "alt": "Daisy Flower Necklace - View 4"
      }
    ],
    "sku": "SKU-N008",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 17,
    "productPage": "products/necklaces/product8.html",
    "tags": [
      "necklaces",
      "daisy"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Paris Heart Necklace",
    "category": "Necklaces",
    "description": "The Paris Heart Necklace showcases a delicate heart pendant on a sleek 18k gold-tone chain, exuding timeless elegance. Crafted in stainless steel with a durable finish, this waterproof and anti-tarnish necklace effortlessly enhances casual, office, or evening outfits, making it a versatile accessory for everyday wear and special occasions.",
    "price": 1999,
    "originalPrice": 2491,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC00381.jpg?v=1744529085&width=1000",
        "alt": "Paris Heart Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-044_1_f296154a-2af4-49ee-8bcf-cc944acc538d.jpg?v=1744529085&width=1000",
        "alt": "Paris Heart Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PARISHEART_da167258-9c1a-4224-84f8-f2d521a52ddc.jpg?v=1744529085&width=1000",
        "alt": "Paris Heart Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09656_cb5c9c91-a023-49be-ac39-4e632b29db41.jpg?v=1744529085&width=1000",
        "alt": "Paris Heart Necklace - View 4"
      }
    ],
    "sku": "SKU-N009",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/necklaces/product9.html",
    "tags": [
      "necklaces",
      "paris"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Black Onyx Two Layer Necklace",
    "category": "Necklaces",
    "description": "The Black Onyx Two-Layer Necklace offers bold sophistication with a contemporary layered design. Crafted in stainless steel with a radiant 18k gold tone, this waterproof and anti-tarnish necklace adds dimension and style to any outfit. Perfect for casual, office, or evening wear, its sleek layers create a versatile statement piece that enhances both minimalist and bold ensembles.",
    "price": 2471,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-055_2_0040_1.jpg?v=1745909948&width=1000",
        "alt": "Black Onyx Two Layer Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-055_1_1_0bd59ab5-cad9-4305-819c-ffc2a40bcdf3.jpg?v=1745909948&width=1000",
        "alt": "Black Onyx Two Layer Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-055_1_d544969c-adbe-440f-9ad2-941718455fda.jpg?v=1745909948&width=1000",
        "alt": "Black Onyx Two Layer Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-NECKLACE-055-ML1.jpg?v=1745909948&width=1000",
        "alt": "Black Onyx Two Layer Necklace - View 4"
      }
    ],
    "sku": "SKU-N010",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 13,
    "productPage": "products/necklaces/product10.html",
    "tags": [
      "necklaces",
      "black"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Tree of Life Necklace",
    "category": "Necklaces",
    "description": "Symbolic, elegant, and thoughtfully designed, the Tree of Life Necklace features a shimmering white cubic zirconia-embellished pendant in a radiant gold-tone finish. Its intricate motif adds meaning and sophistication to any outfit, perfect for both everyday wear and special occasions.",
    "price": 2508,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/NK288-1_1b77aa43-712d-47f0-9027-825d10aeaf15.jpg?v=1744527462&width=1000",
        "alt": "Tree of Life Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK288-MD1_eaa11d6b-f7d9-489a-b5b9-a58b19c9aaca.jpg?v=1745910664",
        "alt": "Tree of Life Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK288-MD2_fc6e865f-6191-4c46-91b6-42fcbacdf993.jpg?v=1745910664",
        "alt": "Tree of Life Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK288-ML2.jpg?v=1745910643",
        "alt": "Tree of Life Necklace - View 4"
      }
    ],
    "sku": "SKU-N011",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 10,
    "productPage": "products/necklaces/product11.html",
    "tags": [
      "necklaces",
      "tree"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Cuban Chain Hollow Heart Necklace",
    "category": "Necklaces",
    "description": "The Cuban Chain Hollow Heart Necklace combines bold chain design with a delicate heart pendant for modern elegance. Crafted in stainless steel with a radiant 18k gold tone, this waterproof and anti-tarnish necklace adds a striking yet feminine accent to any outfit. Perfect for casual, office, or evening wear, it enhances both minimalist and statement ensembles with contemporary charm.",
    "price": 2999,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/products/05_f35fce64-ab20-4d9b-8d97-ba5bccc7efab.jpg?v=1744527540&width=1000",
        "alt": "Cuban Chain Hollow Heart Necklace - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK274_5_57d5ef7c-937f-4f94-9a25-bc413afdfc0f.jpg?v=1744527540",
        "alt": "Cuban Chain Hollow Heart Necklace - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK274-MD1.jpg?v=1745910437",
        "alt": "Cuban Chain Hollow Heart Necklace - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/NK274-ML2.jpg?v=1745910438",
        "alt": "Cuban Chain Hollow Heart Necklace - View 4"
      }
    ],
    "sku": "SKU-N012",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 11,
    "productPage": "products/necklaces/product12.html",
    "tags": [
      "necklaces",
      "cuban"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Hearts All Over Bracelet",
    "category": "Bracelets",
    "description": "Keep things bold and fashionable with this stunning gold-plated bracelet featuring crystals. Designed for everyday elegance, this demi-fine jewellery piece adds charm to your wrist with its feminine heart motif and hypoallergenic build.",
    "price": 2258,
    "originalPrice": 3226,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/01_e869a853-ae2b-4543-8f22-61455b80f6a6.webp?v=1744528231&width=900",
        "alt": "Hearts All Over Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/product_1_4ece22f3-45f4-4c3c-b306-d91f8c41fe28.jpg?v=1754386754",
        "alt": "Hearts All Over Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/HeartAllOverBracelet0040.jpg?v=1754386754",
        "alt": "Hearts All Over Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Heartsallover.png?v=1754567237",
        "alt": "Hearts All Over Bracelet - View 4"
      }
    ],
    "sku": "SKU-B001",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 20,
    "productPage": "products/bracelets/product1.html",
    "tags": [
      "bracelets",
      "hearts"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Crystal Love Bangle Bracelet",
    "category": "Bracelets",
    "description": "The Crystal Love Bangle Bracelet is crafted from stainless steel with 18k gold plating and features a vibrant green synthetic stone. Waterproof and anti-tarnish, it adds a pop of color and modern elegance to any outfit, making it perfect for both casual and formal occasions.",
    "price": 2611,
    "originalPrice": 3730,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/BR076G-3_c7ce5a4d-4cd0-4348-a735-4dd80db53d5f.jpg?v=1744526847",
        "alt": "Crystal Love Bangle Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR076.jpg?v=1744526847",
        "alt": "Crystal Love Bangle Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/Artboard9_4.jpg?v=1744526847",
        "alt": "Crystal Love Bangle Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR076RG-2_9c7d0d03-ca99-473e-885f-e68db0f3abec.jpg?v=1744526847",
        "alt": "Crystal Love Bangle Bracelet - View 4"
      }
    ],
    "sku": "SKU-B002",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 18,
    "productPage": "products/bracelets/product2.html",
    "tags": [
      "bracelets",
      "crystal"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Nail Bangle Bracelet",
    "category": "Bracelets",
    "description": "Keep things bold and fashionable with this stunning gold-plated bracelet featuring crystals. Designed for everyday modern elegance, this demi-fine jewellery piece adds charm to your wrist with its fine craftsmanship and hypoallergenic build.",
    "price": 2258,
    "originalPrice": 3226,
    "discount": 30,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/BR090G-4.jpg?v=1744526375&width=1000",
        "alt": "Nail Bangle Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR090-G_2_35e2a4bd-71d5-4497-96dc-21152c4f7c1a.jpg?v=1744526375&width=1000",
        "alt": "Nail Bangle Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR090RG-2_33364190-3071-4157-a372-66c06699525e.jpg?v=1744526375&width=1000",
        "alt": "Nail Bangle Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR090-G_bf3f9a63-1c34-4dbb-a058-5b2222098d0f.jpg?v=1744526375&width=1000",
        "alt": "Nail Bangle Bracelet - View 4"
      }
    ],
    "sku": "SKU-B003",
    "material": "18K Gold Plated Brass",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/bracelets/product3.html",
    "tags": [
      "bracelets",
      "nail"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Celestia Radiant Link Bracelet",
    "category": "Bracelets",
    "description": "The Celestia Radiant Link Bracelet is an exquisite piece handcrafted from 18K gold-plated stainless steel. It features delicately interlocked oval links and a finely engraved celestial charm embellished with a cubic zirconia crystal. Waterproof, sweat-resistant, and anti-tarnish, this bracelet provides long-lasting radiance with luxurious comfort.",
    "price": 4399,
    "originalPrice": 5499,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0344_2.jpg?v=1745220216&width=900",
        "alt": "Celestia Radiant Link Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0344_1_2d6b3ec1-8207-4110-841b-7bb9be2a8530.jpg?v=1753354829&width=900",
        "alt": "Celestia Radiant Link Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0344_4.jpg?v=1753354829&width=900",
        "alt": "Celestia Radiant Link Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0344_2_372150b4-56ca-405c-853b-7f8c5b4e6226.jpg?v=1753354829&width=900",
        "alt": "Celestia Radiant Link Bracelet - View 4"
      }
    ],
    "sku": "SKU-B004",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/bracelets/product4.html",
    "tags": [
      "bracelets",
      "celestia"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Small Bar Bracelet",
    "category": "Bracelets",
    "description": "The Small Bar Bracelet blends sophistication with simplicity. Crafted from 18K gold-plated stainless steel mesh, it features a dainty circular charm symbolizing harmony and balance. The flexible mesh chain ensures a perfect fit for every wrist, offering both durability and elegance in a single piece.",
    "price": 3899,
    "originalPrice": 5999,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-012_1.jpg?v=1744528623&width=900",
        "alt": "Small Bar Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09451.jpg?v=1745909994&width=900",
        "alt": "Small Bar Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-012-ML2.jpg?v=1745909982",
        "alt": "Small Bar Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-012-1.jpg?v=1745909982",
        "alt": "Small Bar Bracelet - View 4"
      }
    ],
    "sku": "SKU-B005",
    "material": "18K Gold-Plated Stainless Steel Mesh",
    "weight": 9.6,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/bracelets/product5.html",
    "tags": [
      "bracelets",
      "small"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Multi Stone Q Clasp Bracelet",
    "category": "Bracelets",
    "description": "The Multi Stone Q Clasp Bracelet by Aurelia defines effortless sophistication. Crafted from 18K gold-plated stainless steel, this piece features bold interlocking links polished to perfection, creating a statement of refined minimalism. Tarnish-free, waterproof, and hypoallergenic, it is designed for durability, luxury, and comfort.",
    "price": 4799,
    "originalPrice": 5999,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/BR082G-3_b33544a4-51d9-4ec0-aa3f-6514e9137c48.jpg?v=1744526804&width=900",
        "alt": "Multi Stone Q Clasp Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR082G.jpg?v=1744526804",
        "alt": "Multi Stone Q Clasp Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR082G-2_36472b4b-dd9e-4ac1-ba05-42033d5c6908.jpg?v=1744526804",
        "alt": "Multi Stone Q Clasp Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR082-G.jpg?v=1744526804",
        "alt": "Multi Stone Q Clasp Bracelet - View 4"
      }
    ],
    "sku": "SKU-B006",
    "material": "18K Gold-Plated Stainless Steel",
    "weight": 10.2,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 18,
    "productPage": "products/bracelets/product6.html",
    "tags": [
      "bracelets",
      "multi"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Elegant Gold Bangle Bracelet",
    "category": "Bracelets",
    "description": "The Elegant Gold Bangle Bracelet by Aurelia is a timeless symbol of grace and modern femininity. Expertly crafted with rhodium-plated stainless steel, its reflective finish radiates elegance in every light. The bracelet features a delicate charm centerpiece that adds subtle sophistication. It is water-resistant, anti-tarnish, and skin-safe—designed for those who love everyday luxury with enduring shine.",
    "price": 3699,
    "originalPrice": 4599,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0310.jpg?v=1744515465&width=900",
        "alt": "Elegant Gold Bangle Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSBR0310-4_52654465-6ec5-4fa9-b9a8-c417a0cc4d87.jpg?v=1744515465&width=900",
        "alt": "Elegant Gold Bangle Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSBR0310-1_e882f490-1090-4d05-8178-3983883842c1.jpg?v=1744515465",
        "alt": "Elegant Gold Bangle Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSBR0310-2_06e82b09-8a71-49e4-82d1-28233ae73914.jpg?v=1744515465",
        "alt": "Elegant Gold Bangle Bracelet - View 4"
      }
    ],
    "sku": "SKU-B007",
    "material": "Rhodium-Plated Stainless Steel",
    "weight": 8.9,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 10,
    "productPage": "products/bracelets/product7.html",
    "tags": [
      "bracelets",
      "elegant"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Infinity Wish Bracelet",
    "category": "Bracelets",
    "description": "The Infinity Wish Bracelet by Aurelia combines modern artistry with everyday sophistication. Expertly crafted from 18K gold-plated stainless steel mesh, it features a polished horizontal bar that adds minimalist charm. Designed to be anti-tarnish, waterproof, and hypoallergenic, it ensures long-lasting shine and comfort. Whether worn solo or layered, it elevates any ensemble effortlessly.",
    "price": 4299,
    "originalPrice": 5399,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-027.jpg?v=1745909284&width=900",
        "alt": "Infinity Wish Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-027-ML3.jpg?v=1745909284",
        "alt": "Infinity Wish Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-027_935c2a30-fcff-4f5f-a9d6-5cc7c5043822.jpg?v=1745909284",
        "alt": "Infinity Wish Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/PM-BRACELETS-027-ML2.jpg?v=1745909275",
        "alt": "Infinity Wish Bracelet - View 4"
      }
    ],
    "sku": "SKU-B008",
    "material": "18K Gold-Plated Stainless Steel Mesh",
    "weight": 9.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/bracelets/product8.html",
    "tags": [
      "bracelets",
      "infinity"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Chunky Textured Cuff Bracelet",
    "category": "Bracelets",
    "description": "The Chunky Textured Cuff Bracelet by Aurelia redefines everyday elegance with its minimalist yet striking appeal. Handcrafted from rhodium-plated stainless steel, this bracelet features interlinked rings and a dual charm detail that adds a subtle sparkle to your wrist. Designed to be anti-tarnish, waterproof, and skin-safe, it offers both beauty and durability — perfect for casual outings or special evenings.",
    "price": 3499,
    "originalPrice": 4399,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0517_1_1.jpg?v=1754041875",
        "alt": "Chunky Textured Cuff Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0517_2.jpg?v=1754041875",
        "alt": "Chunky Textured Cuff Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0517_1.jpg?v=1754041875",
        "alt": "Chunky Textured Cuff Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/SSWBR0517_3.jpg?v=1754041826",
        "alt": "Chunky Textured Cuff Bracelet - View 4"
      }
    ],
    "sku": "SKU-B009",
    "material": "Rhodium-Plated Stainless Steel",
    "weight": 8.3,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 20,
    "productPage": "products/bracelets/product9.html",
    "tags": [
      "bracelets",
      "chunky"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Evil Eye Bracelet",
    "category": "Bracelets",
    "description": "The Evil Eye Bracelet by Aurelia embodies timeless luxury and bold femininity. Crafted from 18K gold-plated stainless steel, it features a striking hammered texture that catches light beautifully and adds depth to its golden glow. The open cuff design ensures a comfortable fit, with an anti-tarnish, waterproof, and skin-safe finish for long-lasting radiance.",
    "price": 5299,
    "originalPrice": 6599,
    "discount": 20,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/BR101-G.jpg?v=1744525436&width=900",
        "alt": "Evil Eye Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR101-G_2.jpg?v=1744525436&width=900",
        "alt": "Evil Eye Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR101-G_3.jpg?v=1744525436&width=900",
        "alt": "Evil Eye Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR101-G_4.jpg?v=1744525436&width=900",
        "alt": "Evil Eye Bracelet - View 4"
      }
    ],
    "sku": "SKU-B010",
    "material": "18K Gold-Plated Stainless Steel",
    "weight": 11.8,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 12,
    "productPage": "products/bracelets/product10.html",
    "tags": [
      "bracelets",
      "evil"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Solitary Spark Bracelet",
    "category": "Bracelets",
    "description": "The Solitary Spark Bracelet by Aurelia captures timeless grace with a modern twist. Crafted from 18K gold-plated stainless steel, it features an adjustable chain adorned with a radiant crystal centerpiece. Designed to be anti-tarnish, waterproof, and hypoallergenic, it offers enduring shine and elegance for everyday wear or gifting.",
    "price": 3899,
    "originalPrice": 4599,
    "discount": 15,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/BR167_1.jpg?v=1744524363&width=900",
        "alt": "Solitary Spark Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/1_66e2b18c-cd74-4d76-b1ca-cb24a8916343.jpg?v=1744524363&width=900",
        "alt": "Solitary Spark Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/BR167-1_06a71363-6b06-4651-9ea0-99dc0d492a9b.jpg?v=1744524363&width=900",
        "alt": "Solitary Spark Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/4_bc45cf8f-f143-4bc2-8f3e-81187d8d5ace.jpg?v=1744524363&width=900",
        "alt": "Solitary Spark Bracelet - View 4"
      }
    ],
    "sku": "SKU-B011",
    "material": "18K Gold-Plated Stainless Steel",
    "weight": 7.2,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 19,
    "productPage": "products/bracelets/product11.html",
    "tags": [
      "bracelets",
      "solitary"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Sleek Gold Beaded Bracelet",
    "category": "Bracelets",
    "description": "The Sleek Gold Beaded Bracelet by Aurelia captures timeless grace with a modern twist. Made from 18K gold-plated stainless steel, it features a delicate adjustable chain adorned with a crystal centerpiece for a subtle yet radiant touch. Designed to be anti-tarnish, waterproof, and hypoallergenic, it offers enduring shine and effortless sophistication.",
    "price": 3899,
    "originalPrice": 4599,
    "discount": 15,
    "images": [
      {
        "url": "https://palmonas.com/cdn/shop/files/PMW01BR032_2.jpg?v=1750411764&width=900",
        "alt": "Sleek Gold Beaded Bracelet - View 1"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09323_6b1c19c8-1b47-48a2-b2bc-f3f316718eb1.jpg?v=1751867179&width=900",
        "alt": "Sleek Gold Beaded Bracelet - View 2"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09294_37e59c13-0314-4f4b-8ea5-05318d7e5673.jpg?v=1751867179&width=900",
        "alt": "Sleek Gold Beaded Bracelet - View 3"
      },
      {
        "url": "https://palmonas.com/cdn/shop/files/DSC09325_a1387122-3eef-4e35-81da-5fbf91ca8431.jpg?v=1751867179&width=900",
        "alt": "Sleek Gold Beaded Bracelet - View 4"
      }
    ],
    "sku": "SKU-B012",
    "material": "18K Gold-Plated Stainless Steel",
    "weight": 7.2,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/bracelets/product12.html",
    "tags": [
      "bracelets",
      "sleek"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Golden Grace Layered Necklace Set",
    "featured": true,
    "category": "Necklaces",
    "description": "Elevate your style with the Golden Bow and Tassle Drop Earrings. These earrings feature an elegant bow design with flowing tassels that enhance any festive or evening look. Crafted with premium gold-plated stainless steel, they are durable, lightweight, and fashion-forward.",
    "price": 3999,
    "originalPrice": 4499,
    "discount": 20,
    "images": [
      {
        "url": "https://artizanjoyeria.com/cdn/shop/files/preview_images/5e9d29b3369246a5b1679c40ba2bf5e2.thumbnail.0000000000_1024x.jpg?v=1744835748",
        "alt": "Golden Grace Layered Necklace Set - View 1"
      },
      {
        "url": "https://artizanjoyeria.com/cdn/shop/files/herradura-layered-necklace-set-gold-model-artizanjoyeria.webp?crop=center&height=5120&v=1744838847&width=4096",
        "alt": "Golden Grace Layered Necklace Set - View 2"
      },
      {
        "url": "https://artizanjoyeria.com/cdn/shop/products/NECKLACE_0015.jpg?v=1744838847&width=720",
        "alt": "Golden Grace Layered Necklace Set - View 3"
      },
      {
        "url": "https://artizanjoyeria.com/cdn/shop/files/Untitleddesign_60_2.webp?v=1744838847&width=720",
        "alt": "Golden Grace Layered Necklace Set - View 4"
      }
    ],
    "sku": "SKU-H001",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 10,
    "productPage": "products/necklaces/product1.html",
    "tags": [
      "necklaces",
      "golden"
    ],
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Golden Grace Halo Hoops Earrings",
    "category": "Earrings",
    "description": "Playful yet elegant, these Halo Hoop Earrings feature a chic halo hoop design paired with delicate hooks, creating movement and charm with every turn. The polished gold finish ensures lasting shine, while the waterproof and anti-tarnish properties keep them flawless. Perfect for casual and festive occasions.",
    "price": 2499,
    "originalPrice": 3499,
    "discount": 20,
    "images": [
      {
        "url": "https://www.silkandsteel.co.nz/cdn/shop/files/Silk-and-Steel-Jewellery-Halo-44b_0e3d722c-adec-4413-a5cc-e92505daed07.jpg?v=1738633348&width=1800",
        "alt": "Golden Grace Halo Hoops Earrings - View 1"
      },
      {
        "url": "https://www.silkandsteel.co.nz/cdn/shop/files/Silk-and-Steel-Jewellery-Halo-43_05a1ebc7-8c0f-4add-937d-b6477b57768d.jpg?v=1738735590&width=1800",
        "alt": "Golden Grace Halo Hoops Earrings - View 2"
      },
      {
        "url": "https://www.silkandsteel.co.nz/cdn/shop/files/Silk-and-Steel-Jewellery-Halo-44b.jpg?v=1738735590&width=1800",
        "alt": "Golden Grace Halo Hoops Earrings - View 3"
      },
      {
        "url": "https://www.silkandsteel.co.nz/cdn/shop/files/Silk_Steel_Jewellery_-_Halo_Medium_Hoop_Earrings_-_Gold_-_RRP_99_-_E093G_-_www.silkandsteel.co.nz.jpg?v=1754363275&width=1800",
        "alt": "Golden Grace Halo Hoops Earrings - View 4"
      }
    ],
    "sku": "SKU-H002",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 17,
    "productPage": "products/earrings/product2.html",
    "tags": [
      "earrings",
      "golden"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  },
  {
    "name": "Golden Grace Stackable Rings",
    "category": "Rings",
    "description": "Elevate your everyday elegance with our Golden Grace Stackable Rings, a stunning set of delicate bands crafted from premium 18K gold-plated stainless steel. Each ring features intricate detailing and a lustrous finish that catches the light beautifully. Designed to be worn together or separately, these versatile rings offer endless styling possibilities. The hypoallergenic, nickel-free material ensures comfortable all-day wear, while the durable construction maintains its radiant shine over time. Perfect for layering or wearing solo, this timeless collection adds a touch of sophistication to any outfit.",
    "price": 3899,
    "originalPrice": 4899,
    "discount": 20,
    "images": [
      {
        "url": "https://mysmartbazaar.com/cdn/shop/files/JG-PC-RNG-2780-F1.jpg?v=1730910996&width=600",
        "alt": "Golden Grace Stackable Rings - View 1"
      },
      {
        "url": "https://mysmartbazaar.com/cdn/shop/files/JG-PC-RNG-2780-F3.jpg?v=1730910996&width=600",
        "alt": "Golden Grace Stackable Rings - View 2"
      },
      {
        "url": "https://mysmartbazaar.com/cdn/shop/files/JG-PC-RNG-2780-F1a.jpg?v=1730910996&width=600",
        "alt": "Golden Grace Stackable Rings - View 3"
      },
      {
        "url": "https://mysmartbazaar.com/cdn/shop/files/JG-PC-RNG-2780-S5a.jpg?v=1730910996&width=600",
        "alt": "Golden Grace Stackable Rings - View 4"
      }
    ],
    "sku": "SKU-H003",
    "material": "18K Gold Plated Stainless Steel",
    "weight": 10.4,
    "dimensions": {
      "length": 6.5
    },
    "stockQuantity": 16,
    "productPage": "products/rings/product3.html",
    "tags": [
      "rings",
      "golden"
    ],
    "featured": false,
    "newArrival": false,
    "bestSeller": false,
    "mostGifted": false,
    "inStock": true
  }
];

// Admin user
const adminUser = {
    name: "Admin",
    email: "admin@aurelia.com",
    password: "admin123",
    role: "admin",
    phone: "9876543210",
    emailVerified: true
};

// Seed database
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aurelia_jewelry');
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Insert products
        await Product.insertMany(products);
        console.log(`✅ Inserted ${products.length} products`);

        // Create admin user
        await User.create(adminUser);
        console.log('✅ Created admin user');
        console.log('   Email: admin@aurelia.com');
        console.log('   Password: admin123');

        console.log('\n🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
