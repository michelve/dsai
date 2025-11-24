import { addons } from 'storybook/manager-api';
import { lightTheme } from './DSAiTheme';

/**
 * Storybook Manager Configuration
 *
 * Controls the Storybook UI (sidebar, toolbar, panels).
 * Uses DSAi theme for consistent branding.
 */
addons.setConfig({
  // Apply DSAi theme to manager UI
  theme: lightTheme,

  // Sidebar configuration
  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
  },

  // Toolbar configuration - show only relevant controls
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: true }, // Hide "Open canvas in new tab"
    copy: { hidden: true }, // Hide "Copy canvas link"
    fullscreen: { hidden: false },
  },

  // Panel configuration
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  selectedPanel: undefined, // Let Storybook choose default
});
