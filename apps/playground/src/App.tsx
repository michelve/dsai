import { Button } from '@dsai/react';

import type { JSX } from 'react';


const highlights = [
  'Vite 7 + SWC dev server with warmup for @dsai packages',
  'Shared security defaults (allowed hosts, CORS, fs deny)',
  'Design tokens loaded via CSS variables',
];

/**
 * Playground landing view showcasing DSAi components and token styling.
 */
export function App(): JSX.Element {
  return (
    <main className="app">
      <section className="app-card">
        <div className="app-header">
          <div>
            <span className="eyebrow">DSAi Playground</span>
            <h1 className="title">Preview components with the shared Vite config</h1>
            <p className="lead">
              React 19 + SWC with hardened dev-server defaults and optimized dependency caching.
              Edit a component and watch HMR respond instantly.
            </p>
          </div>
          <div className="cta">
            <Button variant="primary" type="button">
              Open Storybook
            </Button>
            <Button variant="secondary" type="button">
              View tokens
            </Button>
          </div>
        </div>

        <div className="pill-row">
          <span className="pill">Shared aliases</span>
          <span className="pill">Warmup: @dsai/react + @dsai/tokens</span>
          <span className="pill">License reporting enabled</span>
        </div>

        <ul className="highlights">
          {highlights.map((item) => (
            <li key={item} className="highlight">
              <span className="dot" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
