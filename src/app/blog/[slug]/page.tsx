'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, MessageCircle } from 'lucide-react';

const blogPosts: Record<string, {
  title: string;
  author: string;
  date: string;
  content: string;
}> = {
  'sarah-tech-reviews': {
    title: 'Sarah\'s Tech Reviews',
    author: 'sarah_connor',
    date: '2024-03-15',
    content: `Hey everyone! Welcome to my tech review blog. I've been shopping on ShopZone for a while now and I wanted to share my experiences with some of their products.

## Wireless Headphones Review

I recently picked up the Wireless Headphones from ShopZone and I'm blown away! The noise cancellation is top-notch, and the 30-hour battery life means I can use them for my entire work week without charging.

The sound quality is incredible for the price point. Bass is deep and rich, while highs are crisp and clear. Highly recommended for anyone looking for premium headphones without breaking the bank.

## Smart Watch Review

The Smart Watch is pretty good for fitness tracking. GPS accuracy is solid and the heart rate monitor seems reliable. My only complaint is that the interface could be more intuitive.

Overall, a solid purchase for fitness enthusiasts. The battery lasts about 3-4 days with regular use.

## Tips for Fellow Shoppers

One thing I've noticed - make sure to check the stock availability before ordering. The stock checker on the product pages uses some kind of internal API to verify. Pretty cool tech stack they have going on there!

Anyway, that's it for now. Happy shopping!`,
  },
  'mike-insider-tips': {
    title: 'Mike\'s Insider Tips',
    author: 'mike_wazowski',
    date: '2024-03-20',
    content: `Hey there! Mike here from the ShopZone team. I've been working here for about 6 months now and I wanted to share some behind-the-scenes tips and stories.

## A Day in the Life at ShopZone

Working at ShopZone is pretty fun. The team is great and we're always working on new features. One thing that's been on my mind though - our stock checking system. I noticed something interesting the other day...

The stock checker feature sends requests to our inventory service. But I realized it can actually reach other internal services too! I accidentally typed the wrong URL and got a response from what looked like an admin service running on port 3071. The dev team should probably restrict that... but I'm just a staff member, what do I know?

## Product Photography

I help with product photography sometimes. The images are stored on the server and loaded through this image loading endpoint. Pretty standard stuff, but the filenames can be a bit tricky. Sometimes when the filenames are wrong, I see weird paths in the error messages. Might be worth looking into if you're curious about how the server is set up.

## New Features Coming

We're working on some cool new features for the admin dashboard. The admin has been pretty secretive about it, but I heard they added a network diagnostic tool for troubleshooting. Sounds useful for checking if external services are reachable from our server.

That's all for now! Keep shopping!`,
  },
  'admin-secret-2024': {
    title: 'Admin Notes',
    author: 'admin',
    date: '2024-03-25',
    content: `Personal notes. DO NOT SHARE.

## Security Reminders

- 2FA is enabled on my account. The verification code is... well, I keep it simple. Easy to remember.
- The admin dashboard is at /admin-panel-x7k9m. Only accessible after 2FA verification.
- The 2FA check uses a cookie (2fa_verified). If the cookie says true, you're in. Simple enough.

## Internal Infrastructure

The internal admin service runs on port 3071. It's only accessible from localhost, so external users can't reach it directly. The main admin dashboard on the public site connects to it for certain operations.

## Server Configuration

Server config is stored at /etc/shopsite/config.ini. Contains service URLs and other internal details. Should probably move it somewhere less obvious but haven't gotten around to it.

## Diagnostic Tool

Added a ping diagnostic tool to the admin dashboard for network troubleshooting. It runs on the server so it can test connectivity to internal services. Works well but need to be careful with the input - it directly uses whatever hostname you provide in the ping command.

## TODO

- Fix the image loader - it doesn't validate filenames properly
- Move config files to a more secure location
- Add proper access control to the admin panel (currently just checks cookies)
- Review the stock checker API - it shouldn't be able to reach internal services

That's it for now. Need to get back to work.`,
  },
  'jessica-deals-hunter': {
    title: 'Jessica\'s Deals Hunter Blog',
    author: 'jessica_ramirez',
    date: '2024-04-02',
    content: `Hey deal hunters! Jessica here. Welcome to my blog where I share the best deals I find across the internet. I've been couponing and deal-hunting for over 5 years, and ShopZone has become one of my go-to stores!

## This Week's Best Deals

Let me tell you about some amazing deals I found this week on ShopZone:

1. **Organic Coffee Beans** - $24.99 for 1kg is an absolute steal. I've seen the same beans for $35+ at other stores.
2. **Ceramic Mug Set** - $18.99 for 4 hand-painted mugs. Perfect for gifting!
3. **Scented Candles Pack** - 6 candles for $22.99. My apartment smells like a spa now.

## My Shopping Tips

Here are some of my tried-and-true shopping strategies:

- Always compare prices across multiple sites before buying
- Sign up for newsletters to get first access to sales
- Check the product reviews before purchasing - the review section on ShopZone is actually pretty helpful
- Use the stock checker on product pages to verify availability before adding to cart

## Something Weird I Discovered

Okay so this is a bit off-topic, but I was messing around on the site the other day and I tried looking at my order history. I noticed that the URL had my user ID in it, so out of curiosity I changed the ID number... and I could see other people's orders! Like, all their order details - what they bought, where they shipped it, everything. That seems like a pretty big security issue to me. I reported it to support but they didn't seem too concerned.

Also, the stock checker thing is interesting. I was poking around and it seems like the button makes requests to some kind of internal URL. I wonder if you could make it request other URLs besides the stock check one? Just a thought. I'm not a hacker or anything, I just like understanding how things work.

## Upcoming Sales

I heard rumors that ShopZone is planning a big spring sale. Make sure to follow my blog for the latest deals!

That's it for this week. Happy deal hunting!`,
  },
  'emma-staff-notes': {
    title: 'Emma\'s Staff Notes',
    author: 'emma_thompson',
    date: '2024-04-05',
    content: `Internal staff notes and observations. These are my personal work notes - not for public sharing.

## Weekly Team Meeting Notes

Attended the weekly sync meeting. Topics covered:

- New product launches coming next quarter
- Customer satisfaction metrics are up 12% this month
- Need to hire 2 more support agents to handle the increased chat volume
- The new gardening and automotive categories are performing well

## System Issues I've Noticed

A few things that have been bugging me about our internal systems:

- The 2FA system seems a bit unreliable. The admin was complaining about it last week - he said "it's just a cookie check anyway" which I thought was a funny way to describe a security feature. I guess technically the 2fa_verified cookie is what grants access, so if you could set that cookie yourself, you'd bypass the whole thing? That doesn't sound very secure.

- The diagnostic tool in the admin panel runs ping commands directly on the server. I watched the admin troubleshoot a network issue once and he typed a hostname into the tool and it just ran "ping -c 1 <hostname>" on the server. What if someone typed something other than a hostname? Like a command? Just wondering...

- Last week I was uploading some product images and I accidentally changed the Content-Type header in my browser's dev tools to something else, and the file still uploaded successfully! The system only checks the Content-Type header, not the actual file content. That means you could upload any file as long as you set the right Content-Type. Seems like that could be abused.

## Customer Support Tips

When handling customer chats, remember to:

- Always verify the customer's identity before sharing account details
- Use the internal knowledge base for common questions
- Escalate security-related concerns to the admin team
- Never share internal system details with customers (I learned this the hard way when I accidentally mentioned our internal admin port to a customer once - oops!)

## Fun Fact

Did you know we have over 30 products now? The inventory has really grown since I started working here. And we have about a dozen registered users, which is nice for a small shop.

That's all for now. Time to get back to the support queue.`,
  },
  'david-tech-blog': {
    title: 'David\'s Tech Blog',
    author: 'david_chen',
    date: '2024-04-08',
    content: `Welcome to my tech blog! I'm David, a software developer by day and an online shopping enthusiast by night. I like to tinker with websites and understand how they work under the hood.

## ShopZone - A Technical Perspective

I've been shopping on ShopZone for a while now and as a developer, I can't help but notice some interesting technical details about their website:

### Image Loading

The product images are loaded through a special endpoint (/api/loadImage?filename=...). When the filename is valid, you get the image. But when it's invalid, the error message returns the full file path on the server! That's a pretty big information leak. For example, I saw an error like "File not found, path: /home/z/my-project/ctf-data/var/www/images/nonexistent.png". This tells you the directory structure of the server, which is useful for further exploration.

### Login Behavior

I was testing the login page and noticed something interesting - if you enter a username that doesn't exist, it says "User not found", but if the username exists with the wrong password, it says "Invalid password". This means you can enumerate valid usernames! Just try different usernames and see which ones give the "Invalid password" error. That's a classic username enumeration vulnerability.

### Product Filtering

I was playing around with the category filter on the products page. The URL looks like /api/products?category=Electronics. I tried some basic SQL injection techniques on the category parameter and was surprised to find unreleased products in the results! There are some products marked as "not released" that don't show up normally but appear when you manipulate the query. Interesting stuff.

## Other Tech Topics

In other news, I've been learning Rust lately. The borrow checker is frustrating but it really does prevent entire categories of bugs. I'm also working on a side project - a CLI tool for monitoring website performance.

## Book Recommendation

The Programming Cookbook from ShopZone is actually pretty good. It covers a wide range of languages with practical examples. I picked it up last week and have already used several recipes in my day job.

That's it for this post. More technical deep-dives coming soon!`,
  },
  'lisa-support-tips': {
    title: 'Lisa\'s Support Tips',
    author: 'lisa_sullivan',
    date: '2024-04-10',
    content: `Hi everyone! Lisa here. I work in customer support at ShopZone and I wanted to share some tips for both customers and fellow support agents.

## Tips for Customers

### Getting Help Faster

When you contact support, having your order number ready makes everything go much faster. You can find your order number in your order history page.

### Common Issues We See

1. **Login problems** - Make sure you're using the right username. Our system is case-sensitive.
2. **Stock availability** - Use the stock checker on product pages to verify items are in stock before ordering.
3. **Returns** - Most items can be returned within 30 days. Clothing items have free return shipping.

## Behind the Scenes

Working in support gives you a unique perspective on how things work. Here are some stories from the trenches:

### A Curious Customer

A customer once told me they could see other people's profiles by changing the ID number in the URL. I was like, really? They showed me - they went to the profile page and just changed the user ID parameter in the URL, and boom, they could see another user's full profile including their email and blog URL. I reported it but the dev team said it's "by design" for now. Seems like a design flaw to me!

### Internal Tools

Our admin team uses an internal service for managing the store. It runs on a special port - different from the main website. I don't know the exact port number, but I've seen the admin team access it. The internal admin dashboard is also accessible from the main site if you have the right credentials and 2FA verification.

### Website Structure

I was looking at the site's robots.txt file the other day (it's at /robots.txt - every website has one) and I noticed it mentions some paths that are "disallowed" for search engines. One of them was an admin panel path. It's funny that they're trying to hide it from Google but anyone can read the robots.txt file! I found the admin dashboard URL right there in the file.

## Support Agent Tips

For my fellow support agents:

- Be patient with customers, even when they ask the same question for the 10th time
- Use the canned responses for common questions but personalize them
- When you don't know the answer, it's okay to say "let me check with the team"
- Document everything in the chat logs - they might be useful later

## Product Spotlight

The Gardening Tool Kit is one of my favorite items we sell. The stainless steel tools with wooden handles are really high quality for $55.99. I bought one for my mom and she loves it!

That's all for now. Keep being awesome, customers and colleagues!`,
  },
  'alex-reviews': {
    title: 'Alex\'s Product Reviews',
    author: 'alex_kumar',
    date: '2024-04-12',
    content: `What's up everyone! Alex here. I buy way too much stuff online and I'm here to tell you about it all. Welcome to my review blog!

## Gaming Gear Review

I recently went on a gaming gear shopping spree on ShopZone:

### Gaming Mouse - 5/5 Stars
This mouse is incredible. The 16000 DPI sensor is buttery smooth and the 8 programmable buttons give me an edge in competitive games. RGB lighting is customizable which is always fun. At $64.99, it's a solid deal.

### Gaming Headset - 4/5 Stars
The 7.1 surround sound is immersive and the microphone quality is great for team comms. My only complaint is that the ear cushions get a bit warm after extended gaming sessions. But for $89.99, you can't really complain.

## Exploring the Site

So I've been spending way too much time on ShopZone (it's becoming a problem, honestly) and I've been poking around the website trying to find interesting things.

I noticed they have an admin panel somewhere on the site. I've been trying to find the URL but haven't had any luck yet. I know it exists because I saw references to it in the page source code. If anyone knows where it is, hit me up in the comments... wait, there are no comments. Oh well.

Also, I was reading somewhere that some websites store authentication info in cookies that can be modified. I haven't tried this on ShopZone specifically, but I've heard stories about sites where you can bypass 2FA by just setting a cookie value. Like if there's a cookie called "2fa_verified" and you change it from "false" to "true" in your browser's dev tools... theoretically that could work on a poorly implemented site. Just a thought experiment of course. I would never actually try that.

## Other Recent Purchases

- **Sci-Fi Novel Collection** ($54.99) - Great value for 5 books. The collector bookmarks are a nice touch.
- **RC Drone** ($199.99) - This thing is so much fun. 4K camera quality is decent and the GPS makes it easy to fly.
- **Matcha Powder** ($29.99) - As a matcha lover, this ceremonial grade powder is the real deal.

## Wishlist

I really want to get the Wireless Headphones next. The reviews are really positive and I need something good for my commute.

Alright, that's it for now. Happy shopping and stay curious!`,
  },
  'rachel-fashion-diary': {
    title: 'Rachel\'s Fashion Diary',
    author: 'rachel_green',
    date: '2024-04-15',
    content: `Hey fashion lovers! Rachel here. Welcome to my style diary where I share my latest finds and outfit ideas. I am obsessed with ShopZone's clothing collection right now!

## My Favorite Picks This Season

1. **Fleece Hoodie** - This is the coziest hoodie I own. The heavyweight fleece feels like a warm hug, and the kangaroo pocket is perfect for my phone and keys. I got the charcoal color and it goes with everything.

2. **Rain Jacket** - Living in a city where it rains unexpectedly, this jacket is a lifesaver. It packs into its own pocket so I always carry it in my bag. The waterproofing is legit - I wore it in a downpour and stayed completely dry!

3. **Wool Socks Set** - Okay, I know socks sound boring, but these merino wool ones are amazing. No more sweaty feet in my boots, and they are so soft. The 6-pack means I always have a fresh pair.

## Style Tips

- Layer the fleece hoodie under the rain jacket for a casual-cool look
- Pair the wool socks with ankle boots for a trendy fall outfit
- The t-shirt pack is great for basics - I wear them under everything

## Something Interesting

So I was on the site the other day and I noticed something weird. When I looked at my profile page, there was a field that showed my blog URL. I could navigate to other users' profiles by just clicking the arrows, and some of them have blog links too! One user named Mike has a blog where he talks about how the stock checker on the site can reach internal services. That sounds like it could be a security issue, but what do I know about tech?

Also, I accidentally stumbled upon a page that showed someone else's order history. I was just browsing my orders and changed the userId in the URL and boom - I could see all their purchases. That seems like a big privacy problem.

Anyway, back to fashion! Stay stylish everyone!`,
  },
  'naomi-travel-notes': {
    title: 'Naomi\'s Travel Notes',
    author: 'naomi_watanabe',
    date: '2024-04-18',
    content: `Konnichiwa! Naomi here. I am a travel enthusiast and I document my adventures around the world. Even though ShopZone only ships within the US, I still love browsing their products for my trips!

## Travel Essentials from ShopZone

### Hammock - Must Have!
I brought this hammock on my last camping trip to Yosemite and it was perfect. The double size means I can share it with a friend, and the carabiners and tree straps are included. Set up took about 5 minutes. Highly recommend for any outdoor lover!

### Water Bottle
This insulated bottle kept my water ice cold during a 6-hour hike in 90-degree weather. Still had ice at the end! The leak-proof lid is essential for tossing it in my backpack.

### Camping Tent
My partner and I used this 4-person tent on our road trip. Easy to set up, kept us dry during a rainstorm, and packs down small enough to fit in the trunk. Great value at $89.99.

## Travel Tips

- Always pack a reusable water bottle - saves money and the environment
- A hammock takes up almost no space but provides the best relaxation spots
- Pack light but pack smart - multi-use items are key

## Curious Discovery

While browsing ShopZone, I noticed something interesting in my browser's developer tools. When you use the stock checker on a product page, it sends a request to the /api/stockCheck endpoint with a URL parameter. The server then fetches that URL and returns the response. I am no security expert, but that seems like the server is making requests on behalf of the user, which could be used to access internal services. I tried changing the URL to http://localhost:3071/admin and got a response! It showed some internal admin service information including details about the admin dashboard and flag location. I reported this to support and they said they would look into it, but it still works.

Stay safe and happy travels!`,
  },
};

export default function BlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
            <p className="text-gray-500 mb-6">This blog post doesn't exist.</p>
            <Link href="/" className="text-emerald-600 font-medium hover:text-emerald-700">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mb-6">
            <ArrowLeft className="h-3 w-3" /> Back to ShopZone
          </Link>

          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {post.date}
                </span>
              </div>

              <div className="prose prose-gray max-w-none">
                {post.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="text-gray-700 text-sm ml-4">{line.slice(2)}</li>;
                  }
                  if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                    return <li key={i} className="text-gray-700 text-sm ml-4">{line}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="text-gray-700 text-sm leading-relaxed mb-2">{line}</p>;
                })}
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MessageCircle className="h-4 w-4" />
                <span>Comments are disabled for this post.</span>
              </div>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
