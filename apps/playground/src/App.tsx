import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Display,
  Heading,
  Spinner,
  Text,
} from '@dsai-io/react';

import type { JSX } from 'react';

/**
 * Playground welcome page showcasing DSAi components.
 */
export function App(): JSX.Element {
  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <Badge variant="primary" className="mb-3">
          DSAi Playground
        </Badge>
        <Display size={4}>Welcome to DSAi</Display>
        <Text variant="lead" color="muted">
          A design system built with React, Bootstrap 5, and WCAG 2.2 AA accessibility.
        </Text>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>Getting Started:</strong> Edit <code>src/App.tsx</code> to explore DSAi components.
      </Alert>

      <div className="row g-4">
        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle>Buttons</CardTitle>
              <CardText>Interactive button components with multiple variants.</CardText>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline-primary">Outline</Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle>Badges</CardTitle>
              <CardText>Labels and status indicators for your UI.</CardText>
              <div className="d-flex gap-2 flex-wrap">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-md-4">
          <Card>
            <CardBody>
              <CardTitle>Loading States</CardTitle>
              <CardText>Spinner components for async operations.</CardText>
              <div className="d-flex gap-3 align-items-center">
                <Spinner size="sm" />
                <Spinner />
                <Spinner variant="secondary" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-12">
          <Card>
            <CardBody>
              <CardTitle>Typography</CardTitle>
              <CardText>Semantic typography components with design tokens.</CardText>
              <div className="mt-3">
                <Heading level={1}>Heading 1</Heading>
                <Heading level={2}>Heading 2</Heading>
                <Heading level={3}>Heading 3</Heading>
                <Text>Regular body text with proper line height for readability.</Text>
                <Text variant="small" color="muted">
                  Small muted text for secondary information.
                </Text>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <div className="text-center mt-5">
        <Text variant="small" color="muted">
          Built with <code>@dsai-io/react</code> and <code>@dsai-io/tools</code>
        </Text>
      </div>
    </main>
  );
}

export default App;
