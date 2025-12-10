/**
 * Jest-Axe Accessibility Tests for A11y Utilities
 *
 * Automated WCAG compliance testing using jest-axe.
 * Tests ARIA attributes, focus management, and screen reader compatibility.
 */

import { axe, toHaveNoViolations } from 'jest-axe';

import { announceToScreenReader } from '../a11y/announceToScreenReader';
import { buildAriaLabel } from '../a11y/buildAriaLabel';
import { combineAriaDescriptions } from '../a11y/combineAriaDescriptions';
import { createRovingTabindex } from '../a11y/createRovingTabindex';
import { generateId } from '../a11y/generateId';
import { getArrowKeyHandler } from '../a11y/getArrowKeyHandler';

expect.extend(toHaveNoViolations);

describe('Jest-Axe A11y Tests: Screen Reader Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('announceToScreenReader', () => {
    it('should create accessible live region with no violations', async () => {
      const cleanup = announceToScreenReader('Important notification');

      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion).toBeTruthy();

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should create assertive live region with no violations', async () => {
      const cleanup = announceToScreenReader('Critical alert', { assertive: true });

      const liveRegion = document.querySelector('[aria-live="assertive"]');
      expect(liveRegion).toBeTruthy();

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should create polite live region by default with no violations', async () => {
      const cleanup = announceToScreenReader('Status update');

      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should handle multiple announcements with no violations', async () => {
      const cleanup1 = announceToScreenReader('First message');
      const cleanup2 = announceToScreenReader('Second message');

      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThanOrEqual(1);

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();

      cleanup1();
      cleanup2();
    });

    it('should create live region with proper ARIA attributes', async () => {
      const cleanup = announceToScreenReader('Test message');

      const liveRegion = document.querySelector('[aria-live]');
      expect(liveRegion).toBeTruthy();

      // Verify ARIA attributes
      expect(liveRegion?.getAttribute('aria-live')).toBeTruthy();
      expect(liveRegion?.getAttribute('role')).toBe('status');
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');

      const results = await axe(document.body);
      expect(results).toHaveNoViolations();

      cleanup();
    });
  });

  describe('buildAriaLabel', () => {
    it('should build accessible label element with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const button = document.createElement('button');
      const ariaProps = buildAriaLabel({
        label: 'Submit form',
        labelledBy: 'submit-label',
        describedBy: 'submit-help',
      });

      Object.entries(ariaProps).forEach(([key, value]) => {
        button.setAttribute(key, String(value));
      });
      container.appendChild(button);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should create button with aria-label and no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const button = document.createElement('button');
      const ariaProps = buildAriaLabel({ label: 'Close dialog' });

      Object.entries(ariaProps).forEach(([key, value]) => {
        button.setAttribute(key, String(value));
      });
      button.textContent = 'X';
      container.appendChild(button);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should create input with labelledBy and no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create label
      const label = document.createElement('label');
      label.id = 'email-label';
      label.textContent = 'Email Address';
      container.appendChild(label);

      // Create input with aria-labelledby
      const input = document.createElement('input');
      input.type = 'email';
      const ariaProps = buildAriaLabel({ labelledBy: 'email-label' });

      Object.entries(ariaProps).forEach(([key, value]) => {
        input.setAttribute(key, String(value));
      });
      container.appendChild(input);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should create input with describedBy and no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create label
      const label = document.createElement('label');
      label.textContent = 'Password';
      const input = document.createElement('input');
      input.type = 'password';
      label.appendChild(input);
      container.appendChild(label);

      // Create description
      const desc = document.createElement('div');
      desc.id = 'password-help';
      desc.textContent = 'Must be at least 8 characters';
      container.appendChild(desc);

      // Add aria-describedby
      const ariaProps = buildAriaLabel({ describedBy: 'password-help' });
      Object.entries(ariaProps).forEach(([key, value]) => {
        input.setAttribute(key, String(value));
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle multiple describedBy IDs with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create label
      const label = document.createElement('label');
      label.textContent = 'Username';
      const input = document.createElement('input');
      input.type = 'text';
      label.appendChild(input);
      container.appendChild(label);

      // Create descriptions
      const help = document.createElement('div');
      help.id = 'username-help';
      help.textContent = 'Choose a unique username';
      container.appendChild(help);

      const error = document.createElement('div');
      error.id = 'username-error';
      error.textContent = 'Username is taken';
      container.appendChild(error);

      // Add aria-describedby with multiple IDs
      const ariaProps = buildAriaLabel({
        describedBy: ['username-help', 'username-error'],
      });
      Object.entries(ariaProps).forEach(([key, value]) => {
        input.setAttribute(key, String(value));
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('combineAriaDescriptions', () => {
    it('should combine descriptions with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const desc1 = document.createElement('div');
      desc1.id = 'desc-1';
      desc1.textContent = 'First description';
      container.appendChild(desc1);

      const desc2 = document.createElement('div');
      desc2.id = 'desc-2';
      desc2.textContent = 'Second description';
      container.appendChild(desc2);

      const input = document.createElement('input');
      const combined = combineAriaDescriptions(['desc-1', 'desc-2']);
      input.setAttribute('aria-describedby', combined);
      container.appendChild(input);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should handle empty descriptions array with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const input = document.createElement('input');
      const combined = combineAriaDescriptions([]);
      if (combined) {
        input.setAttribute('aria-describedby', combined);
      }
      container.appendChild(input);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should deduplicate IDs with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const desc = document.createElement('div');
      desc.id = 'shared-desc';
      desc.textContent = 'Shared description';
      container.appendChild(desc);

      const input = document.createElement('input');
      const combined = combineAriaDescriptions(['shared-desc', 'shared-desc']);
      input.setAttribute('aria-describedby', combined);
      container.appendChild(input);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('generateId', () => {
    it('should generate valid IDs for ARIA relationships', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const id1 = generateId('label');
      const id2 = generateId('description');

      // Create elements with generated IDs
      const label = document.createElement('label');
      label.id = id1;
      label.textContent = 'Email';
      container.appendChild(label);

      const desc = document.createElement('div');
      desc.id = id2;
      desc.textContent = 'Enter your email address';
      container.appendChild(desc);

      const input = document.createElement('input');
      input.setAttribute('aria-labelledby', id1);
      input.setAttribute('aria-describedby', id2);
      container.appendChild(input);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should generate unique IDs with no violations', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const id1 = generateId('item');
      const id2 = generateId('item');

      expect(id1).not.toBe(id2);

      // Create elements with unique IDs
      const item1 = document.createElement('div');
      item1.id = id1;
      item1.textContent = 'Item 1';
      container.appendChild(item1);

      const item2 = document.createElement('div');
      item2.id = id2;
      item2.textContent = 'Item 2';
      container.appendChild(item2);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe('Jest-Axe A11y Tests: Focus Management', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('createRovingTabindex', () => {
    it('should create roving tabindex with no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'toolbar');
      document.body.appendChild(container);

      const items = Array.from({ length: 3 }, (_, i) => {
        const button = document.createElement('button');
        button.textContent = `Button ${i + 1}`;
        container.appendChild(button);
        return button;
      });

      const cleanup = createRovingTabindex(items);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should create menu with roving tabindex and no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'menu');
      document.body.appendChild(container);

      const menuItems = Array.from({ length: 4 }, (_, i) => {
        const item = document.createElement('div');
        item.setAttribute('role', 'menuitem');
        item.textContent = `Menu Item ${i + 1}`;
        container.appendChild(item);
        return item;
      });

      const cleanup = createRovingTabindex(menuItems);

      // First item should be tabbable
      expect(menuItems[0].getAttribute('tabindex')).toBe('0');

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should handle list navigation with no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'list');
      document.body.appendChild(container);

      const listItems = Array.from({ length: 5 }, (_, i) => {
        const item = document.createElement('div');
        item.setAttribute('role', 'listitem');
        item.textContent = `List Item ${i + 1}`;
        container.appendChild(item);
        return item;
      });

      const cleanup = createRovingTabindex(listItems);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      cleanup();
    });

    it('should create tablist with roving tabindex and no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'tablist');
      document.body.appendChild(container);

      const tabs = Array.from({ length: 3 }, (_, i) => {
        const tab = document.createElement('button');
        tab.setAttribute('role', 'tab');
        tab.textContent = `Tab ${i + 1}`;
        tab.setAttribute('aria-controls', `panel-${i + 1}`);
        container.appendChild(tab);
        return tab;
      });

      const cleanup = createRovingTabindex(tabs);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      cleanup();
    });
  });

  describe('getArrowKeyHandler', () => {
    it('should create keyboard navigation with no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'menu');
      document.body.appendChild(container);

      const items = Array.from({ length: 3 }, (_, i) => {
        const item = document.createElement('div');
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', i === 0 ? '0' : '-1');
        item.textContent = `Option ${i + 1}`;
        container.appendChild(item);
        return item;
      });

      const handler = getArrowKeyHandler({
        items,
        orientation: 'vertical',
        loop: true,
      });

      container.addEventListener('keydown', handler);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      container.removeEventListener('keydown', handler);
    });

    it('should handle horizontal navigation with no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'toolbar');
      document.body.appendChild(container);

      const buttons = Array.from({ length: 4 }, (_, i) => {
        const button = document.createElement('button');
        button.textContent = `Tool ${i + 1}`;
        button.setAttribute('tabindex', i === 0 ? '0' : '-1');
        container.appendChild(button);
        return button;
      });

      const handler = getArrowKeyHandler({
        items: buttons,
        orientation: 'horizontal',
        loop: false,
      });

      container.addEventListener('keydown', handler);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      container.removeEventListener('keydown', handler);
    });

    it('should create grid navigation with no violations', async () => {
      const container = document.createElement('div');
      container.setAttribute('role', 'grid');
      document.body.appendChild(container);

      // Create 3x3 grid
      const cells: HTMLElement[] = [];
      for (let row = 0; row < 3; row++) {
        const rowElement = document.createElement('div');
        rowElement.setAttribute('role', 'row');
        container.appendChild(rowElement);

        for (let col = 0; col < 3; col++) {
          const cell = document.createElement('div');
          cell.setAttribute('role', 'gridcell');
          cell.setAttribute('tabindex', row === 0 && col === 0 ? '0' : '-1');
          cell.textContent = `Cell ${row + 1},${col + 1}`;
          rowElement.appendChild(cell);
          cells.push(cell);
        }
      }

      const handler = getArrowKeyHandler({
        items: cells,
        orientation: 'both',
        loop: true,
      });

      container.addEventListener('keydown', handler);

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      container.removeEventListener('keydown', handler);
    });
  });
});

describe('Jest-Axe A11y Tests: Complex ARIA Patterns', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should create combobox with no violations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const comboboxId = generateId('combobox');
    const listboxId = generateId('listbox');

    // Create combobox
    const combobox = document.createElement('input');
    combobox.id = comboboxId;
    combobox.setAttribute('role', 'combobox');
    combobox.setAttribute('aria-expanded', 'false');
    combobox.setAttribute('aria-controls', listboxId);
    combobox.setAttribute('aria-autocomplete', 'list');
    container.appendChild(combobox);

    // Create listbox
    const listbox = document.createElement('ul');
    listbox.id = listboxId;
    listbox.setAttribute('role', 'listbox');
    container.appendChild(listbox);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should create dialog with no violations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const dialogId = generateId('dialog');
    const labelId = generateId('dialog-label');
    const descId = generateId('dialog-desc');

    // Create dialog
    const dialog = document.createElement('div');
    dialog.id = dialogId;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', labelId);
    dialog.setAttribute('aria-describedby', descId);
    dialog.setAttribute('aria-modal', 'true');

    // Add label
    const label = document.createElement('h2');
    label.id = labelId;
    label.textContent = 'Confirm Action';
    dialog.appendChild(label);

    // Add description
    const desc = document.createElement('p');
    desc.id = descId;
    desc.textContent = 'Are you sure you want to continue?';
    dialog.appendChild(desc);

    // Add buttons
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    dialog.appendChild(confirmBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    dialog.appendChild(cancelBtn);

    container.appendChild(dialog);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should create accordion with no violations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Create accordion with 3 items
    for (let i = 0; i < 3; i++) {
      const headerId = generateId(`accordion-header-${i}`);
      const panelId = generateId(`accordion-panel-${i}`);

      // Create header button
      const header = document.createElement('button');
      header.id = headerId;
      header.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
      header.setAttribute('aria-controls', panelId);
      header.textContent = `Section ${i + 1}`;
      container.appendChild(header);

      // Create panel
      const panel = document.createElement('div');
      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', headerId);
      panel.textContent = `Content for section ${i + 1}`;
      if (i !== 0) {
        panel.style.display = 'none';
      }
      container.appendChild(panel);
    }

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should create breadcrumb navigation with no violations', async () => {
    const container = document.createElement('nav');
    container.setAttribute('aria-label', 'Breadcrumb');
    document.body.appendChild(container);

    const list = document.createElement('ol');
    container.appendChild(list);

    const items = ['Home', 'Products', 'Electronics', 'Laptops'];
    items.forEach((item, index) => {
      const li = document.createElement('li');
      if (index < items.length - 1) {
        const link = document.createElement('a');
        link.href = `/${item.toLowerCase()}`;
        link.textContent = item;
        li.appendChild(link);
      } else {
        li.setAttribute('aria-current', 'page');
        li.textContent = item;
      }
      list.appendChild(li);
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should create progress indicator with no violations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const progressId = generateId('progress');
    const labelId = generateId('progress-label');

    const label = document.createElement('div');
    label.id = labelId;
    label.textContent = 'Upload progress';
    container.appendChild(label);

    const progress = document.createElement('div');
    progress.id = progressId;
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-labelledby', labelId);
    progress.setAttribute('aria-valuenow', '50');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.textContent = '50% complete';
    container.appendChild(progress);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
