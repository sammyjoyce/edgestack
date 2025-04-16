# Project Guidelines

## Build/Configuration Instructions

This project uses Bun as the JavaScript runtime and package manager. Here's how to set up and build the project:

### Installation

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

### Building for Production

Create a production build:

```bash
bun run build
```

## Testing Information

This project uses Bun's built-in test runner for testing. The test configuration is defined in the `package.json` file.

### Running Tests

To run all tests:

```bash
bun run test
```

To run tests in watch mode:

```bash
bun run test:watch
```

### Test Configuration

The test configuration is defined in the `package.json` file under the `test` key:

```json
"test": {
  "preload": ["./bun.setup.ts"],
  "jsx": true,
  "dom": {
    "provider": "happy-dom"
  }
}
```

- `preload`: Files to preload before running tests
- `jsx`: Enable JSX support
- `dom`: Configure DOM environment for testing

### Writing Tests

Tests are written using Bun's test API, which is compatible with Jest. Here's an example of a simple test:

```typescript
import { describe, it, expect } from 'bun:test';

describe('Simple Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

For React component testing, we use `@testing-library/react`. Here's an example:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'bun:test';
import { Button } from '../../../components/ui/Button';
import { MemoryRouter } from 'react-router';

describe('Button Component', () => {
  it('renders as a button when no "to" prop is provided', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-neutral-950');
  });
});
```

### Test Directory Structure

Tests are located in the `app/__tests__` directory, mirroring the structure of the `app` directory. For example, tests for components in `app/components/ui` are located in `app/__tests__/components/ui`.

## Additional Development Information

### Code Style

This project uses Biome for code formatting and linting. The configuration is defined in the `biome.jsonc` file.

To format code:

```bash
bun run format
```

### Type Checking

To run type checking:

```bash
bun run typecheck
```

### Deployment

Deployment is done using the Wrangler CLI.

To deploy directly to production:

```sh
bun wrangler deploy
```

To deploy a preview URL:

```sh
bun wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively:

```sh
bun wrangler versions deploy
```