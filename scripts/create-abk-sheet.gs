/**
 * ABK Unlimited — Google Sheets Auto-Generator
 *
 * HOW TO USE:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this entire script
 * 4. Click Run → createABKSheet
 * 5. Authorize when prompted
 * 6. A new Google Sheet will be created in your Drive with all tabs + content
 * 7. Copy the Sheet ID from the URL and set it as GOOGLE_SHEETS_ID in .env
 */

function createABKSheet() {
  const ss = SpreadsheetApp.create("ABK Unlimited — Site Content");
  const ssId = ss.getId();

  Logger.log("✅ Created spreadsheet: " + ss.getUrl());
  Logger.log("📋 Sheet ID: " + ssId);

  // Remove the default "Sheet1"
  const defaultSheet = ss.getSheetByName("Sheet1");

  // Create all tabs
  createSiteConfigTab(ss);
  createServicesTab(ss);
  createPortfolioTab(ss);
  createTestimonialsTab(ss);
  createBlogTab(ss);
  createTeamTab(ss);
  createFAQsTab(ss);
  createSEOTab(ss);

  // Now delete the default sheet
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
  }

  // Format all sheets
  formatAllSheets(ss);

  Logger.log("");
  Logger.log("🎉 Done! All 8 tabs created and populated.");
  Logger.log("📎 Sheet URL: " + ss.getUrl());
  Logger.log("🔑 Sheet ID for .env: " + ssId);

  return ssId;
}

// ─── SITE CONFIG ───────────────────────────────────────────────

function createSiteConfigTab(ss) {
  const sheet = ss.insertSheet("site_config");

  const headers = ["key", "value"];
  const data = [
    headers,
    ["business_name", "ABK Unlimited"],
    ["tagline", "Pittsburgh's Trusted General Contractor"],
    ["phone", "(412) 944-1683"],
    ["phone_raw", "+14129441683"],
    ["email", "abk.unlimited@gmail.com"],
    ["address", "138 Balver Ave, Pittsburgh, PA 15205"],
    ["website", "https://abkunlimited.com"],
    ["founded_year", "2005"],
    ["license_number", "PA163301"],
    ["gc_license", "GC-2021-002697"],
    ["primary_color", "#14664f"],
    ["secondary_color", "#1a1a2e"],
    ["accent_color", "#1a8a6a"],
    ["facebook_url", "https://www.facebook.com/profile.php?id=100065571905770"],
    ["houzz_url", "https://www.houzz.com/professionals/general-contractors/abk-unlimited-pfvwus-pf~222150373"],
    ["crm_tracking_id", "tk_646afa21f1344a9f960010e84b1aeea4"],
    ["crm_location_id", ""],
    ["crm_access_token", ""],
    ["crm_pipeline_id", "G9L7BKFIGlD7140Ebh9x"],
    ["cro9_api_key", ""],
    ["gemini_api_key", ""],
    ["hours_weekday", "07:00 - 18:00"],
    ["hours_saturday", "08:00 - 14:00"],
    ["hours_sunday", "Closed"],
    ["service_area", "Greater Pittsburgh, Allegheny County & Surrounding Areas"],
    ["latitude", "40.4406"],
    ["longitude", "-79.9959"],
    ["price_range", "$10,000 - $500,000"],
    ["rating", "5.0"],
    ["review_count", "200+"],
    ["projects_completed", "1200+"],
    ["years_experience", "18+"],
    ["meta_title", "ABK Unlimited | Pittsburgh's Trusted General Contractor | Kitchen & Bath Remodeling"],
    ["meta_description", "Award-winning Pittsburgh general contractor specializing in kitchen remodeling, bathroom renovations, basement finishing & deck building. Licensed & insured. Free estimates. Call (412) 944-1683."],
  ];

  sheet.getRange(1, 1, data.length, 2).setValues(data);
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 500);
}

// ─── SERVICES ──────────────────────────────────────────────────

function createServicesTab(ss) {
  const sheet = ss.insertSheet("services");

  const headers = ["id", "title", "slug", "description", "image_id", "icon", "order", "features", "price_range"];
  const data = [
    headers,
    [
      "svc-kitchen",
      "Kitchen Remodeling",
      "kitchen-remodeling",
      "Transform your kitchen into the heart of your home. From minor updates to complete renovations, ABK Unlimited creates stunning, functional kitchens tailored to your lifestyle.",
      "",
      "ChefHat",
      "1",
      "Custom Cabinet Design & Installation|Granite, Quartz & Marble Countertops|Kitchen Island Construction|Appliance Installation & Upgrades|Backsplash Tile Installation|Under-Cabinet & Recessed Lighting|Flooring Installation|Plumbing & Electrical Updates",
      "$15,000 - $150,000+"
    ],
    [
      "svc-bathroom",
      "Bathroom Remodeling",
      "bathroom-remodeling",
      "Create your personal spa retreat. From powder room updates to complete master bathroom transformations, we bring luxury and functionality to every project.",
      "",
      "Bath",
      "2",
      "Walk-In Shower Installation|Soaking & Freestanding Tubs|Custom Vanity Design|Heated Floor Installation|Tile & Stone Work|Lighting & Ventilation|Plumbing Upgrades|ADA Accessible Options",
      "$8,000 - $75,000+"
    ],
    [
      "svc-basement",
      "Basement Finishing",
      "basement-finishing",
      "Unlock your home's hidden potential. Transform unused basement space into beautiful, functional living areas that add value to your property.",
      "",
      "Home",
      "3",
      "Waterproofing & Moisture Control|Framing & Insulation|Electrical & Lighting|HVAC Extension|Flooring Installation|Bathroom Addition|Egress Window Installation|Custom Built-Ins",
      "$25,000 - $100,000+"
    ],
    [
      "svc-additions",
      "Home Additions",
      "home-additions",
      "Need more space? We design and build seamless home additions that look like they've always been there, adding value and functionality to your property.",
      "",
      "Building2",
      "4",
      "Room Additions|Second Story Additions|Sunrooms & Four-Season Rooms|In-Law Suites|Garage Additions|Bump-Outs|Structural Engineering|Permit Management",
      "$50,000 - $250,000+"
    ],
    [
      "svc-roofing",
      "Roofing",
      "roofing",
      "Trusted by Pittsburgh homeowners since 2009. Expert roof replacement, repair, and installation with premium materials and industry-leading warranties. Licensed Pennsylvania contractor serving Allegheny County and beyond.",
      "",
      "Home",
      "5",
      "Roof Replacement|Roof Repair|Metal Roofing|Flat Roofing|Gutter Installation|Skylight Installation|Emergency Repairs|Insurance Claims",
      "$8,000 - $50,000+"
    ],
    [
      "svc-decks",
      "Deck Building",
      "deck-building",
      "Extend your living space outdoors with a custom-designed deck. We build beautiful, durable outdoor spaces for Pittsburgh's four seasons.",
      "",
      "Fence",
      "6",
      "Composite Decking (Trex, TimberTech)|Premium Wood Options|Custom Railings & Stairs|Built-In Seating & Planters|Pergolas & Shade Structures|Outdoor Lighting|Permit Handling|Multi-Level Designs",
      "$25,000 - $100,000+"
    ],
    [
      "svc-flooring",
      "Flooring Installation",
      "flooring-installation",
      "Transform your space from the ground up. Expert flooring installation with premium materials and meticulous attention to detail.",
      "",
      "Layers",
      "7",
      "Hardwood Floor Installation|Tile & Stone Installation|Luxury Vinyl Plank (LVP)|Carpet Installation|Floor Refinishing|Subfloor Repair|Heated Floor Systems|Custom Patterns & Inlays",
      "$4 - $25/sq ft installed"
    ],
    [
      "svc-custom-homes",
      "Custom Homes",
      "custom-homes",
      "Build the home you've always envisioned. From concept to completion, we bring your dream home to life with expert craftsmanship and personalized attention.",
      "",
      "Castle",
      "8",
      "Full Design-Build Services|Site Selection Assistance|Architectural Planning|Energy-Efficient Construction|Smart Home Integration|Premium Material Selection|Project Management|Warranty & Support",
      "$300,000 - $1,000,000+"
    ],
    [
      "svc-commercial",
      "Commercial Construction",
      "commercial-construction",
      "Professional commercial construction and tenant improvements. We build spaces that help businesses thrive.",
      "",
      "Building",
      "9",
      "Office Buildouts & Renovations|Retail Space Construction|Restaurant Build-Outs|Medical & Dental Offices|Warehouse & Industrial|Tenant Improvements|ADA Compliance|Code & Permit Management",
      "Custom pricing"
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 400);
  sheet.setColumnWidth(5, 120);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 60);
  sheet.setColumnWidth(8, 500);
  sheet.setColumnWidth(9, 150);
}

// ─── PORTFOLIO ─────────────────────────────────────────────────

function createPortfolioTab(ss) {
  const sheet = ss.insertSheet("portfolio");

  const headers = ["id", "title", "description", "image_ids", "category", "date", "location"];
  const data = [
    headers,
    [
      "port-1",
      "Modern Kitchen Transformation",
      "Complete kitchen renovation featuring custom white shaker cabinets, quartz countertops, and professional-grade appliances.",
      "",
      "Kitchen Remodeling",
      "2024",
      "Mt. Lebanon, PA"
    ],
    [
      "port-2",
      "Spa-Like Master Bathroom",
      "Luxurious master bath with freestanding soaking tub, frameless glass shower, and heated marble floors.",
      "",
      "Bathroom Remodeling",
      "2024",
      "Sewickley, PA"
    ],
    [
      "port-3",
      "Entertainment Basement",
      "Full basement finish with home theater, wet bar, and guest suite. 1,500 sq ft of new living space.",
      "",
      "Basement Finishing",
      "2024",
      "Cranberry Township, PA"
    ],
    [
      "port-4",
      "Multi-Level Composite Deck",
      "Custom Trex deck with built-in seating, pergola, and outdoor kitchen area. Perfect for entertaining.",
      "",
      "Deck Building",
      "2024",
      "Upper St. Clair, PA"
    ],
    [
      "port-5",
      "Traditional Kitchen Remodel",
      "Classic cherry cabinet kitchen with granite counters and custom island.",
      "",
      "Kitchen Remodeling",
      "2023",
      "Bethel Park, PA"
    ],
    [
      "port-6",
      "Contemporary Double Vanity Bath",
      "Modern bathroom featuring floating double vanity and walk-in shower.",
      "",
      "Bathroom Remodeling",
      "2023",
      "Moon Township, PA"
    ],
    [
      "port-7",
      "Home Office Addition",
      "400 sq ft home office addition with built-in bookcases and private entrance.",
      "",
      "Home Additions",
      "2023",
      "Robinson, PA"
    ],
    [
      "port-8",
      "Hardwood Floor Installation",
      "2,000 sq ft of white oak hardwood throughout main level with custom stain.",
      "",
      "Flooring",
      "2023",
      "Pittsburgh, PA"
    ],
    [
      "port-9",
      "Farmhouse Kitchen",
      "Charming farmhouse kitchen with shaker cabinets and apron sink.",
      "",
      "Kitchen Remodeling",
      "2023",
      "Cranberry Township, PA"
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 250);
  sheet.setColumnWidth(3, 400);
  sheet.setColumnWidth(4, 120);
  sheet.setColumnWidth(5, 160);
  sheet.setColumnWidth(6, 80);
  sheet.setColumnWidth(7, 180);
}

// ─── TESTIMONIALS ──────────────────────────────────────────────

function createTestimonialsTab(ss) {
  const sheet = ss.insertSheet("testimonials");

  const headers = ["id", "name", "role", "text", "rating", "image_id", "project_type"];
  const data = [
    headers,
    [
      "test-1",
      "Jennifer M.",
      "Homeowner, Mt. Lebanon",
      "ABK Unlimited transformed our outdated 1950s kitchen into a modern showpiece. The team was professional, on schedule, and the attention to detail was incredible. We couldn't be happier with the result!",
      "5",
      "",
      "Kitchen Remodel"
    ],
    [
      "test-2",
      "David & Sarah K.",
      "Homeowners, Moon Township",
      "After getting burned by another contractor, we were hesitant to start our basement project. ABK was completely different — transparent pricing, regular updates, and the finished result exceeded our expectations. Our new entertainment space is the envy of the neighborhood.",
      "5",
      "",
      "Basement Finishing"
    ],
    [
      "test-3",
      "Michael R.",
      "Homeowner, Sewickley",
      "Our deck was falling apart and we needed it replaced before summer. ABK designed a beautiful multi-level Trex deck with a built-in pergola. It was done on time and on budget. Their craftsmanship is top-notch.",
      "5",
      "",
      "Deck Building"
    ],
    [
      "test-4",
      "Michael & Sarah Thompson",
      "Homeowners, Mt. Lebanon, PA",
      "ABK Unlimited transformed our dated kitchen into a stunning modern space. Anthony and his team were professional, clean, and finished on time. The attention to detail was incredible — from the custom cabinetry to the backsplash installation. Highly recommend!",
      "5",
      "",
      "Kitchen Remodel"
    ],
    [
      "test-5",
      "Jennifer Martinez",
      "Homeowner, Sewickley, PA",
      "We hired ABK for a complete home renovation and couldn't be happier. They handled everything from design to final walkthrough. Communication was excellent throughout the 4-month project. Our house feels brand new!",
      "5",
      "",
      "Full Home Renovation"
    ],
    [
      "test-6",
      "Robert & Linda Chen",
      "Homeowners, Cranberry Township, PA",
      "ABK turned our unfinished basement into an amazing entertainment space with a wet bar and home theater. The craftsmanship is top-notch. They stayed within budget and even suggested cost-saving alternatives without sacrificing quality.",
      "5",
      "",
      "Basement Finishing"
    ],
    [
      "test-7",
      "David Patterson",
      "Homeowner, Moon Township, PA",
      "Our new composite deck is beautiful! ABK handled all permits and built a custom design that perfectly complements our home. The outdoor living space has completely changed how we use our backyard.",
      "5",
      "",
      "Deck Construction"
    ],
    [
      "test-8",
      "Amanda & James Wilson",
      "Homeowners, Upper St. Clair, PA",
      "We renovated two bathrooms with ABK and the results exceeded our expectations. The tile work is flawless, and they helped us select fixtures that elevated the design. Professional crew that respected our home.",
      "5",
      "",
      "Bathroom Remodel"
    ],
    [
      "test-9",
      "Patricia O'Brien",
      "Homeowner, Bethel Park, PA",
      "ABK built a beautiful 500 sq ft addition that seamlessly matches our existing home. The structural work and finishing are impeccable. Worth every penny — they truly care about quality.",
      "5",
      "",
      "Home Addition"
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 150);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 500);
  sheet.setColumnWidth(5, 60);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 150);
}

// ─── BLOG ──────────────────────────────────────────────────────

function createBlogTab(ss) {
  const sheet = ss.insertSheet("blog");

  const headers = ["id", "title", "slug", "content", "excerpt", "image_id", "published_at", "status", "author", "category", "read_time"];
  const data = [
    headers,
    [
      "blog-1",
      "Top Kitchen Remodel Trends for 2025",
      "kitchen-remodel-trends-2025",
      "The kitchen continues to be the heart of the home, and 2025 brings exciting new trends. From bold color choices to smart appliance integration, here's what's trending in Pittsburgh kitchen remodeling.\n\n## 1. Two-Tone Cabinetry\nMixing cabinet colors adds depth and visual interest. The most popular combination? Navy blue lower cabinets with white uppers.\n\n## 2. Quartz Countertops Dominate\nQuartz continues to outpace granite for its durability, low maintenance, and design versatility.\n\n## 3. Smart Kitchen Integration\nWi-Fi-enabled appliances, touchless faucets, and under-cabinet charging stations are now standard in high-end remodels.\n\n## 4. Open Shelving Accents\nWhile full open shelving is declining, accent sections of open shelving mixed with traditional cabinets creates a curated look.\n\n## 5. Oversized Islands\nKitchen islands continue to grow, serving as dining, prep, and social hub all in one.\n\nReady to bring these trends to your Pittsburgh kitchen? Contact ABK Unlimited for a free design consultation.",
      "The kitchen continues to be the heart of the home, and 2025 brings exciting new trends. From bold color choices to smart appliance integration, here's what's trending.",
      "",
      "2025-01-05",
      "published",
      "Anthony Kowalski",
      "Kitchen",
      "6 min"
    ],
    [
      "blog-2",
      "Bathroom Renovation ROI: What to Expect",
      "bathroom-renovation-roi",
      "Thinking about a bathroom remodel? Here's what you need to know about return on investment for different types of bathroom renovations in the Pittsburgh market.\n\n## Average ROI by Project Type\n\n### Minor Bathroom Remodel (60-70% ROI)\n- Updated fixtures and hardware\n- New vanity and mirror\n- Fresh paint and lighting\n- Budget: $8,000-$15,000\n\n### Mid-Range Bathroom Remodel (55-65% ROI)\n- New tile floors and shower surround\n- Updated plumbing fixtures\n- New vanity with stone countertop\n- Budget: $15,000-$35,000\n\n### Upscale Master Bathroom (50-60% ROI)\n- Walk-in shower with frameless glass\n- Freestanding soaking tub\n- Heated floors\n- Custom cabinetry\n- Budget: $35,000-$75,000\n\n## Tips to Maximize ROI\n1. Don't over-improve for your neighborhood\n2. Stick to neutral, timeless finishes\n3. Focus on quality fixtures that last\n4. Ensure proper waterproofing\n\nContact ABK Unlimited to discuss your bathroom renovation and get a free estimate.",
      "Thinking about a bathroom remodel? Here's what you need to know about return on investment for different types of bathroom renovations in the Pittsburgh market.",
      "",
      "2024-12-28",
      "published",
      "Maria Kowalski",
      "Bathroom",
      "5 min"
    ],
    [
      "blog-3",
      "Complete Guide to Finishing Your Basement",
      "basement-finishing-guide",
      "Your basement represents untapped potential. Here's everything Pittsburgh homeowners need to know about transforming that unfinished space into valuable living area.\n\n## Before You Start\n\n### Address Moisture First\nPittsburgh's climate means moisture control is critical. Before any finishing work:\n- Check for water intrusion after heavy rains\n- Consider interior/exterior waterproofing\n- Install a quality sump pump system\n- Use vapor barriers on walls and floors\n\n### Check Building Codes\nAllegheny County requires:\n- Minimum 7-foot ceiling height\n- Egress windows in bedrooms\n- Smoke and carbon monoxide detectors\n- Proper electrical and plumbing permits\n\n## Popular Basement Layouts\n\n### Entertainment Hub\nHome theater, gaming area, and wet bar. Budget: $40,000-$80,000\n\n### Guest Suite\nBedroom, bathroom, and sitting area. Budget: $35,000-$60,000\n\n### Home Office\nDedicated workspace away from household distractions. Budget: $15,000-$30,000\n\n### Multi-Purpose\nCombination of uses with flexible zones. Budget: $30,000-$60,000\n\n## Timeline\nMost basement finishing projects take 6-10 weeks from start to finish.\n\nReady to unlock your basement's potential? ABK Unlimited offers free in-home consultations.",
      "Your basement represents untapped potential. Here's everything Pittsburgh homeowners need to know about transforming that unfinished space into valuable living area.",
      "",
      "2024-12-15",
      "published",
      "James Mitchell",
      "Basement",
      "8 min"
    ],
    [
      "blog-4",
      "Composite vs Wood Decking: Which Is Right for You?",
      "deck-material-comparison",
      "Choosing between composite and wood decking? Both have pros and cons for Pittsburgh's four-season climate. Here's a detailed comparison to help you decide.\n\n## Composite Decking\n\n### Pros\n- Minimal maintenance (no staining/sealing)\n- Won't rot, warp, or splinter\n- 25-year+ warranties\n- Consistent appearance over time\n- Eco-friendly (made from recycled materials)\n\n### Cons\n- Higher upfront cost ($45-85/sq ft installed)\n- Can get hot in direct sun\n- Limited ability to refinish\n- Some options look less natural\n\n### Best Brands\n- Trex (most popular)\n- TimberTech/AZEK\n- Fiberon\n\n## Pressure-Treated Wood\n\n### Pros\n- Lower upfront cost ($25-40/sq ft installed)\n- Natural wood appearance\n- Can be stained any color\n- Easy to repair individual boards\n\n### Cons\n- Requires annual maintenance\n- Will crack, warp, and splinter over time\n- Shorter lifespan (10-15 years)\n- Needs regular staining/sealing\n\n## Our Recommendation\nFor most Pittsburgh homeowners, composite decking is the better long-term investment. The higher upfront cost is offset by virtually zero maintenance over 25+ years.\n\nContact ABK Unlimited for a free deck consultation and quote.",
      "Choosing between composite and wood decking? Both have pros and cons for Pittsburgh's four-season climate. Here's a detailed comparison.",
      "",
      "2024-12-01",
      "published",
      "Anthony Kowalski",
      "Outdoor",
      "7 min"
    ],
    [
      "blog-5",
      "Planning a Home Addition: What You Need to Know",
      "home-addition-planning",
      "A home addition is one of the most significant investments you can make. Here's what every Pittsburgh homeowner should consider before breaking ground.\n\n## Types of Home Additions\n\n### Room Addition (Ground Floor)\nExpand your home's footprint. Ideal when you have available lot space.\n- Average cost: $150-$300/sq ft\n- Timeline: 2-4 months\n\n### Second Story Addition\nBuild up when you can't build out. More complex but preserves yard space.\n- Average cost: $200-$400/sq ft\n- Timeline: 3-6 months\n\n### Sunroom/Four-Season Room\nEnjoy the outdoors year-round. Great for Pittsburgh's variable weather.\n- Average cost: $100-$250/sq ft\n- Timeline: 6-10 weeks\n\n## Key Planning Steps\n1. Check local zoning and setback requirements\n2. Determine if your lot and foundation can support the addition\n3. Match architectural style to existing home\n4. Plan for HVAC extension and electrical upgrades\n5. Get proper permits (ABK handles this)\n\n## Common Mistakes to Avoid\n- Not matching the roofline to existing structure\n- Skimping on foundation work\n- Forgetting about HVAC and electrical capacity\n- Not planning for future resale value\n\nReady to add space to your Pittsburgh home? Contact ABK Unlimited for a free consultation.",
      "A home addition is one of the most significant investments you can make. Here's what every Pittsburgh homeowner should consider before breaking ground.",
      "",
      "2024-11-18",
      "published",
      "James Mitchell",
      "Additions",
      "6 min"
    ],
    [
      "blog-6",
      "How to Choose the Right Flooring for Each Room",
      "choosing-flooring",
      "The right flooring can transform a room. But with so many options, how do you choose? Here's our room-by-room guide for Pittsburgh homes.\n\n## Kitchen\n**Best options**: Tile, luxury vinyl plank (LVP), hardwood\n- Needs water resistance and durability\n- LVP offers the best value with realistic wood looks\n- Tile is most durable but hardest on feet\n\n## Bathroom\n**Best options**: Porcelain tile, natural stone, vinyl\n- Must be waterproof\n- Porcelain tile with radiant heating is the gold standard\n- Luxury vinyl is budget-friendly and water-proof\n\n## Living Room\n**Best options**: Hardwood, engineered wood, LVP\n- Hardwood adds the most value\n- Engineered wood handles Pittsburgh humidity better\n- Area rugs add warmth and define spaces\n\n## Bedroom\n**Best options**: Hardwood, carpet, engineered wood\n- Carpet provides warmth and comfort underfoot\n- Hardwood with area rugs is trending\n\n## Basement\n**Best options**: LVP, tile, epoxy\n- Must handle potential moisture\n- Never install hardwood in basements\n- LVP with foam underlayment is most popular\n\n## Price Ranges (Installed)\n- Carpet: $4-12/sq ft\n- Luxury Vinyl: $6-15/sq ft\n- Hardwood: $8-25/sq ft\n- Tile: $10-30/sq ft\n\nNeed help choosing? ABK Unlimited provides free flooring consultations for Pittsburgh homeowners.",
      "The right flooring can transform a room. But with so many options, how do you choose? Here's our room-by-room guide for Pittsburgh homes.",
      "",
      "2024-11-05",
      "published",
      "Maria Kowalski",
      "Flooring",
      "5 min"
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 300);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 600);
  sheet.setColumnWidth(5, 300);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 80);
  sheet.setColumnWidth(9, 150);
  sheet.setColumnWidth(10, 100);
  sheet.setColumnWidth(11, 80);
}

// ─── TEAM ──────────────────────────────────────────────────────

function createTeamTab(ss) {
  const sheet = ss.insertSheet("team");

  const headers = ["id", "name", "role", "bio", "image_id"];
  const data = [
    headers,
    [
      "team-1",
      "Anthony B. Kowalski",
      "Founder & CEO",
      "Third-generation craftsman with 25+ years in construction. Founded ABK Unlimited in 2005 with a mission to deliver honest, quality work at fair prices to Pittsburgh homeowners.",
      ""
    ],
    [
      "team-2",
      "Maria Kowalski",
      "Operations Director",
      "Ensures every project runs smoothly from start to finish. Maria oversees scheduling, client communication, and quality control across all active projects.",
      ""
    ],
    [
      "team-3",
      "James Mitchell",
      "Lead Project Manager",
      "15+ years managing complex residential renovations. James coordinates crews, manages timelines, and serves as the primary point of contact for clients during construction.",
      ""
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 500);
  sheet.setColumnWidth(5, 100);
}

// ─── FAQS ──────────────────────────────────────────────────────

function createFAQsTab(ss) {
  const sheet = ss.insertSheet("faqs");

  const headers = ["id", "question", "answer", "category"];
  const data = [
    headers,
    // Roofing FAQs
    [
      "faq-1",
      "How much does a new roof cost in Pittsburgh, PA?",
      "In Pittsburgh, a complete roof replacement typically costs between $8,000 and $20,000 for an average-sized home (1,500-2,500 sq ft). Asphalt shingles average $9,500, while architectural shingles run $12,000-$15,000. Metal roofing starts around $15,000. Factors like roof pitch, accessibility, and material choice significantly impact the final price. ABK Unlimited provides free detailed estimates with no obligation.",
      "Roofing"
    ],
    [
      "faq-2",
      "How much should a 2000 sq ft roof cost?",
      "A 2,000 square foot roof in Pittsburgh typically costs $10,000-$16,000 for standard asphalt shingles, including tear-off and disposal. For architectural shingles, expect $13,000-$18,000. Metal roofing for this size runs $18,000-$28,000. These estimates include materials, labor, permits, and cleanup. We recommend getting 3 quotes and choosing based on reputation, not just price.",
      "Roofing"
    ],
    [
      "faq-3",
      "What does a roofer charge per hour in Pittsburgh?",
      "Pittsburgh roofers typically charge $45-$75 per hour for labor, but most residential projects are quoted as flat-rate jobs rather than hourly. A complete roof replacement usually takes 1-3 days with a crew of 4-6 workers. Repair jobs may be charged hourly with a minimum service fee of $150-$300. ABK Unlimited provides transparent flat-rate pricing for all roofing projects.",
      "Roofing"
    ],
    [
      "faq-4",
      "How to spot a bad roofing company?",
      "Red flags include: demanding large upfront payments (legitimate contractors ask for 10-30% deposit), no physical address or PA contractor license, pressure to sign immediately, inability to provide references, no written contract, unusually low bids (often indicates corner-cutting or bait-and-switch), and door-to-door solicitation after storms. Always verify licensing at PA's contractor verification website and check BBB ratings.",
      "Roofing"
    ],
    [
      "faq-5",
      "How long does a roof replacement take?",
      "Most residential roof replacements in Pittsburgh take 1-3 days depending on size, complexity, and weather. A standard 2,000 sq ft roof with a single layer tear-off typically completes in 1-2 days. Larger homes, steep pitches, or multiple layers may take 3-4 days. Metal roofing and specialty materials may require additional time. ABK Unlimited provides specific timelines in every estimate.",
      "Roofing"
    ],
    [
      "faq-6",
      "Does homeowner's insurance cover roof replacement?",
      "Homeowner's insurance typically covers roof damage from sudden events like storms, hail, fallen trees, or fire. Normal wear and aging are not covered. If your roof is damaged, document everything with photos, file a claim promptly, and get a professional inspection. ABK Unlimited works directly with insurance adjusters and can help document damage for your claim.",
      "Roofing"
    ],
    // Remodeling FAQs
    [
      "faq-7",
      "What is the 30% rule in home renovation?",
      "The 30% rule suggests that the cost of a remodeling project should not exceed 30% of your home's current value. For example, if your home is worth $300,000, you should aim to spend no more than $90,000 on renovations. This helps ensure you don't over-improve for your neighborhood and can recoup your investment when selling.",
      "Remodeling"
    ],
    [
      "faq-8",
      "Is $50,000 enough to renovate a home?",
      "Yes, $50,000 can accomplish significant renovations depending on your priorities. This budget typically covers a full kitchen OR bathroom remodel, or several smaller updates throughout the home. In Pittsburgh, $50,000 could include a mid-range kitchen renovation ($35,000) plus bathroom updates ($15,000), or a complete basement finishing project.",
      "Remodeling"
    ],
    [
      "faq-9",
      "Is $100,000 enough to renovate a house?",
      "A $100,000 budget provides substantial renovation possibilities. In the Pittsburgh market, this can cover a high-end kitchen remodel ($60,000-$75,000) plus a luxury bathroom ($25,000-$35,000), or multiple mid-range projects throughout your home including basement finishing, deck building, and interior updates.",
      "Remodeling"
    ],
    [
      "faq-10",
      "What is a reasonable budget for remodeling?",
      "A reasonable remodeling budget depends on your goals and home value. Most financial experts recommend spending 5-15% of your home's value on renovations. For a $250,000 Pittsburgh home, that's $12,500-$37,500. Kitchens and bathrooms typically offer the best ROI, with basement finishing close behind in our market.",
      "Remodeling"
    ],
    [
      "faq-11",
      "How long does a whole-home remodel take?",
      "A complete whole-home remodel typically takes 3-6 months depending on scope. Kitchen remodels average 6-8 weeks, bathrooms 2-4 weeks, and basements 6-10 weeks. ABK Unlimited provides detailed project timelines during your free consultation, and we pride ourselves on meeting deadlines.",
      "Remodeling"
    ],
    [
      "faq-12",
      "Do I need permits for remodeling in Pittsburgh?",
      "Most significant remodeling projects in Pittsburgh require permits. This includes structural changes, electrical work, plumbing modifications, and additions. ABK Unlimited handles all permit applications and inspections as part of our service, ensuring your project meets all Allegheny County building codes.",
      "Remodeling"
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 350);
  sheet.setColumnWidth(3, 600);
  sheet.setColumnWidth(4, 120);
}

// ─── SEO ───────────────────────────────────────────────────────

function createSEOTab(ss) {
  const sheet = ss.insertSheet("seo");

  const headers = ["page_path", "title", "description", "og_image_id"];
  const data = [
    headers,
    [
      "/",
      "ABK Unlimited | Pittsburgh's Trusted General Contractor | Kitchen & Bath Remodeling",
      "Award-winning Pittsburgh general contractor specializing in kitchen remodeling, bathroom renovations, basement finishing & deck building. Licensed & insured. Free estimates. Call (412) 944-1683.",
      ""
    ],
    [
      "/about",
      "About ABK Unlimited | Pittsburgh's Trusted General Contractor Since 2005",
      "Learn about ABK Unlimited, a family-owned general contractor serving Pittsburgh with 18+ years of experience. PA licensed, insured, and committed to quality craftsmanship.",
      ""
    ],
    [
      "/services",
      "Our Services | ABK Unlimited Pittsburgh General Contractor",
      "Comprehensive home remodeling services in Pittsburgh. Kitchen & bathroom remodeling, basement finishing, deck building, home additions, flooring, custom homes & commercial construction.",
      ""
    ],
    [
      "/services/kitchen-remodeling",
      "Kitchen Remodeling Pittsburgh | ABK Unlimited General Contractor",
      "Professional kitchen remodeling services in Pittsburgh. Custom cabinetry, countertops, islands & full renovations. Free estimates. 18+ years experience.",
      ""
    ],
    [
      "/services/bathroom-remodeling",
      "Bathroom Remodeling Pittsburgh | ABK Unlimited General Contractor",
      "Expert bathroom remodeling in Pittsburgh. Walk-in showers, soaking tubs, custom vanities & luxury finishes. Transform your bathroom into a spa retreat.",
      ""
    ],
    [
      "/services/basement-finishing",
      "Basement Finishing Pittsburgh | ABK Unlimited General Contractor",
      "Transform your unfinished basement into valuable living space. Entertainment rooms, home offices, guest suites & more. Pittsburgh's basement experts.",
      ""
    ],
    [
      "/services/deck-building",
      "Deck Building Pittsburgh | ABK Unlimited General Contractor",
      "Custom deck construction in Pittsburgh. Composite & wood decks, pergolas, railings & outdoor living spaces. Expert craftsmanship, lasting quality.",
      ""
    ],
    [
      "/services/roofing",
      "Roofing Contractors Pittsburgh PA | Roof Replacement & Repair | ABK Unlimited",
      "Top-rated roofing contractors in Pittsburgh. Residential & commercial roof replacement, repair, and installation. Asphalt shingles, metal roofing, flat roofs. Free estimates. Licensed PA contractor.",
      ""
    ],
    [
      "/portfolio",
      "Portfolio | ABK Unlimited Pittsburgh General Contractor",
      "View our portfolio of completed projects. Kitchen remodels, bathroom renovations, basement finishing, decks & more. See the quality of ABK Unlimited's work.",
      ""
    ],
    [
      "/testimonials",
      "Customer Reviews & Testimonials | ABK Unlimited Pittsburgh Contractor",
      "Read verified reviews from Pittsburgh homeowners. See why ABK Unlimited is rated 5 stars on Google and Houzz. Real testimonials from kitchen, bathroom, and basement remodeling projects.",
      ""
    ],
    [
      "/blog",
      "Blog | ABK Unlimited Pittsburgh Home Remodeling Tips & Ideas",
      "Expert home remodeling tips, design ideas, and advice from ABK Unlimited. Learn about kitchen renovations, bathroom updates, and more.",
      ""
    ],
    [
      "/contact",
      "Contact ABK Unlimited | Pittsburgh General Contractor",
      "Contact ABK Unlimited for your home remodeling project. Call (412) 944-1683 or fill out our form for a free estimate. Serving Greater Pittsburgh.",
      ""
    ],
    [
      "/free-estimate",
      "Free Estimate | ABK Unlimited Pittsburgh General Contractor",
      "Get a free, no-obligation estimate for your home remodeling project. ABK Unlimited provides detailed quotes for kitchen, bathroom, basement, and more.",
      ""
    ],
    [
      "/financing",
      "Financing Options | ABK Unlimited Pittsburgh Contractor",
      "Flexible financing options for your home renovation project. Low monthly payments, competitive rates, and quick approval. Make your dream renovation affordable.",
      ""
    ],
    [
      "/service-areas",
      "Service Areas | ABK Unlimited Pittsburgh General Contractor",
      "ABK Unlimited serves Greater Pittsburgh including Mt. Lebanon, Bethel Park, Moon Township, Sewickley, Upper St. Clair, Robinson, and Cranberry Township.",
      ""
    ],
    [
      "/remodelling",
      "Home Remodelling Pittsburgh PA | Interior & Exterior Renovation Experts | ABK Unlimited",
      "Pittsburgh's premier home remodelling contractor. Kitchen, bathroom, basement, outdoor & whole-home renovations. Licensed PA contractor since 2009. Free estimates. Financing available.",
      ""
    ],
  ];

  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 450);
  sheet.setColumnWidth(3, 500);
  sheet.setColumnWidth(4, 120);
}

// ─── FORMATTING ────────────────────────────────────────────────

function formatAllSheets(ss) {
  const sheets = ss.getSheets();

  sheets.forEach(function(sheet) {
    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) return;

    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, lastCol);
    headerRange.setBackground("#14664f");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Add alternating row colors
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      for (var i = 2; i <= lastRow; i++) {
        var rowRange = sheet.getRange(i, 1, 1, lastCol);
        if (i % 2 === 0) {
          rowRange.setBackground("#f0faf6");
        } else {
          rowRange.setBackground("#ffffff");
        }
      }
    }

    // Wrap text in all cells
    sheet.getRange(1, 1, lastRow, lastCol).setWrap(true);

    // Set vertical alignment to top
    sheet.getRange(1, 1, lastRow, lastCol).setVerticalAlignment("top");
  });
}
