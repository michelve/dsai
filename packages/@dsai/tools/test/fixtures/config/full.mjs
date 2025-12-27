/**
 * Full configuration fixture with all options
 */
export default {
  global: {
    debug: true,
    logLevel: 'info',
  },
  tokens: {
    source: 'theme',
    sourceDir: './figma-exports',
    collectionsDir: './collections',
    outputDir: './dist/tokens',
    prefix: '--custom-',
    baseFontSize: 16,
    formats: ['css', 'scss', 'js', 'ts', 'json'],
    outputReferences: true,
    separateThemeFiles: true,
    watch: false,
    themes: {
      autoDetect: true,
      default: 'light',
      ignoreModes: ['internal'],
    },
  },
  icons: {
    sourceDir: './icons',
    outputDir: './dist/icons',
    framework: 'react',
    typescript: true,
    optimize: true,
    prefix: 'Icon',
  },
};
