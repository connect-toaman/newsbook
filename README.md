# Pradeshik News Bihar

![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

Welcome to the **Pradeshik News Bihar** official platform. This application serves as a modern, responsive, and elegant news-sharing portal allowing local communities and citizen journalists to seamlessly share stories and updates.

**CEO:** Manindra Kumar Singh

## Features
- 🚀 **Next.js App Router**: Lightning-fast server rendering and SEO optimization.
- 💅 **Tailwind CSS**: Clean, elegant, and fully responsive UI.
- 💾 **Prisma ORM**: Robust and type-safe database interactions.
- 🔖 **Bookmark & Save**: Instantly save your favorite posts locally.
- ❤️ **Optimistic Likes**: Instant user feedback for interactions.
- 📲 **Native Share API**: Effortless article sharing on mobile and desktop.

## Local Development Setup

Follow these instructions to run the project locally.

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Ensure the `.env` file is present in the root directory (you can copy `.env.example`). For local development, we use SQLite.
```env
DATABASE_URL="file:./dev.db"
```

### 3. Initialize the Database
Generate the Prisma client and push the schema to create the local SQLite database:
```bash
npx prisma generate
npx prisma db push
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to explore the platform.

---

## 🚀 1-Click Deployment to Vercel

Deploying Pradeshik News Bihar is incredibly straightforward using Vercel. 

### Prerequisites for Production:
For production, you'll want to switch from SQLite to a scalable database like **Vercel Postgres** or **Neon**.
1. Update `prisma/schema.prisma` to use Postgres:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Commit your code to a GitHub repository.

### Deployment Steps:
1. Log in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
2. Import your GitHub repository.
3. In the project settings, navigate to **Storage** and add a **Postgres** database to automatically populate the `DATABASE_URL` environment variable.
4. Set the **Build Command** (Vercel automatically detects Next.js):
   - By default, Vercel runs `npm run build`. 
   - Add a custom install step if needed in `package.json`: `"postinstall": "prisma generate"`.
5. Click **Deploy**! Vercel will build the application, apply the Prisma schema (you can run `npx prisma db push` against production from your local machine, or add it to the build step), and serve your site globally on an edge network.

## License
© 2026 Pradeshik News Bihar. All rights reserved.
