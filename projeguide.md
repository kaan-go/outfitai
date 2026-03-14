
# AI Outfit Generator SaaS

## Technical Documentation & Development Guide

### 1. Project Overview

This project is an **AI-powered outfit generation and shopping SaaS platform**.

Users can:

1. Upload their full-body photos OR create a body avatar.
2. Generate outfit images using AI.
3. Provide prompts such as:

* upper clothing
* lower clothing
* shoes
* style
* location
* theme

The AI generates a realistic image of the user wearing the outfit.

If the user **likes the generated image**, the system will:

* search online for similar clothing items
* recommend products from well-known brands
* allow users to add them to cart
* complete a purchase

The system also maintains:

* generation history
* outfit history
* shopping cart
* orders
* subscriptions

---

# 2. Core Features

### AI Outfit Generation

Users can generate images based on:

* outfit prompts
* style prompts
* location prompts

Example:

```
Upper: oversized black hoodie
Lower: beige cargo pants
Shoes: nike air force
Location: street in tokyo
Style: cyberpunk
```

Output:

AI-generated outfit photo with user's body/avatar.

---

### Avatar Creation

User has two options:

**Option 1 — Photo Upload**

Upload 4 photos:

* front
* back
* left
* right

These are used to create a **body profile**.

**Option 2 — Manual Body Creation**

User inputs:

* height
* weight
* body type
* gender
* skin tone

Avatar is generated automatically.

---

### Outfit Feedback Loop

After generation user is asked:

```
Do you like this outfit?
```

Options:

* 👍 Yes
* 👎 No
* 🔄 Regenerate

If **Yes**:

System performs:

```
product search
→ match clothing
→ suggest real products
```

---

### Shopping System

Users can:

* add suggested items to cart
* checkout
* view order history

---

### Subscription System

Free Plan:

* limited generations
* no product recommendations

Pro Plan:

* unlimited generations
* product recommendations
* premium styles

---

# 3. Tech Stack

### Frontend

* React
* Vite
* TailwindCSS
* Zustand (state)
* React Query

### Backend

* Node.js
* Express

### Database

* Supabase (PostgreSQL)

### Authentication

* Supabase Auth

### Image Generation

* Wiro AI API

### Image Storage

* Supabase Storage

### Product Data

Possible options:

* scraping
* affiliate APIs
* Shopify partner API

---

# 4. Project Folder Structure

```
ai-outfit-saas
│
├── docs
│   └── PROJECT_GUIDE.md
│
├── server
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   └── server.js
│
├── client
│   ├── src
│   │
│   ├── pages
│   │   ├── LandingPage
│   │   ├── Login
│   │   ├── Signup
│   │   ├── AvatarSetup
│   │   ├── Generator
│   │   ├── History
│   │   ├── Profile
│   │   ├── Cart
│   │   └── Orders
│   │
│   ├── components
│   │   ├── Navbar
│   │   ├── OutfitCard
│   │   ├── ProductCard
│   │   └── PromptPanel
│   │
│   ├── store
│   │   └── userStore
│   │
│   └── api
│
└── package.json
```

---

# 5. User Flow

### Landing Page

User visits landing page.

Sections:

* Hero
* AI examples
* features
* pricing
* signup/login

---

### Authentication

Shopify-style auth screen:

```
Sign Up
Login
Continue with Google
```

Auth handled by **Supabase Auth**.

---

### First Login Flow

If user has **no avatar profile**

Show:

```
Create Your Avatar
```

Options:

```
Upload 4 photos
OR
Create body avatar
```

If skipped:

System asks again on next login.

---

### Avatar Creation Screen

#### Photo Upload

```
Upload Front
Upload Back
Upload Left
Upload Right
```

Better UX suggestion:

Show silhouette guides.

---

#### Body Creator

Inputs:

```
Height
Weight
Body type
Skin tone
Gender
```

---

# 6. Database Schema (Supabase)

### Users

```
users
```

| column            | type      |
| ----------------- | --------- |
| id                | uuid      |
| email             | text      |
| created_at        | timestamp |
| subscription_plan | text      |

---

### Profiles

```
profiles
```

| column          | type    |
| --------------- | ------- |
| id              | uuid    |
| user_id         | uuid    |
| height          | int     |
| weight          | int     |
| body_type       | text    |
| avatar_url      | text    |
| photos_uploaded | boolean |

---

### Generations

```
generations
```

| column     | type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| prompt     | text      |
| image_url  | text      |
| liked      | boolean   |
| created_at | timestamp |

---

### Products

```
products
```

| column | type    |
| ------ | ------- |
| id     | uuid    |
| name   | text    |
| brand  | text    |
| image  | text    |
| price  | numeric |
| url    | text    |

---

### Cart

```
cart
```

| column     | type |
| ---------- | ---- |
| id         | uuid |
| user_id    | uuid |
| product_id | uuid |
| quantity   | int  |

---

### Orders

```
orders
```

| column     | type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| total      | numeric   |
| status     | text      |
| created_at | timestamp |

---

### Order Items

```
order_items
```

| column     | type    |
| ---------- | ------- |
| id         | uuid    |
| order_id   | uuid    |
| product_id | uuid    |
| price      | numeric |
| quantity   | int     |

---

# 7. Image Generation Pipeline

Step 1

User writes prompt

Example:

```
black oversized hoodie
white sneakers
beige pants
tokyo street
```

---

Step 2

Backend receives request

```
POST /generate
```

---

Step 3

Server builds prompt

Example:

```
A realistic photo of a man wearing:
black oversized hoodie
beige cargo pants
white sneakers
tokyo street background
streetwear photography
```

---

Step 4

Send to Wiro AI

```
POST https://api.wiro.ai/generate
```

---

Step 5

Receive image

Store in:

```
Supabase Storage
```

---

Step 6

Save record

```
generations table
```

---

# 8. Product Recommendation Flow

When user clicks **LIKE**

System runs:

```
product search
```

Example query:

```
black oversized hoodie nike
beige cargo pants
white sneakers
```

Possible data sources:

* affiliate APIs
* brand APIs
* scraping

---

# 9. Landing Page Sections

### Hero

```
Create your AI outfit
Try clothes before buying
```

CTA

```
Generate Your Outfit
```

---

### Example Gallery

Show:

AI outfit examples.

---

### Features

* AI outfit generation
* personalized avatar
* shopping integration

---

### Pricing

Free vs Pro

---

# 10. Subscription Model

Free

```
10 generations / month
no shopping recommendations
```

Pro

```
unlimited generations
product suggestions
priority generation
```

Payments:

* Stripe

---

# 11. Security

Use:

* Supabase Auth
* JWT tokens
* row-level security

---

# 12. API Endpoints

Auth handled by Supabase.

Backend endpoints:

```
POST /generate
GET /history
POST /like
GET /products
POST /cart/add
POST /order/create
GET /orders
```

---

# 13. Cursor Development Workflow

Cursor usage suggestion:

Create these docs:

```
/docs
    architecture.md
    database.md
    prompts.md
    api.md
```

Cursor AI will then understand project context.

---

# 14. MVP Development Roadmap

### Phase 1

Landing page

---

### Phase 2

Auth system

---

### Phase 3

Avatar creation

---

### Phase 4

Image generator

---

### Phase 5

Generation history

---

### Phase 6

Product recommendations

---

### Phase 7

Cart & checkout

---

### Phase 8

Subscription system

---

# 15. Future Improvements

* AI stylist
* wardrobe memory
* outfit ranking
* social sharing
* influencer outfits
* brand partnerships

---

# 16. Success Metrics

Important KPIs:

* generation count
* like rate
* product click rate
* purchase rate

---

# END OF DOCUMENTATION

---
