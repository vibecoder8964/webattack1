import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.$executeRawUnsafe('DELETE FROM chat_messages');
  await prisma.$executeRawUnsafe('DELETE FROM reviews');
  await prisma.$executeRawUnsafe('DELETE FROM orders');
  await prisma.session.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create users (15 total)
  const users = [
    {
      username: 'admin',
      password: 'Th3M4st3rAdm1n!',
      email: 'admin@shopzone.internal',
      role: 'admin',
      blogUrl: '/blog/admin-secret-2024',
      twoFaEnabled: true,
      twoFaSecret: '424242',
    },
    {
      username: 'sarah_connor',
      password: 'Skynet2024!',
      email: 'sarah.connor@shopzone.com',
      role: 'customer',
      blogUrl: '/blog/sarah-tech-reviews',
      twoFaEnabled: false,
    },
    {
      username: 'customer1',
      password: 'shopper123',
      email: 'customer1@example.com',
      role: 'customer',
      twoFaEnabled: false,
    },
    {
      username: 'mike_wazowski',
      password: 'Sc4ryM0nst3r!',
      email: 'mike.w@shopzone.com',
      role: 'staff',
      blogUrl: '/blog/mike-insider-tips',
      twoFaEnabled: false,
    },
    {
      username: 'jessica_ramirez',
      password: 'D3alHunter$',
      email: 'jessica.r@shopzone.com',
      role: 'customer',
      blogUrl: '/blog/jessica-deals-hunter',
      twoFaEnabled: false,
    },
    {
      username: 'tyler_durden',
      password: 'F1ghtClUb#',
      email: 'tyler.d@example.com',
      role: 'customer',
      twoFaEnabled: false,
    },
    {
      username: 'emma_thompson',
      password: 'St4ffN0tes!',
      email: 'emma.t@shopzone.com',
      role: 'staff',
      blogUrl: '/blog/emma-staff-notes',
      twoFaEnabled: true,
      twoFaSecret: '123456',
    },
    {
      username: 'david_chen',
      password: 'T3chBl0g$1',
      email: 'david.chen@shopzone.com',
      role: 'customer',
      blogUrl: '/blog/david-tech-blog',
      twoFaEnabled: false,
    },
    {
      username: 'olivia_parker',
      password: 'Sh0pp1ng!',
      email: 'olivia.p@example.com',
      role: 'customer',
      twoFaEnabled: false,
    },
    {
      username: 'jason_bourne',
      password: 'B0urn3Id3ntity',
      email: 'jason.b@example.com',
      role: 'customer',
      twoFaEnabled: false,
    },
    {
      username: 'lisa_sullivan',
      password: 'Supp0rtT1ps!',
      email: 'lisa.s@shopzone.com',
      role: 'staff',
      blogUrl: '/blog/lisa-support-tips',
      twoFaEnabled: false,
    },
    {
      username: 'alex_kumar',
      password: 'R3v13wKing$',
      email: 'alex.k@shopzone.com',
      role: 'customer',
      blogUrl: '/blog/alex-reviews',
      twoFaEnabled: false,
    },
    {
      username: 'rachel_green',
      password: 'F4sh10n1sta!',
      email: 'rachel.g@shopzone.com',
      role: 'customer',
      blogUrl: '/blog/rachel-fashion-diary',
      twoFaEnabled: false,
    },
    {
      username: 'marcus_finch',
      password: 'D3t3ct1v3#',
      email: 'marcus.f@shopzone.com',
      role: 'customer',
      twoFaEnabled: false,
    },
    {
      username: 'naomi_watanabe',
      password: 'Gl0b3Tr0tt3r!',
      email: 'naomi.w@example.com',
      role: 'customer',
      twoFaEnabled: false,
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  // Create products (50 total - 48 released, 2 unreleased)
  const products = [
    // Electronics (8)
    { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Deep bass, crisp highs, and adaptive noise cancellation for immersive listening.', price: 89.99, category: 'Electronics', image: 'headphones.jpg', released: true, stock: 45 },
    { name: 'Smart Watch', description: 'Fitness tracking smart watch with heart rate monitor and GPS. Water resistant to 50m with always-on AMOLED display.', price: 199.99, category: 'Electronics', image: 'watch.jpg', released: true, stock: 23 },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof Bluetooth speaker with 12-hour playtime. 360-degree sound with deep bass.', price: 59.99, category: 'Electronics', image: 'speaker.jpg', released: true, stock: 56 },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with Cherry MX Blue switches. Full-size layout with wrist rest and programmable macros.', price: 79.99, category: 'Electronics', image: 'keyboard.jpg', released: true, stock: 38 },
    { name: 'Fitness Tracker Band', description: 'Slim fitness tracker with heart rate, sleep monitoring, and 7-day battery life. Syncs with iOS and Android.', price: 49.99, category: 'Electronics', image: 'tracker.jpg', released: true, stock: 64 },
    { name: 'Wireless Earbuds', description: 'True wireless earbuds with active noise cancellation. 24-hour total battery with charging case.', price: 69.99, category: 'Electronics', image: 'earbuds.jpg', released: true, stock: 83 },
    { name: 'Dashboard Camera', description: '4K dash camera with night vision and GPS. 170-degree wide angle. Loop recording and G-sensor.', price: 79.99, category: 'Electronics', image: 'dashcam.jpg', released: true, stock: 36 },
    { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand. Compatible with 10-17 inch laptops. Ergonomic design for better posture.', price: 34.99, category: 'Electronics', image: 'monitor.jpg', released: true, stock: 72 },

    // Clothing (6)
    { name: 'Running Shoes', description: 'Lightweight running shoes with advanced cushioning technology. Breathable mesh upper with reflective details.', price: 129.99, category: 'Clothing', image: 'shoes.jpg', released: true, stock: 67 },
    { name: 'Trail Running Shoes', description: 'All-terrain trail running shoes with Gore-Tex waterproof membrane. Aggressive tread for off-road grip.', price: 149.99, category: 'Clothing', image: 'trailshoes.jpg', released: true, stock: 31 },
    { name: 'Cotton T-Shirt Pack', description: 'Pack of 3 premium cotton crew neck t-shirts. Pre-shrunk, soft-washed fabric. Available in multiple color combos.', price: 29.99, category: 'Clothing', image: 'tshirt.jpg', released: true, stock: 150 },
    { name: 'Fleece Hoodie', description: 'Heavyweight fleece hoodie with kangaroo pocket. Double-lined hood with drawstring. Cozy for layering.', price: 54.99, category: 'Clothing', image: 'hoodie.jpg', released: true, stock: 88 },
    { name: 'Rain Jacket', description: 'Lightweight waterproof rain jacket with sealed seams. Packable design fits in its own pocket.', price: 74.99, category: 'Clothing', image: 'jacket.jpg', released: true, stock: 42 },
    { name: 'Wool Socks Set', description: 'Set of 6 merino wool socks. Moisture-wicking, odor-resistant, and temperature-regulating for all-day comfort.', price: 19.99, category: 'Clothing', image: 'socks.jpg', released: true, stock: 200 },

    // Food (5)
    { name: 'Organic Coffee Beans', description: 'Fair-trade organic Arabica coffee beans from Colombia. 1kg bag. Medium roast with chocolate and citrus notes.', price: 24.99, category: 'Food', image: 'coffee.jpg', released: true, stock: 120 },
    { name: 'Protein Powder', description: 'Whey protein isolate, chocolate flavor. 25g protein per serving. 2lb tub. Third-party tested for purity.', price: 44.99, category: 'Food', image: 'protein.jpg', released: true, stock: 78 },
    { name: 'Matcha Powder', description: 'Ceremonial grade Japanese matcha green tea powder. 100g tin. Stone-ground from Uji, Kyoto.', price: 29.99, category: 'Food', image: 'matcha.jpg', released: true, stock: 85 },
    { name: 'Coffee Maker', description: 'Programmable drip coffee maker with thermal carafe. Brews 12 cups. Auto-start timer and brew strength control.', price: 89.99, category: 'Food', image: 'coffeemaker.jpg', released: true, stock: 29 },
    { name: 'Tea Sampler Set', description: 'Collection of 24 premium loose leaf teas from around the world. Includes black, green, oolong, and herbal varieties.', price: 34.99, category: 'Food', image: 'teaset.jpg', released: true, stock: 55 },

    // Sports (4)
    { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat. 6mm thickness with alignment lines. Includes carrying strap.', price: 34.99, category: 'Sports', image: 'yogamat.jpg', released: true, stock: 89 },
    { name: 'Water Bottle', description: 'Insulated stainless steel water bottle. Keeps cold 24h, hot 12h. BPA-free, leak-proof lid.', price: 29.99, category: 'Sports', image: 'bottle.jpg', released: true, stock: 145 },
    { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands with varying tensions (10-50 lbs). Includes door anchor, handles, and carrying bag.', price: 24.99, category: 'Sports', image: 'bands.jpg', released: true, stock: 110 },
    { name: 'Hammock', description: 'Double parachute nylon hammock. Supports up to 500 lbs. Includes steel carabiners and tree straps.', price: 39.99, category: 'Sports', image: 'hammock.jpg', released: true, stock: 63 },

    // Home (5)
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness and color temperature. Touch control with USB charging port.', price: 39.99, category: 'Home', image: 'lamp.jpg', released: true, stock: 92 },
    { name: 'Ceramic Mug Set', description: 'Set of 4 hand-painted ceramic mugs. Microwave and dishwasher safe. 12oz each with unique designs.', price: 18.99, category: 'Home', image: 'mugs.jpg', released: true, stock: 156 },
    { name: 'Scented Candles Pack', description: 'Set of 6 premium soy wax scented candles. Lavender, vanilla, cinnamon, ocean, rose, eucalyptus. 25h burn time each.', price: 22.99, category: 'Home', image: 'candles.jpg', released: true, stock: 88 },
    { name: 'Cast Iron Skillet', description: 'Pre-seasoned 12-inch cast iron skillet. Oven safe up to 500F. Lifetime warranty. Even heat distribution.', price: 36.99, category: 'Home', image: 'skillet.jpg', released: true, stock: 59 },
    { name: 'Air Fryer', description: '5.8-quart digital air fryer with 8 preset cooking programs. Rapid air technology for crispy results with less oil.', price: 69.99, category: 'Home', image: 'airfryer.jpg', released: true, stock: 34 },

    // Accessories (5)
    { name: 'Leather Wallet', description: 'Handcrafted genuine leather bi-fold wallet. RFID blocking. 8 card slots and 2 bill compartments.', price: 49.99, category: 'Accessories', image: 'wallet.jpg', released: true, stock: 34 },
    { name: 'Sunglasses', description: 'Polarized UV400 sunglasses. Lightweight titanium frame. Includes hard case and microfiber cloth.', price: 45.99, category: 'Accessories', image: 'sunglasses.jpg', released: true, stock: 68 },
    { name: 'Baseball Cap', description: 'Adjustable washed cotton baseball cap. Vintage faded look. Metal buckle closure. One size fits most.', price: 14.99, category: 'Accessories', image: 'hat.jpg', released: true, stock: 120 },
    { name: 'Silver Ring', description: 'Sterling silver minimalist band ring. Hypoallergenic. Available in sizes 5-10. Polished finish.', price: 28.99, category: 'Accessories', image: 'ring.jpg', released: true, stock: 75 },
    { name: 'Leather Bracelet', description: 'Handwoven leather bracelet with magnetic clasp. Stainless steel accents. Adjustable length.', price: 22.99, category: 'Accessories', image: 'bracelet.jpg', released: true, stock: 93 },

    // Books (3)
    { name: 'Programming Cookbook', description: "The Complete Developer's Cookbook: 500+ recipes for modern programming. Covers Python, JavaScript, Go, and Rust.", price: 42.99, category: 'Books', image: 'cookbook.jpg', released: true, stock: 53 },
    { name: 'Sci-Fi Novel Collection', description: 'Boxed set of 5 award-winning science fiction novels. Includes collector bookmarks and author notes.', price: 54.99, category: 'Books', image: 'scifibooks.jpg', released: true, stock: 34 },
    { name: 'Puzzle Book Collection', description: 'Set of 3 brain teaser puzzle books. Sudoku, crosswords, and logic puzzles. 500+ puzzles total.', price: 19.99, category: 'Books', image: 'puzzle.jpg', released: true, stock: 67 },

    // Gaming (4)
    { name: 'Gaming Mouse', description: 'High-precision gaming mouse with 16000 DPI sensor. 8 programmable buttons. RGB lighting. Weight: 85g.', price: 64.99, category: 'Gaming', image: 'gamingmouse.jpg', released: true, stock: 72 },
    { name: 'Gaming Headset', description: '7.1 surround sound gaming headset with retractable microphone. Memory foam ear cushions. 3.5mm and USB.', price: 89.99, category: 'Gaming', image: 'gamingheadset.jpg', released: true, stock: 45 },
    { name: 'Gaming Controller', description: 'Wireless gaming controller with Hall effect joysticks. Dual vibration motors. 20-hour battery life.', price: 49.99, category: 'Gaming', image: 'controller.jpg', released: true, stock: 57 },
    { name: 'Large Mouse Pad', description: 'Extended desk mouse pad 900x400mm. Non-slip rubber base. Smooth micro-woven cloth surface. Machine washable.', price: 18.99, category: 'Gaming', image: 'mousepad.jpg', released: true, stock: 98 },

    // Beauty (4)
    { name: 'Face Moisturizer', description: 'Hyaluronic acid face moisturizer for all skin types. Paraben-free. 2oz jar. Dermatologist tested.', price: 28.99, category: 'Beauty', image: 'moisturizer.jpg', released: true, stock: 96 },
    { name: 'Vitamin C Serum', description: 'Professional grade 20% Vitamin C serum with hyaluronic acid. Brightens and firms skin. 1oz dropper bottle.', price: 32.99, category: 'Beauty', image: 'vitcserum.jpg', released: true, stock: 78 },
    { name: 'Lip Balm Set', description: 'Organic lip balm collection. 6 flavors: cherry, mint, honey, coconut, strawberry, vanilla. SPF 15.', price: 14.99, category: 'Beauty', image: 'lipbalm.jpg', released: true, stock: 134 },
    { name: 'Perfume Sampler', description: 'Discovery set of 8 premium fragrance vials. Floral, woody, citrus, and oriental notes. 2ml each.', price: 38.99, category: 'Beauty', image: 'perfume.jpg', released: true, stock: 44 },

    // Toys (3)
    { name: 'Vintage Board Game', description: "Collector's edition wooden board game set. Includes chess, checkers, and backgammon. Handcrafted pieces.", price: 34.99, category: 'Toys', image: 'boardgame.jpg', released: true, stock: 27 },
    { name: 'RC Drone', description: 'Foldable 4K camera drone with GPS and gesture control. 30-minute flight time. Beginner mode included.', price: 199.99, category: 'Toys', image: 'drone.jpg', released: true, stock: 22 },
    { name: 'Building Block Set', description: '1000-piece creative building block set. Compatible with major brands. Includes idea book with 50+ designs.', price: 44.99, category: 'Toys', image: 'lego.jpg', released: true, stock: 38 },

    // Garden (3)
    { name: 'Gardening Tool Kit', description: 'Complete 12-piece gardening tool set with carrying case. Stainless steel with wooden handles.', price: 55.99, category: 'Garden', image: 'gardenkit.jpg', released: true, stock: 41 },
    { name: 'Plant Grow Light', description: 'Full spectrum LED plant grow light. Adjustable height stand. Timer function. Perfect for indoor gardens.', price: 39.99, category: 'Garden', image: 'growlight.jpg', released: true, stock: 47 },
    { name: 'Camping Tent', description: '4-person dome tent with full rainfly. Easy setup in under 5 minutes. Includes carrying bag and stakes.', price: 89.99, category: 'Garden', image: 'tent.jpg', released: true, stock: 25 },

    // Automotive (2)
    { name: 'Car Phone Mount', description: 'Universal magnetic car phone mount. 360-degree rotation. Compatible with all smartphones. Dashboard or vent clip.', price: 19.99, category: 'Automotive', image: 'phonemount.jpg', released: true, stock: 112 },
    { name: 'Emergency Kit', description: '72-piece roadside emergency kit. Jumper cables, first aid, flashlight, tools, and warning triangle.', price: 49.99, category: 'Automotive', image: 'flashlight.jpg', released: true, stock: 33 },

    // Unreleased products (hidden via SQL injection) - 2
    { name: 'Quantum Processor X1', description: 'Experimental quantum computing processor. Pre-release version. RESTRICTED ACCESS ONLY. DO NOT LIST.', price: 4999.99, category: 'Electronics', image: 'quantum.jpg', released: false, stock: 2 },
    { name: 'Neural Interface Headset', description: 'Brain-computer interface prototype. Confidential project. NOT FOR SALE. INTERNAL TESTING ONLY.', price: 9999.99, category: 'Electronics', image: 'neural.jpg', released: false, stock: 0 },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create reviews (~40 reviews across many products)
  const reviews = [
    { productId: 1, userId: 2, rating: 5, title: 'Best headphones I ever owned!', content: 'I have been using these wireless headphones for about 3 months now and I am extremely impressed. The noise cancellation is top-notch, blocking out almost all ambient noise. Battery life easily lasts 30 hours as advertised. Sound quality is crisp with deep bass. Highly recommended for anyone who values audio quality.', verified: true },
    { productId: 1, userId: 5, rating: 4, title: 'Great value for the price', content: "Found these on a deal and couldn't be happier. The only reason I'm not giving 5 stars is the ear cushions could be softer. Otherwise, fantastic product. The stock checker on the product page is pretty handy for checking availability before ordering - I noticed it seems to query some internal service which is interesting from a tech perspective.", verified: true },
    { productId: 2, userId: 8, rating: 5, title: 'Best coffee beans ever', content: 'As a self-proclaimed coffee snob, I can confirm these are excellent beans. Rich flavor, great aroma, and you can taste the fair-trade quality difference. I go through about a bag every two weeks. Absolutely worth every penny.', verified: true },
    { productId: 3, userId: 6, rating: 3, title: 'Decent but sizing runs small', content: 'The shoes themselves are well-made and comfortable, but they run about a half size small. I had to exchange mine. The return process was relatively smooth but took about a week. Customer support was helpful though - I chatted with Mike who was very responsive.', verified: true },
    { productId: 4, userId: 4, rating: 4, title: 'Solid fitness watch', content: 'As a staff member, I get to test a lot of products. This smart watch is one of the better ones in our inventory. GPS accuracy is great for running, and the heart rate monitor is consistent. Battery life is about 3-4 days which is decent.', verified: true },
    { productId: 4, userId: 2, rating: 5, title: 'Perfect for my morning runs', content: 'I use this watch every day for my morning run. The GPS tracking is incredibly accurate and the heart rate zones help me train more effectively. Syncs well with my phone too.', verified: true },
    { productId: 5, userId: 9, rating: 4, title: 'Great yoga mat for beginners', content: "I started yoga about 6 months ago and this mat has been perfect. The grip is good, it's thick enough to protect my knees, and it rolls up easily. The only downside is it has a slight rubber smell when new, but that goes away after a few uses.", verified: true },
    { productId: 6, userId: 12, rating: 5, title: 'Amazing sound for a portable speaker', content: "I take this speaker everywhere - beach, hiking, shower. The waterproofing is legit, I've dropped it in water multiple times and it still works perfectly. Sound quality is impressive for the size.", verified: true },
    { productId: 7, userId: 7, rating: 3, title: 'Nice wallet but card slots are tight', content: 'The leather quality is excellent and it looks great. However, the card slots are quite tight - I could barely fit 4 cards in. Hoping they stretch over time. Overall decent for the price.', verified: true },
    { productId: 8, userId: 5, rating: 4, title: 'Great protein, decent flavor', content: "The chocolate flavor is pretty good, not too sweet. Mixes well in a shaker bottle with no clumps. 25g protein per serving is solid. I wish the tub was bigger for the price though - I go through this in about 3 weeks. Still, it's one of the better deals I've found on ShopZone.", verified: true },
    { productId: 9, userId: 2, rating: 5, title: 'Perfect desk companion', content: 'I work from home and this lamp has been a game changer. The adjustable color temperature is perfect for late-night coding sessions. I can switch from warm light for reading to cool light for focused work. The touch controls are intuitive and the base is heavy enough to stay put.', verified: true },
    { productId: 9, userId: 8, rating: 3, title: 'Good lamp, some quality issues', content: 'The lamp works well and has great features, but mine arrived with a slightly scratched base. The customer service response time was slow - I waited 3 days for a reply from the admin team. Eventually got it sorted but it was frustrating.', verified: false },
    { productId: 11, userId: 8, rating: 5, title: 'Clicky and satisfying', content: "Cherry MX Blue switches are exactly what I wanted. The tactile feedback is amazing for typing. RGB lighting has tons of customization options. The wrist rest is comfortable for long coding sessions. My only minor complaint is that the keycaps feel a bit cheap, but that's an easy upgrade.", verified: true },
    { productId: 12, userId: 9, rating: 4, title: 'Beautiful mugs, great gift', content: 'Bought these as a housewarming gift and they were a hit. The hand-painted designs are charming and each mug is slightly unique. They feel sturdy and go through the dishwasher no problem. The 12oz size is perfect for coffee or tea.', verified: true },
    { productId: 13, userId: 10, rating: 4, title: 'Slim and functional', content: "I wanted a fitness tracker that didn't look bulky on my wrist and this fits the bill. Heart rate monitoring seems accurate when compared to my doctor's readings. Sleep tracking is interesting but I'm not sure how accurate it is. Battery really does last about a week.", verified: true },
    { productId: 14, userId: 9, rating: 5, title: 'My apartment smells amazing now', content: 'Each candle burns for about 25-30 hours which is great value. The lavender and eucalyptus are my favorites - very natural scents, not artificial at all. Perfect for creating a relaxing atmosphere after a long day.', verified: true },
    { productId: 15, userId: 6, rating: 5, title: 'Nostalgic and well-crafted', content: 'This board game set is gorgeous. The wooden pieces have a nice weight to them, and the board itself is beautifully finished. Comes with chess, checkers, and backgammon - my friends and I have been having weekly game nights.', verified: true },
    { productId: 19, userId: 12, rating: 5, title: 'Precision beast', content: 'Upgrading to this gaming mouse was the best decision for my FPS games. The 16000 DPI sensor is incredibly precise and the weight feels perfect. The 8 programmable buttons are great for mapping abilities. RGB lighting is a nice bonus.', verified: true },
    { productId: 20, userId: 9, rating: 4, title: 'Lightweight and hydrating', content: 'I have sensitive skin and this moisturizer works great for me. No irritation or breakouts. It absorbs quickly and does not feel greasy. The hyaluronic acid really does make my skin feel plumper and more hydrated.', verified: true },
    { productId: 10, userId: 7, rating: 5, title: 'Keeps my water ice cold all day', content: "I fill this with ice water in the morning and by evening there's still ice in it. The insulation is seriously impressive. I've also used it for hot coffee and it stays hot for hours. The lid doesn't leak which is great for throwing it in my bag.", verified: true },
    { productId: 22, userId: 8, rating: 4, title: 'Perfect for cooking enthusiasts', content: 'This cast iron skillet is everything I hoped for. Pre-seasoned and ready to use out of the box. The 12-inch size is perfect for family meals. Heat distribution is even and it works great on the stove and in the oven.', verified: true },
    { productId: 28, userId: 7, rating: 4, title: 'Great for home workouts', content: "These resistance bands have been perfect for my home workout routine during the pandemic. The different tension levels let me progress gradually. The door anchor works well and feels secure. My only concern is that the bands might snap eventually, but they've held up well after 3 months of regular use.", verified: true },
    { productId: 29, userId: 10, rating: 5, title: 'My plants are thriving!', content: 'Since getting this grow light, my indoor herbs and succulents have been growing like crazy. The full spectrum light really makes a difference compared to my old cheap LED. The timer function is convenient and the adjustable height means I can use it for plants at different growth stages.', verified: true },
    { productId: 32, userId: 5, rating: 3, title: 'Good matcha but price could be better', content: 'The matcha quality is genuinely ceremonial grade - vibrant green color, smooth taste with no bitterness. However, at $29.99 for 100g, I have found similar quality for less on other sites. Still, the convenience of ordering from ShopZone is nice.', verified: true },
    { productId: 24, userId: 13, rating: 5, title: 'My favorite jacket now', content: 'This rain jacket is incredible. I wore it during a heavy downpour and stayed completely dry. The packable design is genius - it folds into its own pocket so I can always carry it in my bag. Fits true to size and looks great too.', verified: true },
    { productId: 25, userId: 14, rating: 4, title: 'Best wool socks ever', content: 'I was skeptical about spending money on fancy socks but these are worth it. No blisters on long hikes, my feet stay warm but not sweaty, and after 10 washes they still look brand new. The merino wool is the real deal.', verified: true },
    { productId: 37, userId: 13, rating: 5, title: 'Beautiful everyday ring', content: 'I bought this as a promise ring and my girlfriend loves it. The sterling silver is polished nicely and has not tarnished after a month of daily wear. Hypoallergenic as claimed - no green fingers. The minimalist design goes with everything.', verified: true },
    { productId: 40, userId: 12, rating: 5, title: 'Amazing surround sound', content: 'The 7.1 surround sound is a game-changer for competitive gaming. I can hear footsteps clearly and the directional audio is spot-on. The retractable microphone is convenient and my teammates say my voice comes through crystal clear.', verified: true },
    { productId: 41, userId: 15, rating: 4, title: 'Great controller for the price', content: 'Hall effect joysticks mean no stick drift - that alone makes this worth it. The build quality feels premium and the wireless connection is rock solid. Battery life is impressive at 20 hours. Works perfectly with my PC and Switch.', verified: true },
    { productId: 44, userId: 2, rating: 5, title: 'Visible results in 2 weeks', content: 'I have been using this Vitamin C serum every morning for two weeks and I can already see a difference. My skin looks brighter and more even-toned. The dropper makes it easy to dispense the right amount. No irritation at all.', verified: true },
    { productId: 45, userId: 9, rating: 4, title: 'Nice variety of flavors', content: 'All 6 flavors taste natural and the SPF 15 is a nice bonus. My favorites are honey and coconut. They go on smooth and do not feel waxy. The only downside is they are a bit smaller than other brands, but the quality makes up for it.', verified: true },
    { productId: 47, userId: 6, rating: 5, title: 'This drone is incredible', content: 'For $199.99, this drone punches way above its weight. The 4K camera takes stunning footage, GPS hold is rock solid, and the 30-minute flight time is generous. The beginner mode was helpful while I was learning the controls. Highly recommended!', verified: true },
    { productId: 48, userId: 10, rating: 5, title: 'All the tools you need', content: 'This gardening set has everything a home gardener needs. The tools are well-made with sharp stainless steel heads and comfortable wooden handles. The carrying case keeps everything organized. The trowel and pruners are my most-used tools.', verified: true },
    { productId: 50, userId: 14, rating: 4, title: 'Peace of mind on the road', content: 'I bought this emergency kit for my daughter who just started driving. It has everything you might need - jumper cables, first aid kit, flashlight, basic tools, and a warning triangle. The bag is compact enough to fit in the trunk. Worth every penny for the peace of mind.', verified: true },
    { productId: 16, userId: 15, rating: 4, title: 'Great for weekend camping', content: 'Setup was a breeze - my partner and I had it up in about 4 minutes. Kept us dry during a light rain. The 4-person claim is generous - comfortable for 2 adults with gear. Good ventilation and the rainfly coverage is solid.', verified: true },
    { productId: 43, userId: 8, rating: 4, title: 'Endless building possibilities', content: 'This building block set is fantastic value for 1000 pieces. The idea book has some cool designs to get you started, but the real fun is creating your own. Compatible with other brands which is a huge plus. My kids (and honestly me too) have spent hours building.', verified: true },
  ];

  for (const review of reviews) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO reviews (product_id, user_id, rating, title, content, verified, created_at) VALUES (${review.productId}, ${review.userId}, ${review.rating}, '${review.title.replace(/'/g, "''")}', '${review.content.replace(/'/g, "''")}', ${review.verified ? 1 : 0}, datetime('now', '-${Math.floor(Math.random() * 60)} days'))`
    );
  }

  // Create chat messages (10 sessions with rich conversations)
  const chatMessages = [
    // Session 1: Shipping delay inquiry
    { sessionId: 'chat-001', userId: 5, sender: 'customer', message: 'Hi, I placed an order 5 days ago and it still shows as pending. Order #1042. Can you check on this?' },
    { sessionId: 'chat-001', userId: 4, sender: 'support', message: 'Hello Jessica! Let me look into that for you. One moment please.' },
    { sessionId: 'chat-001', userId: 4, sender: 'support', message: "I can see your order is currently being processed at our warehouse. It should ship within the next 24-48 hours. We experienced a slight delay due to high order volume this week." },
    { sessionId: 'chat-001', userId: 5, sender: 'customer', message: 'Ok, thanks for checking. Do you have a tracking number yet?' },
    { sessionId: 'chat-001', userId: 4, sender: 'support', message: "Not yet, but once it ships you'll receive an email with the tracking info. Is there anything else I can help with?" },
    { sessionId: 'chat-001', userId: 5, sender: 'customer', message: "No that's all. Thanks Mike!" },
    { sessionId: 'chat-001', userId: 4, sender: 'support', message: "You're welcome! Have a great day!" },

    // Session 2: Product returns
    { sessionId: 'chat-002', userId: 6, sender: 'customer', message: "I need to return the running shoes I bought. They don't fit right." },
    { sessionId: 'chat-002', userId: 11, sender: 'support', message: "Hi Tyler! I'm sorry to hear the shoes don't fit. I can help you with the return process." },
    { sessionId: 'chat-002', userId: 6, sender: 'customer', message: 'Great, what do I need to do?' },
    { sessionId: 'chat-002', userId: 11, sender: 'support', message: "You'll need to package the shoes in their original box if possible. Then you can print a return label from your order history page. The refund will be processed within 5-7 business days after we receive the item." },
    { sessionId: 'chat-002', userId: 6, sender: 'customer', message: 'Do I have to pay for return shipping?' },
    { sessionId: 'chat-002', userId: 11, sender: 'support', message: 'For clothing items, return shipping is free! The label is prepaid. Just drop it off at any authorized shipping location.' },
    { sessionId: 'chat-002', userId: 6, sender: 'customer', message: 'Perfect, thanks Lisa!' },
    { sessionId: 'chat-002', userId: 11, sender: 'support', message: 'Happy to help! Let us know if you need anything else.' },

    // Session 3: Stock availability question - hints at SSRF
    { sessionId: 'chat-003', userId: 7, sender: 'customer', message: 'Hey, I was wondering about the stock checker feature on the product pages. How accurate is it?' },
    { sessionId: 'chat-003', userId: 4, sender: 'support', message: 'Hi Emma! The stock checker queries our inventory system in real-time, so it should be quite accurate. Just click the "Check Stock" button on any product page.' },
    { sessionId: 'chat-003', userId: 7, sender: 'customer', message: "I noticed it makes a request to some kind of API when you click it. What URL does it hit? I'm curious about the tech stack." },
    { sessionId: 'chat-003', userId: 4, sender: 'support', message: "It connects to our internal inventory service to get real-time stock levels. The technical details are proprietary but I can tell you it's a microservice architecture. Is there a specific product you're checking availability for?" },
    { sessionId: 'chat-003', userId: 7, sender: 'customer', message: "Just curious! I'm a bit of a tech nerd. Also, are there any products that are out of stock that might be coming back?" },
    { sessionId: 'chat-003', userId: 4, sender: 'support', message: 'We restock popular items regularly. If something is out of stock, you can usually check back in a week or two. The stock checker button is the best way to verify current availability for any product.' },

    // Session 4: Account access complaint - hints at internal admin port
    { sessionId: 'chat-004', userId: 10, sender: 'customer', message: "I'm having trouble logging into my account. It keeps saying invalid password but I'm sure I'm using the right one." },
    { sessionId: 'chat-004', userId: 11, sender: 'support', message: "Hi Olivia! I'm sorry to hear you're having login issues. Let me help you with that." },
    { sessionId: 'chat-004', userId: 10, sender: 'customer', message: "I've tried multiple times. The error message just says \"Invalid password\" which is weird because I know my password." },
    { sessionId: 'chat-004', userId: 11, sender: 'support', message: "That error means the username exists in our system but the password doesn't match. Could you try resetting your password? There should be a \"Forgot Password\" option on the login page... actually, let me check if we have that feature yet." },
    { sessionId: 'chat-004', userId: 10, sender: 'customer', message: "I don't see a forgot password link anywhere on the login page." },
    { sessionId: 'chat-004', userId: 11, sender: 'support', message: "You're right, it seems we haven't implemented that yet. Let me escalate this to our admin team. In the meantime, you could try creating a new account with a different username, or I can have someone from the technical team look into your account directly. We have an internal admin port that our tech team uses for account management, but customers don't have access to that." },
    { sessionId: 'chat-004', userId: 10, sender: 'customer', message: 'An internal admin port? That sounds interesting. What port is it on?' },
    { sessionId: 'chat-004', userId: 11, sender: 'support', message: "Oh, I probably shouldn't have mentioned that! It's just an internal tool our developers use. Don't worry about it. Let me get your account sorted out through proper channels. Can you confirm your email address so I can verify your account?" },
    { sessionId: 'chat-004', userId: 10, sender: 'customer', message: 'Sure, it is olivia.p@example.com' },
    { sessionId: 'chat-004', userId: 11, sender: 'support', message: 'Got it! I can see your account. Let me send you a password reset link to that email. You should receive it within the next few minutes.' },

    // Session 5: Tech-savvy customer asking about website structure
    { sessionId: 'chat-005', userId: 12, sender: 'customer', message: 'Hey, I was browsing the site and found some interesting things. The product images seem to load from a special endpoint - sometimes I see file paths in error messages when images fail to load.' },
    { sessionId: 'chat-005', userId: 11, sender: 'support', message: "Hi Alex! Thanks for letting us know about that. Our dev team is aware of some display issues with the image loading. Could you tell me which product pages you saw the errors on?" },
    { sessionId: 'chat-005', userId: 12, sender: 'customer', message: "It happened on a few pages. Also, I noticed there's a robots.txt file that mentions some admin paths. Is the admin area supposed to be accessible?" },
    { sessionId: 'chat-005', userId: 11, sender: 'support', message: "The robots.txt is just for search engine crawlers - it tells them which pages not to index. The admin area requires special authentication so regular users can't access it. Thanks for your concern though!" },
    { sessionId: 'chat-005', userId: 12, sender: 'customer', message: "Makes sense! By the way, I was reading the config files... err, I mean the about page. Where can I find more info about how the site works?" },
    { sessionId: 'chat-005', userId: 11, sender: 'support', message: 'We have a help section and FAQ that covers most topics. If you have specific technical questions, you can email our dev team at dev@shopzone.internal. Is there anything else I can help with today?' },

    // Session 6: Rachel asking about fashion products - casual chat with hints
    { sessionId: 'chat-006', userId: 13, sender: 'customer', message: 'Hi! Do you have any new arrivals in the clothing section? I am always looking for the latest fashion trends.' },
    { sessionId: 'chat-006', userId: 4, sender: 'support', message: 'Hi Rachel! We just got some new fleece hoodies and rain jackets in stock. They are very popular this season. Would you like me to check sizes for you?' },
    { sessionId: 'chat-006', userId: 13, sender: 'customer', message: 'Oh nice! By the way, I was looking at other users profiles to see what they bought, and I noticed I can see their order history by just changing the URL. Is that normal?' },
    { sessionId: 'chat-006', userId: 4, sender: 'support', message: "Hmm, that shouldn't be possible. Let me look into that. Which URL were you on exactly?" },
    { sessionId: 'chat-006', userId: 13, sender: 'customer', message: 'The orders page - I noticed the URL has a userId parameter. I just changed the number and saw someone else orders. Also works on the profile page with the id parameter!' },
    { sessionId: 'chat-006', userId: 4, sender: 'support', message: "Thank you for reporting that. I'll flag this with the dev team. In the meantime, please don't access other users' data. Is there anything else I can help with?" },
    { sessionId: 'chat-006', userId: 13, sender: 'customer', message: "Of course! I was just testing. Also, I read on someone's blog that the site uses cookies for role-based access. Like, if you change your 'role' cookie from 'customer' to 'admin', could you access admin features? Just curious!" },
    { sessionId: 'chat-006', userId: 4, sender: 'support', message: "Our access control system is more robust than that... I think. But I'm not on the dev team so I can't say for certain. I'd recommend not modifying cookies on any website. Anyway, about those hoodies - should I reserve one for you?" },

    // Session 7: Marcus asking about security features - probing questions
    { sessionId: 'chat-007', userId: 14, sender: 'customer', message: 'Hello, I am a cybersecurity researcher. I was wondering about the security of your website. Do you have a bug bounty program?' },
    { sessionId: 'chat-007', userId: 11, sender: 'support', message: "Hi Marcus! We don't currently have a formal bug bounty program, but we take security seriously. If you find any vulnerabilities, please report them to security@shopzone.com." },
    { sessionId: 'chat-007', userId: 14, sender: 'customer', message: "I noticed your login page gives different error messages for non-existent usernames vs wrong passwords. That is a classic username enumeration vulnerability. Have you considered fixing that?" },
    { sessionId: 'chat-007', userId: 11, sender: 'support', message: "Thank you for pointing that out. I'll pass this feedback to our development team. We're always looking to improve our security." },
    { sessionId: 'chat-007', userId: 14, sender: 'customer', message: "Also, I tested the product category filter and it seems vulnerable to SQL injection. I was able to retrieve unreleased products using OR 1=1 in the category parameter. You might want to use parameterized queries." },
    { sessionId: 'chat-007', userId: 11, sender: 'support', message: "That's concerning to hear. I'll escalate this to our security team immediately. Thank you for the responsible disclosure. Is there anything else you've found?" },
    { sessionId: 'chat-007', userId: 14, sender: 'customer', message: "Well, I also noticed your stock checker makes server-side requests to URLs that users can control. That is a textbook SSRF vulnerability. An attacker could use that to probe your internal network. Do you have any internal services running?" },
    { sessionId: 'chat-007', userId: 11, sender: 'support', message: "I'm not at liberty to discuss our internal infrastructure. But I'll make sure the security team reviews the stock checker functionality. Thank you again for your findings." },

    // Session 8: Naomi asking about international shipping
    { sessionId: 'chat-008', userId: 15, sender: 'customer', message: 'Hi there! I am visiting from Japan and I was wondering if you ship internationally?' },
    { sessionId: 'chat-008', userId: 11, sender: 'support', message: "Hi Naomi! Currently we only ship within the United States. We're working on expanding to international shipping next year." },
    { sessionId: 'chat-008', userId: 15, sender: 'customer', message: 'That is too bad. I really wanted to order the matcha powder as a gift! By the way, I noticed your site has some interesting API endpoints. I was looking at the network requests in my browser and saw some URLs like /api/internal-admin. What is that?' },
    { sessionId: 'chat-008', userId: 11, sender: 'support', message: "The /api/internal-admin endpoint is for internal use only. It's not meant for customer access. How did you come across that URL?" },
    { sessionId: 'chat-008', userId: 15, sender: 'customer', message: 'Oh I was just browsing the network tab while using the site. The stock checker feature seemed to make interesting requests. I tried accessing that endpoint directly but it just returned some JSON about admin services and port 3071.' },
    { sessionId: 'chat-008', userId: 11, sender: 'support', message: "Hmm, that endpoint shouldn't be directly accessible. I'll report this to our tech team. In the meantime, please don't try to access internal endpoints. They may contain sensitive information." },

    // Session 9: David asking about file upload
    { sessionId: 'chat-009', userId: 8, sender: 'customer', message: "Hey, I was trying to upload a profile picture but it keeps saying only images are allowed. I tried uploading a .txt file and it was rejected. Makes sense." },
    { sessionId: 'chat-009', userId: 4, sender: 'support', message: "Hi David! That's correct - our upload system only accepts image files (JPEG, PNG, GIF) for security reasons." },
    { sessionId: 'chat-009', userId: 8, sender: 'customer', message: "Right, but I noticed it only checks the Content-Type header, not the actual file content. I was able to upload a PHP file by setting the Content-Type to image/jpeg. The file went through! Is that supposed to happen?" },
    { sessionId: 'chat-009', userId: 4, sender: 'support', message: "That definitely shouldn't happen. Let me report this to our admin team. The upload feature is only available to admin users through the dashboard, so the risk should be limited. But you're right that the Content-Type check alone is not sufficient." },
    { sessionId: 'chat-009', userId: 8, sender: 'customer', message: "Yeah, I was only able to test it because I noticed the admin dashboard cookies are not properly validated. The role is just stored in a client-side cookie. If someone changed their role cookie to 'admin', they could access the upload feature." },
    { sessionId: 'chat-009', userId: 4, sender: 'support', message: "David, I appreciate your security testing, but I need to ask you to stop probing our systems. Our security team will review these issues. Is there anything else I can help you with that doesn't involve security testing?" },
    { sessionId: 'chat-009', userId: 8, sender: 'customer', message: "Sorry about that! I'm just curious by nature. One last thing - I also noticed the diagnostic tool in the admin panel runs ping commands. It looks like it directly interpolates user input into the shell command without sanitization. That could allow command injection. OK I'm done now, I promise!" },

    // Session 10: General chat about the site
    { sessionId: 'chat-010', userId: 3, sender: 'customer', message: 'Hello! I just created my account and I am excited to start shopping. Any recommendations for a first-time buyer?' },
    { sessionId: 'chat-010', userId: 11, sender: 'support', message: "Welcome to ShopZone! We're happy to have you. I'd recommend checking out our trending section on the homepage for popular items. The Wireless Headphones and Smart Watch are customer favorites." },
    { sessionId: 'chat-010', userId: 3, sender: 'customer', message: 'Great! Also, how do I find other users profiles? I want to see what people are buying.' },
    { sessionId: 'chat-010', userId: 11, sender: 'support', message: "You can visit the profile page and use the profile lookup feature. You can navigate between user profiles using the arrows at the bottom of the page. Each user's profile shows their public information." },
    { sessionId: 'chat-010', userId: 3, sender: 'customer', message: "Cool, I can see some users have blog links on their profiles. That is a nice touch! I read Sarah's tech review blog and she mentioned something about the stock checker using an internal API. That sounds fancy." },
    { sessionId: 'chat-010', userId: 11, sender: 'support', message: "Yes, our stock checker uses an internal service to verify real-time inventory. It's a useful feature when items are running low. Is there anything specific you'd like to order?" },
    { sessionId: 'chat-010', userId: 3, sender: 'customer', message: "I think I will get the coffee beans and maybe a mug set. By the way, I saw in the robots.txt that there is an admin panel at /admin-panel-x7k9m. Is that for staff only?" },
    { sessionId: 'chat-010', userId: 11, sender: 'support', message: "Yes, the admin panel is restricted to authorized staff with admin privileges and two-factor authentication. Regular users cannot access it. Now, would you like me to add those items to a wishlist for you?" },
  ];

  for (const msg of chatMessages) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO chat_messages (session_id, user_id, sender, message, created_at) VALUES ('${msg.sessionId}', ${msg.userId}, '${msg.sender}', '${msg.message.replace(/'/g, "''")}', datetime('now', '-${Math.floor(Math.random() * 14)} days', '+${Math.floor(Math.random() * 24)} hours'))`
    );
  }

  // Create orders (~25)
  const orders = [
    { userId: 2, status: 'delivered', total: 189.98, items: JSON.stringify([{productId: 1, name: 'Wireless Headphones', qty: 1, price: 89.99}, {productId: 9, name: 'Desk Lamp', qty: 1, price: 39.99}, {productId: 10, name: 'Water Bottle', qty: 2, price: 29.99}]), shippingAddr: '1234 Tech Ave, San Francisco, CA 94102' },
    { userId: 2, status: 'shipped', total: 199.99, items: JSON.stringify([{productId: 4, name: 'Smart Watch', qty: 1, price: 199.99}]), shippingAddr: '1234 Tech Ave, San Francisco, CA 94102' },
    { userId: 3, status: 'delivered', total: 74.98, items: JSON.stringify([{productId: 5, name: 'Yoga Mat', qty: 1, price: 34.99}, {productId: 8, name: 'Protein Powder', qty: 1, price: 44.99}]), shippingAddr: '567 Wellness Blvd, Austin, TX 73301' },
    { userId: 5, status: 'delivered', total: 24.99, items: JSON.stringify([{productId: 2, name: 'Organic Coffee Beans', qty: 1, price: 24.99}]), shippingAddr: '890 Deal Street, Portland, OR 97201' },
    { userId: 5, status: 'pending', total: 148.98, items: JSON.stringify([{productId: 8, name: 'Protein Powder', qty: 1, price: 44.99}, {productId: 1, name: 'Wireless Headphones', qty: 1, price: 89.99}, {productId: 14, name: 'Scented Candles Pack', qty: 1, price: 22.99}]), shippingAddr: '890 Deal Street, Portland, OR 97201' },
    { userId: 6, status: 'cancelled', total: 129.99, items: JSON.stringify([{productId: 3, name: 'Running Shoes', qty: 1, price: 129.99}]), shippingAddr: '456 Fight Club Ln, Wilmington, DE 19801' },
    { userId: 7, status: 'delivered', total: 89.99, items: JSON.stringify([{productId: 6, name: 'Bluetooth Speaker', qty: 1, price: 59.99}, {productId: 7, name: 'Leather Wallet', qty: 1, price: 49.99}]), shippingAddr: '321 Staff Row, Chicago, IL 60601' },
    { userId: 8, status: 'shipped', total: 167.98, items: JSON.stringify([{productId: 11, name: 'Mechanical Keyboard', qty: 1, price: 79.99}, {productId: 19, name: 'Gaming Mouse', qty: 1, price: 64.99}, {productId: 22, name: 'Cast Iron Skillet', qty: 1, price: 36.99}]), shippingAddr: '101 Binary Way, Seattle, WA 98101' },
    { userId: 8, status: 'delivered', total: 42.99, items: JSON.stringify([{productId: 18, name: 'Programming Cookbook', qty: 1, price: 42.99}]), shippingAddr: '101 Binary Way, Seattle, WA 98101' },
    { userId: 9, status: 'pending', total: 103.97, items: JSON.stringify([{productId: 12, name: 'Ceramic Mug Set', qty: 1, price: 18.99}, {productId: 20, name: 'Face Moisturizer', qty: 1, price: 28.99}, {productId: 14, name: 'Scented Candles Pack', qty: 1, price: 22.99}, {productId: 24, name: 'Vitamin C Serum', qty: 1, price: 32.99}]), shippingAddr: '222 Yoga Lane, Denver, CO 80201' },
    { userId: 10, status: 'shipped', total: 249.98, items: JSON.stringify([{productId: 4, name: 'Smart Watch', qty: 1, price: 199.99}, {productId: 13, name: 'Fitness Tracker Band', qty: 1, price: 49.99}]), shippingAddr: '789 Wellness Dr, Miami, FL 33101' },
    { userId: 12, status: 'delivered', total: 154.98, items: JSON.stringify([{productId: 19, name: 'Gaming Mouse', qty: 1, price: 64.99}, {productId: 26, name: 'Gaming Headset', qty: 1, price: 89.99}]), shippingAddr: '555 Review Blvd, Boston, MA 02101' },
    { userId: 12, status: 'pending', total: 54.99, items: JSON.stringify([{productId: 25, name: 'Sci-Fi Novel Collection', qty: 1, price: 54.99}]), shippingAddr: '555 Review Blvd, Boston, MA 02101' },
    { userId: 2, status: 'cancelled', total: 44.99, items: JSON.stringify([{productId: 8, name: 'Protein Powder', qty: 1, price: 44.99}]), shippingAddr: '1234 Tech Ave, San Francisco, CA 94102' },
    { userId: 6, status: 'shipped', total: 79.98, items: JSON.stringify([{productId: 16, name: 'Gardening Tool Kit', qty: 1, price: 55.99}, {productId: 17, name: 'Car Phone Mount', qty: 1, price: 19.99}]), shippingAddr: '456 Fight Club Ln, Wilmington, DE 19801' },
    { userId: 7, status: 'delivered', total: 34.99, items: JSON.stringify([{productId: 15, name: 'Vintage Board Game', qty: 1, price: 34.99}]), shippingAddr: '321 Staff Row, Chicago, IL 60601' },
    { userId: 11, status: 'delivered', total: 64.98, items: JSON.stringify([{productId: 28, name: 'Resistance Bands Set', qty: 1, price: 24.99}, {productId: 6, name: 'Bluetooth Speaker', qty: 1, price: 59.99}]), shippingAddr: '654 Support Circle, Nashville, TN 37201' },
    { userId: 3, status: 'shipped', total: 29.99, items: JSON.stringify([{productId: 2, name: 'Organic Coffee Beans', qty: 1, price: 24.99}]), shippingAddr: '567 Wellness Blvd, Austin, TX 73301' },
    { userId: 13, status: 'delivered', total: 124.98, items: JSON.stringify([{productId: 24, name: 'Rain Jacket', qty: 1, price: 74.99}, {productId: 36, name: 'Cotton T-Shirt Pack', qty: 1, price: 29.99}, {productId: 38, name: 'Wool Socks Set', qty: 1, price: 19.99}]), shippingAddr: '77 Fashion Ave, New York, NY 10001' },
    { userId: 15, status: 'shipped', total: 94.98, items: JSON.stringify([{productId: 32, name: 'Matcha Powder', qty: 1, price: 29.99}, {productId: 27, name: 'Hammock', qty: 1, price: 39.99}, {productId: 12, name: 'Ceramic Mug Set', qty: 1, price: 18.99}]), shippingAddr: '3 Sakura Lane, San Jose, CA 95110' },
    { userId: 14, status: 'delivered', total: 149.98, items: JSON.stringify([{productId: 47, name: 'RC Drone', qty: 1, price: 199.99}]), shippingAddr: '221B Baker St, London, KY 40741' },
    { userId: 5, status: 'shipped', total: 59.98, items: JSON.stringify([{productId: 31, name: 'Air Fryer', qty: 1, price: 69.99}, {productId: 21, name: 'Wireless Earbuds', qty: 1, price: 69.99}]), shippingAddr: '890 Deal Street, Portland, OR 97201' },
    { userId: 9, status: 'pending', total: 39.99, items: JSON.stringify([{productId: 30, name: 'Hammock', qty: 1, price: 39.99}]), shippingAddr: '222 Yoga Lane, Denver, CO 80201' },
    { userId: 13, status: 'pending', total: 28.99, items: JSON.stringify([{productId: 37, name: 'Silver Ring', qty: 1, price: 28.99}]), shippingAddr: '77 Fashion Ave, New York, NY 10001' },
    { userId: 10, status: 'delivered', total: 64.98, items: JSON.stringify([{productId: 45, name: 'Lip Balm Set', qty: 1, price: 14.99}, {productId: 20, name: 'Face Moisturizer', qty: 1, price: 28.99}, {productId: 33, name: 'Lip Balm Set', qty: 1, price: 14.99}]), shippingAddr: '789 Wellness Dr, Miami, FL 33101' },
  ];

  for (const order of orders) {
    await prisma.$executeRawUnsafe(
      `INSERT INTO orders (user_id, status, total, items, shipping_addr, created_at) VALUES (${order.userId}, '${order.status}', ${order.total}, '${order.items.replace(/'/g, "''")}', ${order.shippingAddr ? "'" + order.shippingAddr.replace(/'/g, "''") + "'" : 'NULL'}, datetime('now', '-${Math.floor(Math.random() * 60)} days'))`
    );
  }

  console.log('Database seeded successfully!');
  console.log('Users created: 15 (1 admin, 3 staff, 11 customers)');
  console.log('Products created: 48 released, 2 unreleased = 50 total');
  console.log('Reviews created: ~40');
  console.log('Chat sessions: 10 with rich conversations');
  console.log('Orders created: ~25');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
