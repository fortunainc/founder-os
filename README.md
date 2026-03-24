# FounderOS - Founder Operating System

A high-performance founder execution system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 📦 Deployment

### Vercel (Recommended)
[See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions](../VERCEL_DEPLOYMENT_GUIDE.md)

**Quick Deploy:**
1. Push code to GitHub
2. Import repository in Vercel
3. Click Deploy

### Static Export
```bash
npm run build
# Output is in /out directory
```

## 🏗️ Tech Stack

- **Framework**: Next.js 16.1.7 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Database**: Supabase
- **AI**: OpenAI Integration

## 📄 Pages

- `/dashboard` - Main dashboard with metrics and quick actions
- `/today` - Daily tasks and priorities
- `/content` - Content management hub
- `/content/calendar` - Content calendar
- `/content/drafts` - Draft content management
- `/content/ideas` - Idea generation and tracking
- `/content/performance` - Content analytics
- `/revenue` - Revenue tracking and metrics
- `/engagement` - Engagement analytics
- `/insights` - AI-powered insights
- `/voice` - Voice interface
- `/prompts` - Prompts library
- `/settings` - Application settings

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Next.js Configuration
The project is configured for Vercel deployment with full Next.js features enabled.

## 📝 Project Structure

```
founder-os/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── content/           # Content management
│   ├── revenue/           # Revenue tracking
│   └── ...
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ...
├── lib/                  # Utilities and helpers
├── store/                # Zustand state management
└── public/               # Static assets
```

## 🎨 Features

- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Responsive design
- ✅ Dark mode support
- ✅ AI-powered insights
- ✅ Content management
- ✅ Revenue tracking
- ✅ Voice interface
- ✅ Quick capture functionality

## 🚦 Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 📊 Status

- ✅ All TypeScript errors resolved
- ✅ Build successful
- ✅ All 17 pages generated
- ✅ Ready for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Support

For issues and questions, please open an issue in the repository.