/**
 * Invalid configuration fixture for testing error handling
 */
export default {
  tokens: {
    // Invalid: sourceDir must be a string
    sourceDir: 12345,
    // Invalid: formats must be an array
    formats: 'not-an-array',
  },
  icons: {
    // Invalid: framework must be 'react' | 'vue' | 'svelte' | 'angular'
    framework: 'invalid-framework',
  },
};
