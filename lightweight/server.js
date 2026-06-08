const express = require('express'), fs = require('fs'), path = require('path'), { exec } = require('child_process');
const app = express();
app.use(express.json()); app.use(express.urlencoded({ extended: true })); app.use(express.static('public'));
app.use((req, res, next) => { req.cookies = {}; (req.headers.cookie||'').split(';').forEach(c => { const [k,...v] = c.trim().split('='); if(k) req.cookies[k] = v.join('='); }); next(); });

const DATA = path.join(__dirname, 'ctf-data');
const IMG = path.join(DATA, 'var', 'www', 'images');
const UPLOAD = path.join(DATA, 'uploads');
[UPLOAD, IMG].forEach(d => { if(!fs.existsSync(d)) fs.mkdirSync(d, {recursive:true}); });

// ── Data ──
const users = [
  {id:1,username:'admin',password:'Sz@dm1n_2024!',email:'admin@shopzone.internal',role:'admin',blogUrl:'https://mike-wazowski-tech.blogspot.com',twoFaEnabled:true,twoFaSecret:'482916'},
  {id:2,username:'mike_wazowski',password:'m1k3_iz_w@tch1ng',email:'mike.w@shopzone.com',role:'admin',blogUrl:'https://mike-wazowski-tech.blogspot.com',twoFaEnabled:true,twoFaSecret:'735421'},
  {id:3,username:'lisa_sullivan',password:'L1s4Supp0rt!',email:'lisa.s@shopzone.com',role:'support',blogUrl:null,twoFaEnabled:false,twoFaSecret:null},
  {id:4,username:'jessica_ramirez',password:'j3ssR4m!',email:'jessica.r@email.com',role:'customer',blogUrl:'https://jessicarWrites.wordpress.com',twoFaEnabled:false,twoFaSecret:null},
  {id:5,username:'tyler_durden',password:'tyl3rD!23',email:'tyler.d@email.com',role:'customer',blogUrl:null,twoFaEnabled:false,twoFaSecret:null},
  {id:6,username:'emma_thompson',password:'3mm@Th0mp!',email:'emma.t@email.com',role:'customer',blogUrl:'https://emmasfinds.tumblr.com',twoFaEnabled:false,twoFaSecret:null},
  {id:7,username:'olivia_parker',password:'0l1v1@P!',email:'olivia.p@email.com',role:'customer',blogUrl:null,twoFaEnabled:false,twoFaSecret:null},
  {id:8,username:'alex_kumar',password:'@l3xKum4r!',email:'alex.k@email.com',role:'customer',blogUrl:null,twoFaEnabled:false,twoFaSecret:null},
  {id:9,username:'rachel_green',password:'r@ch3lG!',email:'rachel.g@email.com',role:'customer',blogUrl:'https://rachelgreenfashion.medium.com',twoFaEnabled:false,twoFaSecret:null},
  {id:10,username:'marcus_chen',password:'m4rcusCh3n!',email:'marcus.c@email.com',role:'customer',blogUrl:null,twoFaEnabled:false,twoFaSecret:null},
];
let nextUserId = 11;
const sessions = {};

const products = [
  {id:1,name:'Wireless Headphones',desc:'Premium noise-cancelling over-ear headphones with 30-hour battery',price:89.99,cat:'Electronics',img:'headphones.jpg',stock:45},
  {id:2,name:'Smart Watch',desc:'GPS-enabled fitness tracker with heart rate monitor',price:199.99,cat:'Electronics',img:'watch.jpg',stock:23},
  {id:3,name:'Organic Coffee Beans',desc:'Fair-trade single-origin arabica, 1kg bag, medium roast',price:24.99,cat:'Food',img:'coffee.jpg',stock:120},
  {id:4,name:'Running Shoes',desc:'Lightweight breathable mesh running shoes with cushioned soles',price:79.99,cat:'Sports',img:'shoes.jpg',stock:67},
  {id:5,name:'Bluetooth Speaker',desc:'Portable waterproof Bluetooth speaker with 360-degree sound',price:49.99,cat:'Electronics',img:'speaker.jpg',stock:89},
  {id:6,name:'Yoga Mat',desc:'Extra-thick non-slip eco-friendly yoga mat with strap',price:29.99,cat:'Sports',img:'yogamat.jpg',stock:56},
  {id:7,name:'LED Desk Lamp',desc:'Adjustable LED desk lamp with USB charging port',price:34.99,cat:'Home',img:'lamp.jpg',stock:78},
  {id:8,name:'Leather Wallet',desc:'Genuine leather bifold wallet with RFID blocking',price:39.99,cat:'Accessories',img:'wallet.jpg',stock:92},
  {id:9,name:'Sci-Fi Book Collection',desc:'Curated set of 5 bestselling science fiction novels',price:44.99,cat:'Books',img:'scifibooks.jpg',stock:34},
  {id:10,name:'Gaming Controller',desc:'Wireless gaming controller with haptic feedback',price:59.99,cat:'Gaming',img:'controller.jpg',stock:41},
  {id:11,name:'Vitamin C Serum',desc:'Organic brightening face serum with hyaluronic acid',price:19.99,cat:'Beauty',img:'vitcserum.jpg',stock:150},
  {id:12,name:'Water Bottle',desc:'Insulated stainless steel, keeps drinks cold 24 hours',price:22.99,cat:'Sports',img:'bottle.jpg',stock:110},
  {id:13,name:'Mechanical Keyboard',desc:'RGB mechanical keyboard with Cherry MX switches',price:129.99,cat:'Electronics',img:'keyboard.jpg',stock:28},
  {id:14,name:'Sunglasses',desc:'Polarized UV400 aviator sunglasses with metal frame',price:54.99,cat:'Accessories',img:'sunglasses.jpg',stock:73},
  {id:15,name:'Gaming Mouse',desc:'High-precision gaming mouse with 16000 DPI',price:69.99,cat:'Gaming',img:'gamingmouse.jpg',stock:35},
  {id:16,name:'Camping Tent',desc:'4-person waterproof camping tent with easy setup',price:149.99,cat:'Garden',img:'tent.jpg',stock:19},
  {id:17,name:'Moisturizer Cream',desc:'Hydrating day cream with SPF 30 and natural ingredients',price:15.99,cat:'Beauty',img:'moisturizer.jpg',stock:200},
  {id:18,name:'Board Game',desc:'Strategy board game for 2-6 players, ages 10+',price:34.99,cat:'Toys',img:'boardgame.jpg',stock:52},
  {id:19,name:'Matcha Powder',desc:'Premium ceremonial grade Japanese matcha, 100g',price:28.99,cat:'Food',img:'matcha.jpg',stock:85},
  {id:20,name:'Hair Dryer',desc:'Ionic hair dryer with 3 heat settings and diffuser',price:59.99,cat:'Beauty',img:'hairdryer.jpg',stock:44},
  {id:21,name:'Drone Mini',desc:'Foldable mini drone with 4K camera, 30-min flight',price:299.99,cat:'Electronics',img:'drone.jpg',stock:12},
  {id:22,name:'T-Shirt Pack',desc:'5-pack premium cotton crew neck t-shirts',price:34.99,cat:'Clothing',img:'tshirt.jpg',stock:200},
  {id:23,name:'Cast Iron Skillet',desc:'Pre-seasoned 12-inch cast iron skillet',price:36.99,cat:'Home',img:'skillet.jpg',stock:54},
  {id:24,name:'Power Bank',desc:'20000mAh portable charger with dual USB output',price:29.99,cat:'Electronics',img:'powerbank.jpg',stock:75},
  {id:25,name:'Coffee Maker',desc:'Programmable 12-cup drip coffee maker with thermal carafe',price:79.99,cat:'Home',img:'coffeemaker.jpg',stock:48},
];

const reviews = [
  {id:1,productId:1,userId:4,rating:5,title:'Best headphones ever!',content:'Noise cancellation is incredible. Battery easily lasts 2 days. Sound quality is crisp and bass is deep without being muddy.',verified:true,username:'jessica_ramirez'},
  {id:2,productId:2,userId:6,rating:5,title:'Perfect for running',content:'GPS tracking is incredibly accurate. Heart rate monitor matches my chest strap. Battery lasts a full week of workouts.',verified:true,username:'emma_thompson'},
  {id:3,productId:3,userId:7,rating:5,title:'Amazing coffee',content:'Rich smooth flavor with no bitterness. Fair-trade certified. Best value coffee I have found anywhere online.',verified:true,username:'olivia_parker'},
  {id:4,productId:13,userId:10,rating:5,title:'Clicky perfection',content:'Cherry MX Blue switches feel amazing. RGB customization is extensive. Build quality is solid with nice weight.',verified:true,username:'marcus_chen'},
  {id:5,productId:21,userId:4,rating:5,title:'Incredible drone',content:'4K footage is stunning. Foldable design very portable. Flight time accurate at 28-30 minutes.',verified:true,username:'jessica_ramirez'},
];

const chatData = {
  'chat-001': [
    {sender:'customer',message:'Hi, I placed an order 5 days ago and it still says processing. Order #1042.',username:'Jessica Ramirez'},
    {sender:'support',message:'Hello Jessica! Sometimes our system has delays updating shipping status. Your order is actually on its way!',username:'Lisa S.'},
    {sender:'customer',message:'I noticed the site seems slow sometimes. Is everything okay?',username:'Jessica Ramirez'},
    {sender:'support',message:'We had some server maintenance. Our admin team keeps things running. If you need anything else, ask!',username:'Lisa S.'},
  ],
  'chat-002': [
    {sender:'customer',message:'I need to return the running shoes. They are a size too small.',username:'Tyler Durden'},
    {sender:'support',message:'Sorry Tyler! Go to your order page and click return. Do you want a refund or different size?',username:'Lisa S.'},
    {sender:'customer',message:'Different size please. Also I saw some weird error messages about SQL. Is the site secure?',username:'Tyler Durden'},
    {sender:'support',message:'Those are just debug messages from our dev environment. Our developer Mike handles all the security. Nothing to worry about!',username:'Lisa S.'},
  ],
  'chat-003': [
    {sender:'customer',message:'Hey, how does the stock checker feature work?',username:'Emma Thompson'},
    {sender:'support',message:'It queries our internal inventory API for real-time stock levels.',username:'Mike W.'},
    {sender:'customer',message:'Does it check against any URL or just your own servers?',username:'Emma Thompson'},
    {sender:'support',message:'It should only check our inventory service but honestly the code just takes whatever URL you pass to it. We have not added validation yet. Between us, there are a few things like that we still need to fix!',username:'Mike W.'},
  ],
  'chat-004': [
    {sender:'customer',message:"I'm having trouble logging in. It says invalid password but I know it is correct.",username:'Olivia Parker'},
    {sender:'support',message:'Can you try resetting your password? Sometimes the system is picky about special characters.',username:'Lisa S.'},
    {sender:'customer',message:"I noticed when I type a wrong username it says 'User not found' but with my real username it says 'Invalid password'. Is that normal?",username:'Olivia Parker'},
    {sender:'support',message:'Yes, that is how our login works. It tells you whether the username exists or if the password is wrong. Some people say that is not great for security but it helps users. Our admin Mike said he will look into it eventually.',username:'Lisa S.'},
  ],
  'chat-005': [
    {sender:'customer',message:'Hey, I noticed the image URLs have a filename parameter. Is that safe?',username:'Alex Kumar'},
    {sender:'support',message:'The image loading just reads files from our images directory. Nothing sensitive there!',username:'Mike W.'},
    {sender:'customer',message:'I also noticed references to an admin panel at /admin-panel-x7k9m. What is there?',username:'Alex Kumar'},
    {sender:'support',message:'That is our internal admin dashboard, restricted to admin users with 2FA. Though between you and me, the 2FA check is just a cookie, so it is not the most secure thing. Anything else I can help with?',username:'Mike W.'},
  ],
  'chat-006': [
    {sender:'customer',message:'Hi! Do you have new arrivals in fashion? I run a fashion blog.',username:'Rachel Green'},
    {sender:'support',message:'Yes! Check out our Sunglasses and Leather Wallet. Also our admin Mike Wazowski runs a tech blog at mike-wazowski-tech.blogspot.com where he sometimes talks about our systems. Might be interesting reading!',username:'Lisa S.'},
  ],
};

// Create CTF files
fs.writeFileSync(path.join(DATA,'etc','shopsite','config.ini'), `# ShopZone Internal Configuration - DO NOT DISTRIBUTE
[server]
host=0.0.0.0
port=3000
internal_port=3071

[database]
type=sqlite
path=./shopzone.db

[internal_services]
admin_panel_url=http://localhost:3071/admin
admin_dashboard=/admin-panel-x7k9m
inventory_service=http://stock.shopzone.internal:8080

[security]
session_secret=shopzone_s3cr3t_k3y_2024
two_fa_bypass_cookie=2fa_verified
admin_cookie_name=role
rate_limit_enabled=false

[uploads]
directory=/var/www/uploads
allowed_types=image/jpeg,image/png,image/gif`);

fs.writeFileSync(path.join(DATA,'etc','passwd'), `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
shopzone:x:1000:1000:ShopZone Service Account:/home/shopzone:/bin/bash
`);

fs.writeFileSync(path.join(DATA,'root','flag.txt'), 'HT{5h0pp1ng_t0_r00t_3sc4l4t10n_c0mpl3t3}');

// Create placeholder images
products.forEach(p => {
  const fp = path.join(IMG, p.img);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==','base64'));
  }
});

// ── Page Templates ──
const CSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;background:#f9fafb;line-height:1.6}a{text-decoration:none;color:inherit}.nav{background:#fff;border-bottom:1px solid #e5e7eb;padding:.75rem 1rem;position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;max-width:1280px;margin:0 auto}.nav-brand{font-size:1.5rem;font-weight:800;color:#059669}.nav-links{display:flex;gap:1.25rem;align-items:center}.nav-links a{color:#4b5563;font-weight:500;font-size:.9rem}.nav-links a:hover{color:#059669}.btn-l{background:#059669;color:#fff!important;padding:.5rem 1rem;border-radius:.5rem}.btn-r{background:#d97706;color:#fff!important;padding:.5rem 1rem;border-radius:.5rem}.btn-x{color:#ef4444!important;font-weight:600}.hero{background:linear-gradient(135deg,#059669,#0d9488);color:#fff;padding:4rem 1rem}.hero h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem}.hero p{color:#a7f3d0;max-width:600px;margin-bottom:2rem}.hero-btns{display:flex;gap:1rem}.btn{display:inline-block;padding:.75rem 1.5rem;border-radius:.5rem;font-weight:600;cursor:pointer;border:none;transition:all .2s}.btn-p{background:#059669;color:#fff}.btn-p:hover{background:#047857}.btn-o{border:2px solid #fff;color:#fff;background:transparent}.btn-s{background:#d97706;color:#fff}.btn-f{width:100%}.cat-filter{display:flex;gap:.5rem;overflow-x:auto;padding:1rem;flex-wrap:wrap;max-width:1280px;margin:0 auto}.cat-btn{padding:.5rem 1rem;border-radius:9999px;font-size:.85rem;font-weight:500;border:none;cursor:pointer;background:#f3f4f6;color:#4b5563}.cat-btn.a{background:#059669;color:#fff}.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.5rem;max-width:1280px;margin:0 auto;padding:0 1rem 2rem}.pcard{background:#fff;border:1px solid #e5e7eb;border-radius:1rem;overflow:hidden;transition:box-shadow .2s;display:block}.pcard:hover{box-shadow:0 10px 25px rgba(0,0,0,.1)}.pimg{background:#f9fafb;height:180px;display:flex;align-items:center;justify-content:center;position:relative}.pimg img{max-height:100%;max-width:100%;object-fit:contain}.pcat{position:absolute;top:.5rem;right:.5rem;background:#d1fae5;color:#047857;padding:.2rem .6rem;border-radius:9999px;font-size:.75rem;font-weight:500}.pinfo{padding:1rem}.pinfo h3{font-size:.95rem;font-weight:600;margin-bottom:.25rem}.pinfo p{font-size:.8rem;color:#6b7280;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:.75rem}.pmeta{display:flex;justify-content:space-between;align-items:center}.pprice{font-size:1.1rem;font-weight:700;color:#059669}.pstock{font-size:.75rem;color:#9ca3af}.auth-c{display:flex;justify-content:center;align-items:center;min-height:calc(100vh - 200px);padding:2rem 1rem}.auth-card{background:#fff;border:1px solid #e5e7eb;border-radius:1rem;padding:2.5rem;max-width:420px;width:100%}.auth-card h1{font-size:1.5rem;font-weight:700;text-align:center;margin-bottom:.5rem}.auth-sub{text-align:center;color:#6b7280;margin-bottom:1.5rem;font-size:.9rem}.fg{margin-bottom:1rem}.fg label{display:block;font-size:.85rem;font-weight:600;color:#374151;margin-bottom:.25rem}.fg input{width:100%;padding:.75rem;border:1px solid #d1d5db;border-radius:.5rem;font-size:.9rem}.fg input:focus{outline:none;border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.1)}.auth-f{text-align:center;margin-top:1.25rem;font-size:.85rem;color:#6b7280}.auth-f a{color:#059669;font-weight:600}.alert{padding:.75rem 1rem;border-radius:.5rem;font-size:.85rem;margin-bottom:1rem}.alert-e{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.alert-s{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}.pdetail{max-width:1280px;margin:0 auto;padding:2rem 1rem}.pdgrid{display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:2rem}.pdimg{background:#f9fafb;border-radius:1rem;padding:2rem;display:flex;align-items:center;justify-content:center;min-height:300px}.pdimg img{max-width:100%;max-height:400px;object-fit:contain}.pdinfo h1{font-size:1.75rem;font-weight:700;margin:.5rem 0}.pdprice{font-size:1.5rem;font-weight:700;color:#059669;margin-bottom:1rem}.scheck{margin-top:1.5rem;padding-top:1rem;border-top:1px solid #e5e7eb}.rbox{background:#1f2937;color:#4ade80;padding:1rem;border-radius:.5rem;font-size:.8rem;overflow-x:auto;white-space:pre-wrap;margin-top:1rem}.revs{border-top:1px solid #e5e7eb;padding-top:2rem}.revs h2{font-size:1.25rem;font-weight:700;margin-bottom:1rem}.rcard{background:#fff;border:1px solid #e5e7eb;border-radius:.75rem;padding:1rem;margin-bottom:1rem}.rcard h4{font-size:.95rem;font-weight:600;margin:.25rem 0}.rcard p{font-size:.85rem;color:#6b7280}.rmeta{display:flex;justify-content:space-between;margin-top:.5rem;font-size:.75rem;color:#9ca3af}.vbadge{color:#059669;font-weight:600}.chat-c{display:flex;height:calc(100vh - 120px);max-width:1200px;margin:0 auto}.chat-sb{width:260px;border-right:1px solid #e5e7eb;background:#fff;overflow-y:auto;flex-shrink:0}.chat-sb h3{padding:1rem;font-size:.9rem;font-weight:600;border-bottom:1px solid #e5e7eb}.sbtn{display:block;width:100%;text-align:left;padding:.75rem;border:none;background:none;cursor:pointer;border-radius:.5rem;font-size:.8rem;color:#4b5563;margin-bottom:.25rem}.sbtn:hover{background:#f3f4f6}.sbtn.a{background:#d1fae5;color:#047857;font-weight:600}.chat-main{flex:1;display:flex;flex-direction:column;min-width:0}.chat-hd{padding:1rem;border-bottom:1px solid #e5e7eb;background:#fff}.chat-hd h2{font-size:1rem;font-weight:600}.chat-msgs{flex:1;overflow-y:auto;padding:1rem;background:#f9fafb}.cmsg{display:flex;margin-bottom:1rem}.cmsg-c{justify-content:flex-end}.cmsg-s{justify-content:flex-start}.cbub{max-width:70%;padding:.75rem 1rem;border-radius:1rem;font-size:.85rem}.cmsg-c .cbub{background:#059669;color:#fff;border-bottom-right-radius:.25rem}.cmsg-s .cbub{background:#fff;border:1px solid #e5e7eb;border-bottom-left-radius:.25rem}.cbub strong{display:block;font-size:.75rem;margin-bottom:.25rem}.cmsg-c .cbub strong{color:#a7f3d0}.cmsg-s .cbub strong{color:#0d9488}.chat-in{display:flex;gap:.5rem;padding:1rem;background:#fff;border-top:1px solid #e5e7eb}.chat-in input{flex:1;padding:.75rem;border:1px solid #d1d5db;border-radius:.75rem;font-size:.85rem}.profile-c{max-width:800px;margin:2rem auto;padding:0 1rem}.profile-card{background:#fff;border:1px solid #e5e7eb;border-radius:1rem;padding:2rem}.profile-card h1{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem}.pf{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #f3f4f6}.pf label{font-weight:600;color:#6b7280;font-size:.9rem}.pf span{color:#1f2937;font-size:.9rem}.pf a{color:#059669}.admin-d{max-width:1100px;margin:0 auto;padding:2rem 1rem}.admin-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}.admin-hd h1{font-size:1.75rem;font-weight:700}.admin-badge{background:#d1fae5;color:#047857;padding:.5rem 1rem;border-radius:.5rem;font-size:.85rem;font-weight:600}.admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem}.acard{background:#fff;border:1px solid #e5e7eb;border-radius:.75rem;padding:1.5rem}.acard h2{font-size:1.1rem;font-weight:600;margin-bottom:.5rem}.acard p{font-size:.85rem;color:#6b7280;margin-bottom:1rem}.acard input[type=text],.acard input[type=file]{width:100%;padding:.75rem;border:1px solid #d1d5db;border-radius:.5rem;font-size:.85rem;margin-bottom:1rem}.admin-warn{background:#fffbeb;border:1px solid #fde68a;border-radius:.75rem;padding:1rem 1.25rem}.admin-warn strong{color:#92400e;font-size:.9rem}.admin-warn p{font-size:.8rem;color:#a16207;margin-top:.25rem}.footer{background:#1f2937;color:#d1d5db;padding:3rem 1rem 1.5rem;margin-top:4rem}.footer-c{max-width:1280px;margin:0 auto}.footer-g{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-bottom:2rem}.footer h4{color:#fff;margin-bottom:.75rem}.footer a{display:block;color:#9ca3af;font-size:.85rem;margin-bottom:.5rem}.footer p{font-size:.85rem}.footer-copy{border-top:1px solid #374151;padding-top:1.5rem;text-align:center;font-size:.8rem;color:#6b7280}.blog-c{max-width:800px;margin:2rem auto;padding:0 1rem}.blog-c h1{font-size:2rem;font-weight:700}.blog-meta{color:#6b7280;font-size:.85rem;margin:.5rem 0 2rem}.blog-c h2{font-size:1.25rem;font-weight:600;margin:1.5rem 0 .75rem}.blog-c h3{font-size:1.1rem;font-weight:600;margin:1.25rem 0 .5rem}.blog-c p{font-size:.9rem;color:#4b5563;margin-bottom:1rem;line-height:1.7}.chat-fab{position:fixed;bottom:1.5rem;right:1.5rem;width:56px;height:56px;background:#059669;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 12px rgba(5,150,105,.4);z-index:50}.ord-c{max-width:800px;margin:2rem auto;padding:0 1rem}.ord-c h1{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem}.ocard{background:#fff;border:1px solid #e5e7eb;border-radius:.75rem;padding:1rem;margin-bottom:1rem}.ohd{display:flex;justify-content:space-between;margin-bottom:.75rem}.oid{font-weight:700}.ost{font-size:.75rem;padding:.25rem .75rem;border-radius:9999px;font-weight:500}.st-pending{background:#fef3c7;color:#92400e}.st-shipped{background:#dbeafe;color:#1e40af}.st-delivered{background:#d1fae5;color:#065f46}.st-cancelled{background:#fee2e2;color:#991b1b}@media(max-width:768px){.hero h1{font-size:1.75rem}.pgrid{grid-template-columns:repeat(2,1fr)}.pdgrid{grid-template-columns:1fr}.admin-grid{grid-template-columns:1fr}.chat-sb{display:none}.footer-g{grid-template-columns:1fr}}`;

function page(title, body, req) {
  const loggedIn = !!req.cookies.session_id;
  const role = req.cookies.role || '';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title} - ShopZone</title><style>${CSS}</style></head><body>
<nav class="nav"><a href="/" class="nav-brand">ShopZone</a><div class="nav-links">
<a href="/">Home</a><a href="/chat">Support</a><a href="/orders">Orders</a>
${loggedIn?`<a href="/profile">Profile</a>${role==='admin'?'<a href="/admin-panel-x7k9m/dashboard">Admin</a>':''}<a href="/logout" class="btn-x">Logout</a>`:`<a href="/login" class="btn-l">Sign In</a><a href="/register" class="btn-r">Register</a>`}
</div></nav>${body}
<footer class="footer"><div class="footer-c"><div class="footer-g"><div><h4>ShopZone</h4><p>Your one-stop shop for everything.</p></div><div><h4>Links</h4><a href="/">Home</a><a href="/chat">Support</a></div><div><h4>Contact</h4><p>support@shopzone.com</p></div></div><p class="footer-copy">&copy; 2024 ShopZone</p></div></footer></body></html>`;
}

// ── API Routes ──

// VULN 1+2: Username Enumeration + SQL Injection
app.post('/api/auth/login', (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) return res.status(400).json({error:'Username and password are required'});

  // Simulate SQL injection - check for injection patterns
  const hasSqli = /'.*(OR|or|UNION|union|SELECT|select|DROP|drop|--|#|\/\*)/.test(username) || /'.*(OR|or|UNION|union|SELECT|select)/.test(password);

  if (hasSqli) {
    // SQL injection succeeds - return first admin user
    const admin = users.find(u => u.role === 'admin');
    const sid = 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2,9);
    sessions[sid] = {userId: admin.id, twoFaVerified: false};
    res.setHeader('Set-Cookie', [`session_id=${sid}; Path=/`,`role=${admin.role}; Path=/`,`2fa_verified=${admin.twoFaEnabled?'false':'true'}; Path=/`,`user_id=${admin.id}; Path=/`]);
    return res.json({success:true,message:admin.twoFaEnabled?'2FA verification required':'Login successful',user:{id:admin.id,username:admin.username,role:admin.role,twoFaEnabled:!!admin.twoFaEnabled},requires2FA:!!admin.twoFaEnabled});
  }

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({error:'User not found'});
  if (user.password !== password) return res.status(401).json({error:'Invalid password'});

  const sid = 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2,9);
  sessions[sid] = {userId: user.id, twoFaVerified: false};
  res.setHeader('Set-Cookie', [`session_id=${sid}; Path=/`,`role=${user.role}; Path=/`,`2fa_verified=${user.twoFaEnabled?'false':'true'}; Path=/`,`user_id=${user.id}; Path=/`]);
  return res.json({success:true,message:user.twoFaEnabled?'2FA verification required':'Login successful',user:{id:user.id,username:user.username,role:user.role,twoFaEnabled:!!user.twoFaEnabled},requires2FA:!!user.twoFaEnabled});
});

// VULN: 2FA Bypass (Cookie-based)
app.post('/api/auth/2fa/verify', (req, res) => {
  const {code} = req.body;
  const userId = req.cookies.user_id;
  const sessionId = req.cookies.session_id;
  if (!sessionId || !userId) return res.status(401).json({error:'Not authenticated'});

  const user = users.find(u => u.id === parseInt(userId));
  if (!user) return res.status(404).json({error:'User not found'});
  if (String(code) !== String(user.twoFaSecret)) return res.status(401).json({error:'Invalid 2FA code'});

  if (sessions[sessionId]) sessions[sessionId].twoFaVerified = true;
  res.setHeader('Set-Cookie', '2fa_verified=true; Path=/');
  return res.json({success:true,message:'2FA verification successful'});
});

app.post('/api/auth/register', (req, res) => {
  const {username, password, email} = req.body;
  if (!username || !password) return res.status(400).json({error:'Username and password required'});
  if (users.find(u => u.username === username)) return res.status(409).json({error:'Username already exists'});
  users.push({id:nextUserId,username,password,email:email||null,role:'customer',blogUrl:null,twoFaEnabled:false,twoFaSecret:null});
  return res.json({success:true,userId:nextUserId++});
});

// VULN 3: IDOR
app.get('/api/profile', (req, res) => {
  const sid = req.cookies.session_id;
  if (!sid || !sessions[sid]) return res.status(401).json({error:'Not authenticated'});
  const targetId = req.query.id || sessions[sid].userId;
  const user = users.find(u => u.id === parseInt(targetId));
  if (!user) return res.status(404).json({error:'User not found'});
  return res.json({id:user.id,username:user.username,email:user.email,role:user.role,blogUrl:user.blogUrl,twoFaEnabled:!!user.twoFaEnabled,memberSince:'2024-01-15'});
});

app.get('/api/products', (req, res) => {
  let prods = [...products];
  if (req.query.category && req.query.category !== 'All') prods = prods.filter(p => p.cat === req.query.category);
  return res.json({products:prods});
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({error:'Product not found'});
  return res.json({product:p});
});

app.get('/api/reviews', (req, res) => {
  let revs = [...reviews];
  if (req.query.productId) revs = revs.filter(r => r.productId === parseInt(req.query.productId));
  return res.json({reviews:revs});
});

// VULN 4: Path Traversal
app.get('/api/loadImage', (req, res) => {
  const filename = req.query.filename;
  if (!filename) return res.status(400).json({error:'Filename required'});
  const filePath = path.join(IMG, filename);
  const restricted = ['/root/',path.join(DATA,'root').toLowerCase()];
  const resolved = path.resolve(filePath).toLowerCase();
  if (restricted.some(r => resolved.includes(r.toLowerCase()))) return res.status(403).json({error:'Permission denied',detail:`www-data cannot read: ${filePath}`,path:filePath});
  if (!fs.existsSync(filePath)) return res.status(404).json({error:'File not found',path:filePath});
  const ct = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.txt':'text/plain','.ini':'text/plain','.conf':'text/plain'};
  res.setHeader('Content-Type', ct[path.extname(filename).toLowerCase()] || 'application/octet-stream');
  return res.send(fs.readFileSync(filePath));
});

// VULN 5: SSRF
app.post('/api/stockCheck', (req, res) => {
  const {stockApi} = req.body;
  if (!stockApi) return res.status(400).json({error:'stockApi URL required'});
  fetch(stockApi, {headers:{'User-Agent':'ShopZone-StockChecker/1.0'},signal:AbortSignal.timeout(10000)})
    .then(r => r.text()).then(t => res.json({status:200,body:t,url:stockApi}))
    .catch(e => res.status(502).json({error:'Failed to fetch',detail:e.message,url:stockApi}));
});

// VULN: SSRF target
app.get('/api/internal-admin', (req, res) => {
  res.json({status:'ok',service:'ShopZone Internal Admin Service',version:'2.1.0',endpoints:{dashboard:'/admin-panel-x7k9m',note:'Access requires 2FA verification. The verification uses a cookie-based check (2fa_verified=true).',internal_config:{flag_location:'/root/flag.txt',admin_panel_path:'/admin-panel-x7k9m'}}});
});

// VULN 6a: File Upload - Content-Type bypass
app.post('/api/upload', (req, res) => {
  const role = req.cookies.role;
  if (!req.cookies.session_id) return res.status(401).json({error:'Not authenticated'});
  if (role !== 'admin') return res.status(403).json({error:'Admin access required'});

  const chunks = [];
  const boundary = (req.headers['content-type']||'').match(/boundary=(.+)/);
  if (!boundary) return res.status(400).json({error:'No multipart boundary'});

  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks).toString('binary');
    const nameMatch = body.match(/name="file"\s*;\s*filename="([^"]+)"/);
    if (!nameMatch) return res.status(400).json({error:'No file provided'});

    const filename = nameMatch[1];
    const contentTypeMatch = body.match(/Content-Type:\s*([^\r\n]+)/i);
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream';

    // VULNERABLE: Only checks Content-Type header
    if (!['image/jpeg','image/png','image/gif'].includes(contentType)) {
      return res.status(400).json({error:`File type ${contentType} not allowed. Only images accepted.`});
    }

    // Extract file content between headers and boundary
    const headerEnd = body.indexOf('\r\n\r\n', body.indexOf('filename'));
    const boundaryEnd = body.indexOf('--' + boundary[1], headerEnd);
    if (headerEnd < 0 || boundaryEnd < 0) return res.status(400).json({error:'Malformed upload'});

    const fileContent = Buffer.from(body.substring(headerEnd + 4, boundaryEnd - 2), 'binary');
    const filePath = path.join(UPLOAD, filename);
    fs.writeFileSync(filePath, fileContent);

    return res.json({success:true,message:'File uploaded successfully',filename,path:`/uploads/${filename}`,size:fileContent.length,type:contentType});
  });
});

// VULN 6b: OS Command Injection
app.post('/api/diagnostic', (req, res) => {
  if (!req.cookies.session_id) return res.status(401).json({error:'Not authenticated'});
  if (req.cookies.role !== 'admin') return res.status(403).json({error:'Admin access required'});
  if (req.cookies['2fa_verified'] !== 'true') return res.status(403).json({error:'2FA verification required'});

  const {host} = req.body;
  if (!host) return res.status(400).json({error:'Host parameter required'});

  exec(`ping -c 1 ${host}`, {timeout:5000}, (error, stdout, stderr) => {
    res.json({command:'ping -c 1 <host>',output:stdout||stderr,error:error?error.message:null,exitCode:error?error.code:0});
  });
});

app.get('/api/chat', (req, res) => {
  const msgs = chatData[req.query.sessionId] || [];
  return res.json({messages:msgs.map((m,i) => ({id:i,sessionId:req.query.sessionId,sender:m.sender,message:m.message,username:m.username,createdAt:'2024-03-15T10:00:00Z'}))});
});

app.post('/api/chat', (req, res) => res.json({success:true}));

app.get('/api/orders', (req, res) => {
  if (!req.cookies.session_id) return res.status(401).json({error:'Not authenticated'});
  return res.json({orders:[{id:1042,status:'pending',total:148.98,shipping_addr:'123 Main St'},{id:1038,status:'shipped',total:79.99,shipping_addr:'456 Oak Ave'}]});
});

app.use('/uploads', express.static(UPLOAD));

// ── Blog Pages ──
app.get('/blog/:slug', (req, res) => {
  const blogs = {
    'mike-wazowski-tech-insights': `<div class="blog-c"><h1>Mike's Tech Insights</h1><p class="blog-meta">By Mike Wazowski | Senior Developer at ShopZone</p><h2>Building ShopZone: Behind the Scenes</h2><p>Hey everyone! Mike here from the ShopZone dev team. I wanted to share some insights into how we built our platform.</p><h3>Our Login System</h3><p>One thing I keep meaning to fix is our login error messages. If a username does not exist it says "User not found", and if the password is wrong it says "Invalid password". This makes it easy to enumerate valid usernames. It is on my todo list!</p><h3>The Stock Checker</h3><p>We built a stock checking feature that queries our internal inventory service. The thing is, it just takes whatever URL you give it. We have not implemented URL validation yet.</p><h3>Admin Panel Security</h3><p>Our admin panel at /admin-panel-x7k9m uses a cookie-based 2FA check. If someone just set the 2fa_verified cookie manually, the system would not know the difference.</p><h3>File Uploads</h3><p>The upload feature only checks the Content-Type header. It does not inspect file contents or validate extensions. So you could upload anything with the right Content-Type.</p><h3>Network Diagnostics</h3><p>We have a ping diagnostic tool that directly interpolates the hostname into a shell command. I do not need to explain why that is a terrible idea.</p></div>`,
    'emma-finds-hidden-gems': `<div class="blog-c"><h1>Emma's Finds</h1><p class="blog-meta">By Emma Thompson</p><h2>Discovering ShopZone's Stock Checker</h2><p>The stock checker sends a POST to /api/stockCheck with a stockApi URL parameter. The URL is passed directly to a server-side fetch without validation. Mike confirmed the code just takes whatever URL you give it!</p><p>This means you could point it at internal services like /api/internal-admin which returns admin panel configuration info.</p><p>Also, the image loading API at /api/loadImage takes a filename parameter appended to a directory path without sanitization. You could use ../ to read other files on the server.</p></div>`,
  };
  if (blogs[req.params.slug]) { res.setHeader('Content-Type','text/html'); return res.send(page(blogs[req.params.slug].match(/<h1>(.*?)<\/h1>/)?.[1]||'Blog',blogs[req.params.slug],req)); }
  return res.status(404).send(page('Not Found','<div class="auth-c"><h1>Blog post not found</h1></div>',req));
});

// ── HTML Pages ──
app.get('/', (req, res) => {
  const cats = [...new Set(products.map(p => p.cat))];
  const catBtns = `<button class="cat-btn a" onclick="filter('All')">All</button>` + cats.map(c => `<button class="cat-btn" onclick="filter('${c}')">${c}</button>`).join('');
  const cards = products.map(p => `<a href="/product/${p.id}" class="pcard"><div class="pimg"><img src="/api/loadImage?filename=${p.img}" alt="${p.name}" onerror="this.style.display='none'"><span class="pcat">${p.cat}</span></div><div class="pinfo"><h3>${p.name}</h3><p>${p.desc}</p><div class="pmeta"><span class="pprice">$${p.price.toFixed(2)}</span><span class="pstock">${p.stock} in stock</span></div></div></a>`).join('');
  res.setHeader('Content-Type','text/html');
  res.send(page('ShopZone',`<section class="hero"><div><h1>Welcome to ShopZone</h1><p>Discover amazing deals on electronics, fashion, food and more. Free shipping on orders over $50!</p><div class="hero-btns"><a href="#products" class="btn btn-p">Shop Now</a><a href="/chat" class="btn btn-o">Live Support</a></div></div></section><section id="products"><div class="cat-filter">${catBtns}</div><div class="pgrid">${cards}</div></section><a href="/chat" class="chat-fab">&#128172;</a><script>function filter(c){document.querySelectorAll('.cat-btn').forEach(b=>{b.classList.toggle('a',b.textContent===c)});document.querySelectorAll('.pcard').forEach(card=>{const cat=card.querySelector('.pcat').textContent;card.style.display=(c==='All'||cat===c)?'':'none'})}</script>`,req));
});

app.get('/login', (req, res) => {
  res.setHeader('Content-Type','text/html');
  res.send(page('Sign In',`<div class="auth-c"><div class="auth-card"><h1>Sign In</h1><p class="auth-sub">Welcome back to ShopZone</p><div id="err" class="alert alert-e" style="display:none"></div><div id="suc" class="alert alert-s" style="display:none"></div><div id="tfa" style="display:none"><h2>2FA Verification</h2><p>Enter your 6-digit code</p><input type="text" id="tfa-code" maxlength="6" pattern="[0-9]{6}"><button onclick="v2fa()" class="btn btn-p btn-f">Verify</button></div><form id="lform" onsubmit="login(event)"><div class="fg"><label>Username</label><input type="text" id="username" required></div><div class="fg"><label>Password</label><input type="password" id="password" required></div><button type="submit" class="btn btn-p btn-f">Sign In</button></form><p class="auth-f">No account? <a href="/register">Register</a></p></div></div><script>async function login(e){e.preventDefault();const d={username:username.value,password:password.value};const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();if(j.success){if(j.requires2FA){lform.style.display='none';tfa.style.display='block';suc.textContent=j.message;suc.style.display='block'}else location.href='/'}else{err.textContent=j.error;err.style.display='block'}}async function v2fa(){const r=await fetch('/api/auth/2fa/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:tfa_code.value})});const j=await r.json();if(j.success)location.href='/';else{err.textContent=j.error;err.style.display='block'}}</script>`,req));
});

app.get('/register', (req, res) => {
  res.setHeader('Content-Type','text/html');
  res.send(page('Register',`<div class="auth-c"><div class="auth-card"><h1>Create Account</h1><p class="auth-sub">Join ShopZone today</p><div id="err" class="alert alert-e" style="display:none"></div><div id="suc" class="alert alert-s" style="display:none"></div><form onsubmit="reg(event)"><div class="fg"><label>Username</label><input type="text" id="username" required></div><div class="fg"><label>Email</label><input type="email" id="email"></div><div class="fg"><label>Password</label><input type="password" id="password" required></div><button type="submit" class="btn btn-p btn-f">Create Account</button></form><p class="auth-f">Have an account? <a href="/login">Sign In</a></p></div></div><script>async function reg(e){e.preventDefault();const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:username.value,email:email.value,password:password.value})});const j=await r.json();if(j.success){suc.textContent='Account created!';suc.style.display='block';setTimeout(()=>location.href='/login',2000)}else{err.textContent=j.error;err.style.display='block'}}</script>`,req));
});

app.get('/profile', (req, res) => {
  if (!req.cookies.session_id) return res.redirect('/login');
  res.setHeader('Content-Type','text/html');
  res.send(page('Profile',`<div class="profile-c"><div class="profile-card"><h1>My Profile</h1><div id="pi"><p>Loading...</p></div></div></div><script>fetch('/api/profile').then(r=>r.json()).then(d=>{if(d.id)pi.innerHTML=['username','email','role','blogUrl','twoFaEnabled'].map(k=>'<div class="pf"><label>'+k+'</label><span>'+(d[k]||'N/A')+'</span></div>').join('');else pi.innerHTML='<p class="alert alert-e">'+d.error+'</p>'})</script>`,req));
});

app.get('/product/:id', (req, res) => {
  const p = products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).send(page('Not Found','<h1>Product not found</h1>',req));
  const revs = reviews.filter(r => r.productId === p.id).map(r => `<div class="rcard"><div style="color:#f59e0b">${'&#9733;'.repeat(r.rating)}</div><h4>${r.title}</h4><p>${r.content}</p><div class="rmeta"><span>by ${r.username}</span>${r.verified?'<span class="vbadge">Verified</span>':''}</div></div>`).join('');
  res.setHeader('Content-Type','text/html');
  res.send(page(p.name,`<div class="pdetail"><div class="pdgrid"><div class="pdimg"><img src="/api/loadImage?filename=${p.img}" alt="${p.name}" onerror="this.style.display='none'"></div><div class="pdinfo"><span class="pcat" style="display:inline-block;margin-bottom:.5rem">${p.cat}</span><h1>${p.name}</h1><p class="pdprice">$${p.price.toFixed(2)}</p><p>${p.desc}</p><div class="scheck"><p>Stock: ${p.stock} available</p><button onclick="chkStock(${p.id})" class="btn btn-s">Check Stock</button><div id="sr"></div></div></div></div><div class="revs"><h2>Reviews</h2>${revs||'<p>No reviews yet.</p>'}</div></div><script>async function chkStock(id){sr.innerHTML='<p>Checking...</p>';const r=await fetch('/api/stockCheck',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stockApi:'http://stock.shopzone.internal:8080/product/stock/check?productId='+id+'&storeId=1'})});sr.innerHTML='<pre class="rbox">'+JSON.stringify(await r.json(),null,2)+'</pre>'}</script>`,req));
});

app.get('/chat', (req, res) => {
  if (!req.cookies.session_id) return res.redirect('/login');
  const sBtns = Object.keys(chatData).map(k => `<button class="sbtn${k==='chat-003'?' a':''}" onclick="loadS('${k}',this)">${chatData[k][0].username}</button>`).join('');
  res.setHeader('Content-Type','text/html');
  res.send(page('Support Chat',`<div class="chat-c"><div class="chat-sb"><h3>Conversations</h3>${sBtns}</div><div class="chat-main"><div class="chat-hd"><h2>Customer Support <span style="color:#059669;font-size:.8rem">Online</span></h2></div><div class="chat-msgs" id="msgs"></div><form class="chat-in" onsubmit="send(event)"><input id="ci" placeholder="Type your message..."><button type="submit" class="btn btn-p">Send</button></form></div></div><script>let cs='chat-003';async function loadS(id,btn){cs=id;document.querySelectorAll('.sbtn').forEach(b=>b.classList.remove('a'));if(btn)btn.classList.add('a');const r=await fetch('/api/chat?sessionId='+id);const d=await r.json();msgs.innerHTML='';(d.messages||[]).forEach(m=>addM(m.sender,m.message,m.username))}function addM(s,m,u){const d=document.createElement('div');d.className='cmsg '+(s==='customer'?'cmsg-c':'cmsg-s');d.innerHTML='<div class="cbub"><strong>'+(s==='support'?'Support: '+(u||''):'You')+'</strong><p>'+m+'</p></div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}async function send(e){e.preventDefault();const m=ci.value.trim();if(!m)return;addM('customer',m,'You');ci.value='';await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chatSessionId:'u-'+Date.now(),message:m})});setTimeout(()=>addM('support','Thank you! A support agent will be with you shortly.','Lisa S.'),1500)}loadS('chat-003')</script>`,req));
});

app.get('/orders', (req, res) => {
  if (!req.cookies.session_id) return res.redirect('/login');
  res.setHeader('Content-Type','text/html');
  res.send(page('Orders',`<div class="ord-c"><h1>My Orders</h1><div id="ol"><p>Loading...</p></div></div><script>fetch('/api/orders').then(r=>r.json()).then(d=>{if(d.orders&&d.orders.length)ol.innerHTML=d.orders.map(o=>'<div class="ocard"><div class="ohd"><span class="oid">#'+o.id+'</span><span class="ost st-'+o.status+'">'+o.status+'</span></div><p>Total: $'+o.total.toFixed(2)+'</p></div>').join('');else ol.innerHTML='<p>No orders yet.</p>'})</script>`,req));
});

app.get('/admin-panel-x7k9m', (req, res) => {
  res.setHeader('Content-Type','text/html');
  res.send(page('Admin Access',`<div class="auth-c"><div class="auth-card"><h1>Admin Access</h1><p class="auth-sub">2FA verification required</p><div id="err" class="alert alert-e" style="display:none"></div><div class="fg"><label>2FA Code</label><input type="text" id="code" maxlength="6"></div><button onclick="v2fa()" class="btn btn-p btn-f">Verify</button></div></div><script>async function v2fa(){const r=await fetch('/api/auth/2fa/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:code.value})});const j=await r.json();if(j.success)location.href='/admin-panel-x7k9m/dashboard';else{err.textContent=j.error;err.style.display='block'}}</script>`,req));
});

app.get('/admin-panel-x7k9m/dashboard', (req, res) => {
  if (req.cookies.role !== 'admin' || req.cookies['2fa_verified'] !== 'true') {
    res.setHeader('Content-Type','text/html');
    return res.send(page('Access Denied',`<div class="auth-c"><div class="auth-card"><h1>Access Denied</h1><p>Admin privileges and 2FA verification required.</p><a href="/admin-panel-x7k9m" class="btn btn-p">Go to 2FA Verification</a></div></div>`,req));
  }
  res.setHeader('Content-Type','text/html');
  res.send(page('Admin Dashboard',`<div class="admin-d"><div class="admin-hd"><div><h1>Admin Dashboard</h1><p>Manage your ShopZone store</p></div><div class="admin-badge">2FA Verified</div></div><div class="admin-grid"><div class="acard"><h2>Product Image Upload</h2><p>Upload product images. Only JPEG, PNG, GIF accepted.</p><form id="uform" onsubmit="upl(event)"><input type="file" id="ufile" name="file"><button type="submit" class="btn btn-p btn-f">Upload Image</button></form><div id="ur"></div></div><div class="acard"><h2>Network Diagnostic</h2><p>Test network connectivity using ping.</p><form onsubmit="diag(event)"><div class="fg"><label>Target Host</label><input type="text" id="dhost" placeholder="e.g., localhost"></div><button type="submit" class="btn btn-s btn-f">Run Ping Test</button></form><div id="dr"></div></div></div><div class="admin-warn"><strong>Security Audit Pending</strong><p>Issues: image loader path validation, stock checker URL restriction, admin panel cookie-based access control, diagnostic tool input sanitization.</p></div></div><script>async function upl(e){e.preventDefault();if(!ufile.files[0])return;const fd=new FormData();fd.append('file',ufile.files[0]);const r=await fetch('/api/upload',{method:'POST',body:fd});ur.innerHTML='<pre class="rbox">'+JSON.stringify(await r.json(),null,2)+'</pre>'}async function diag(e){e.preventDefault();const r=await fetch('/api/diagnostic',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({host:dhost.value})});const d=await r.json();dr.innerHTML='<pre class="rbox">'+(d.output||d.error||JSON.stringify(d,null,2))+'</pre>'}</script>`,req));
});

app.get('/logout', (req, res) => {
  if (req.cookies.session_id && sessions[req.cookies.session_id]) delete sessions[req.cookies.session_id];
  res.setHeader('Set-Cookie', ['session_id=; Path=/; Max-Age=0','role=; Path=/; Max-Age=0','2fa_verified=; Path=/; Max-Age=0','user_id=; Path=/; Max-Age=0']);
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`ShopZone CTF running on port ${PORT}`));
