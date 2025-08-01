# Project FORA code - FRONT END ONLY NO BACKEND 
#### Used cursor, chatgpt, gemini and claude to edit code generated for me by lovable ai
#### This is the modified code and the original lovable code is in my repository [reclaim-time-nexus]


### A modern time management application built with React, TypeScript, and Vite. This app helps users organize tasks, manage calendars, collaborate with friends, and find mutual free time for group activities. LINK TO YOUTUBE VIDEO: https://youtu.be/WpNumDji29A




## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn** or **bun**

### Installing Node.js

#### Option 1: Using nvm (Recommended)
```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc

# Install Node.js
nvm install 18
nvm use 18
```

#### Option 2: Direct Installation
- Visit [nodejs.org](https://nodejs.org/)
- Download and install the LTS version

#### Option 3: Using Homebrew (macOS)
```bash
brew install node
```

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/reclaim-time-nexus.git

# Navigate to the project directory
cd reclaim-time-nexus
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install

# OR using bun (faster)
bun install
```

### Step 3: Start the Development Server

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev

# OR using bun
bun dev
```

The application will start on `http://localhost:8080` (or another port if 8080 is busy).

### Step 4: Open in Browser

Open your web browser and navigate to:
```
http://localhost:8080
```

##  Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linting
npm run lint
```

##  Project Structure

```
reclaim-time-nexus/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── Layout.tsx      # Main layout component
│   │   ├── TaskCard.tsx    # Task display component
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Dashboard/home page
│   │   ├── TasksPage.tsx   # Task management page
│   │   ├── CalendarPage.tsx # Calendar view
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and Python backend
│   ├── types/              # TypeScript type definitions
│   └── styles/             # CSS styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```




##  Deployment

### Option 1: Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

### Option 2: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in your project directory

### Option 3: GitHub Pages

1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/reclaim-time-nexus",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

##  Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

**Dependencies not installing**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

