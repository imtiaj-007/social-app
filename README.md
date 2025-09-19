<div align="center">
  <br />
    <h1>Social App - Social Media Platform</h1>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextjs" />
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Supabase-black?style=for-the-badge&logoColor=white&logo=supabase&color=3ECF8E" alt="supabase" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="prisma" />    
  </div>

  <h3 align="center">A modern, responsive social media platform built with Next.js 15, React 19, TypeScript, Prisma and Supabase. Features interactive engagement, comprehensive testing, and enterprise-grade CI/CD pipeline.</h3>

  <br />
  <a href="https://social-app-imtiaj.vercel.app/" target="_blank" style="display: inline-block; background-color: #646CFF; color: white; padding: 8px 16px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 16px; transition: background-color 0.2s ease;">
    🚀 Live Demo - Visit Website
  </a>
  <br />
</div>

## Features

### Core Application

- 👥 **User Management** - Comprehensive user profiles with search, filtering, and pagination
- 🤝 **Social Interactions** - Follow/unfollow functionality with real-time updates
- 📱 **Responsive Design** - Mobile-first approach with seamless cross-device experience
- 🔐 **Authentication** - Secure user registration and profile management
- 🔍 **Advanced Search** - Real-time user search with query parameters and pagination

### Technical Stack

- ⚡ **Next.js 15** - Full-stack React framework with App Router and server components
- ⚛️ **React 19** - Latest React with hooks, concurrent features, and optimized rendering
- 🔷 **TypeScript 5.8** - Strict type safety with modern ECMAScript features
- 🎨 **Tailwind CSS** - Utility-first CSS framework with responsive design system
- 🗄️ **Prisma** - Type-safe database ORM with PostgreSQL integration
- 🔌 **API Integration** - RESTful API client with error handling and type safety

### Development & Quality

- 🧪 **Vitest 3.2.4** - Fast unit testing with V8 coverage
- 🎭 **React Testing Library** - Component testing with user-centric approach
- 🔍 **ESLint + Prettier** - Code quality and formatting
- ⚓ **Husky + lint-staged** - Pre-commit hooks for quality gates
- 📝 **Commitlint** - Conventional commit message enforcement
- 🚀 **CI/CD Pipeline** - Automated testing, linting, and deployment

## Prerequisites

- **Node.js 18+** (Recommended: Node.js 22)
- **Package Manager**: `npm` | `yarn` | `bun` | `pnpm`
- **Git**

## Installation

### 1. Clone and Install

```bash
git clone https://github.com/imtiaj-007/social-app
cd social-app

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Migrate DB to the latest version
npx prisma migrate dev
```

### 2. Environment Configuration

Create environment files for each mode:

```bash
# Development
cp .env.example .env

# Production
cp .env.example .env.production
```

**Required environment variables:**

```bash
# .env
# Connect to Supabase via connection pooling
DATABASE_URL=postgres_pooled_url

# Direct connection to the database. Used for migrations
DIRECT_URL=postgres_direct_url

NEXT_PUBLIC_SITE_URL="http://localhost:3000/"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

NEXT_PUBLIC_SUPABASE_URL=supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=supabase_api_key
```

### 3. Development Server

```bash
npm run dev
```

- 🌐 Runs on `http://localhost:3000` (or configured PORT)
- 🔍 Auto-opens browser
- 🔗 API proxy: `/api/*` → `BACKEND_URL`
- ⚡ Hot Module Replacement (HMR)

## 📜 Available Scripts

### Development

```bash
npm run dev              # Start development server
npm run start            # Preview production build
```

### Building

```bash
npm run build            # Build for production
npm run type-check       # TypeScript type checking
```

### Testing

```bash
npm run test             # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:run         # Run tests once (CI mode)
```

### Code Quality

```bash
npm run lint:eslint      # Run ESLint (zero warnings)
npm run format:check     # Check Prettier formatting
npm run format:fix       # Fix Prettier formatting
npm run audit            # Security audit
```

## 🏗️ Project Structure

```bash
social-app/
├── .github/                # GitHub Actions CI/CD
│ └── workflows/
│ └── ci.yaml               # Automated testing & deployment
├── .husky/                 # Git hooks
│ ├── commit-msg            # Commit message linting
│ └── pre-commit            # Pre-commit quality checks
├── public/                 # Static assets
├── src/                    # Source code
│ ├── components/           # React components
│ │ ├── forms/              # Form components
│ │ ├── ui/                 # Reusable UI primitives
│ ├── layout/               # Layout components
│ │ ├── Header.tsx          # Top navigation
│ │ ├── Navbar.tsx          # Side navigation
│ │ └── Footer.tsx          # Footer
│ ├── lib/                  # Utilities & helpers
│ ├── types/                # TypeScript definitions
│ ├── constants/            # Application constants
│ ├── hooks/                # Custom React hooks
│ ├── app/                  # Main Application Pages (App Router)
│ └── setupTests.ts         # Test configuration
├── .env                    # Development environment
├── .env.production         # Production environment
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── commitlint.config.ts    # Commit message rules
├── eslint.config.js        # ESLint flat config
├── lint-staged.config.js   # Lint-staged configuration
├── package.json            # Dependencies & scripts
├── vitest.config.ts        # Vitest testing configuration
├── README.md               # Project documentation
├── TESTING.md              # Testing guide
└── LICENSE                 # MIT License
```

### Key Configuration Files

| File                        | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `.github/workflows/ci.yaml` | CI/CD pipeline with testing, linting, and deployment          |
| `.husky/`                   | Git hooks for commit message validation and pre-commit checks |
| `vite.config.ts`            | Vite configuration with environment validation and test setup |
| `tsconfig.*.json`           | TypeScript configuration for different environments           |
| `eslint.config.js`          | ESLint rules with React and TypeScript support                |
| `commitlint.config.ts`      | Conventional commit message enforcement                       |
| `lint-staged.config.js`     | Pre-commit linting configuration                              |
| `components.json`           | UI components configuration (shadcn/ui)                       |

## 🧪 Testing | ![Coverage](https://img.shields.io/badge/coverage-82%25-green)

### Test Stack

- **Vitest 3.2.4** - Fast test runner with V8 coverage
- **React Testing Library 16.3.0** - Component testing
- **JSDOM** - DOM simulation for tests

### Coverage Requirements

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Running Tests

```bash
# Watch mode (development)
npm run test

# Coverage report
npm run test:coverage

# Specific test file
npm run test src/lib/utils.test.tsx
```

### Test Structure

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />)
        expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })
})
```

For detailed testing information, see [TESTING.md](./TESTING.md).

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline (`.github/workflows/ci.yaml`):

```yaml
# Automated checks on every push/PR:
- Security audit (moderate level)
- TypeScript type checking
- ESLint with zero warnings
- Prettier formatting validation
- Test coverage with 80% thresholds
- Production build verification
```

### Quality Gates

- **Pre-commit hooks** (Husky + lint-staged)
- **Conventional commits** (Commitlint)
- **Zero ESLint warnings**
- **80% test coverage** across all metrics
- **Security audit** (moderate level)

## 📚 Documentation

- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [Component Documentation](./src/components/) - Component usage and examples
- [API Documentation](./docs/api.md) - Backend API integration

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following the coding standards
4. **Run tests** (`npm run test:coverage`)
5. **Commit changes** using conventional commits
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow conventional commit messages
- Maintain 80% test coverage
- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Write meaningful tests for new features

## 📄 License | ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **React Team** - For the amazing React 19
- **Next Js Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Supabase** - For the powerful DB, auth and realtime features
- **ShadCN UI** - For accessible UI primitives
