# Contributing to CapitalMasters

Thank you for your interest in contributing to the CapitalMasters web application!

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Start development server: `npm run dev`

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules: `npm run lint`
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

## Component Structure

```tsx
// Component imports
import { useState } from 'react';

// Type definitions
interface Props {
  title: string;
}

// Component
export default function Component({ title }: Props) {
  // Hooks
  const [state, setState] = useState();

  // Functions
  const handleClick = () => {
    // ...
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Commit Guidelines

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

Example:
```bash
git commit -m "feat: add portfolio allocation chart"
git commit -m "fix: correct contact form validation"
```

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit PR with clear description

## Testing

Before submitting:
- [ ] Build succeeds: `npm run build`
- [ ] No lint errors: `npm run lint`
- [ ] All features work as expected
- [ ] Responsive on mobile and desktop
- [ ] Accessible (keyboard navigation, screen readers)

## Questions?

Contact the development team at tech@capitalmasters.com
