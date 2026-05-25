# Salary Management Platform - Frontend

Modern, minimalist React application built with Vite, TypeScript, and TailwindCSS.

## Features

- 🎨 **Modern UI**: Built with shadcn/ui components
- 🎭 **Storybook**: Component documentation and development
- 📊 **Data Visualization**: Interactive charts with Recharts
- 🔐 **Authentication**: JWT-based auth with refresh tokens
- 📱 **Responsive**: Mobile-first design
- 🌙 **Dark Mode**: Full dark mode support
- ♿ **Accessible**: WCAG compliant components

## Getting Started

### Development

```bash
# Start dev server
pnpm dev

# Start Storybook
pnpm storybook
```

### Building

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── layouts/         # Layout components
│   ├── employees/       # Employee-specific components
│   └── auth/            # Authentication components
├── pages/               # Page components
├── services/            # API services
├── hooks/               # Custom React hooks
├── store/               # State management (Zustand)
├── lib/                 # Utilities and helpers
└── App.tsx              # Main app component
```

## Storybook

View and develop components in isolation:

```bash
pnpm storybook
```

Access Storybook at: http://localhost:6006

### Available Stories

- **UI Components**
  - Button (all variants and sizes)
  - Card (with different layouts)
  - Input (with icons and validation)
  - Label (with forms)
  - Select, Dialog, Toast, etc.

## Component Library

All UI components are built with:
- **Radix UI**: Accessible primitives
- **TailwindCSS**: Utility-first styling
- **CVA**: Class variance authority for variants
- **Framer Motion**: Smooth animations

### Using Components

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## State Management

- **TanStack Query**: Server state and caching
- **Zustand**: Client state (auth, UI state)

## API Integration

All API calls go through the centralized API client:

```tsx
import { apiClient } from '@/lib/api-client';

// Automatically handles:
// - JWT token injection
// - Token refresh
// - Error handling
const data = await apiClient.get('/employees');
```

## Styling

- **TailwindCSS**: Utility-first CSS
- **CSS Variables**: Theme customization
- **Dark Mode**: Class-based dark mode

### Theme Customization

Edit `src/index.css` to customize colors:

```css
:root {
  --primary: 240 5.9% 10%;
  --secondary: 240 4.8% 95.9%;
  /* ... */
}
```

## Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Query Caching**: TanStack Query caches API responses
- **Memoization**: React.memo, useMemo, useCallback

## Accessibility

All components follow WCAG 2.1 AA standards:
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm storybook    # Start Storybook
pnpm build-storybook  # Build Storybook
pnpm lint         # Lint code
pnpm typecheck    # Type check
```

## Contributing

1. Create a new branch
2. Make your changes
3. Add tests if needed
4. Update Storybook stories
5. Submit a pull request

## License

MIT
