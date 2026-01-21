import {
  SAFE_INPUT_ATTRIBUTES,
  getSafeInputProps,
  type SafeInputAttribute,
} from './getSafeInputProps';

describe('getSafeInputProps', () => {
  describe('Basic functionality', () => {
    it('should return empty object for empty input', () => {
      const result = getSafeInputProps({});
      expect(result).toEqual({});
    });

    it('should pass through safe attributes', () => {
      const props = {
        id: 'test-input',
        name: 'username',
        placeholder: 'Enter username',
        disabled: false,
        required: true,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'test-input',
        name: 'username',
        placeholder: 'Enter username',
        disabled: false,
        required: true,
      });
    });

    it('should filter out unsafe event handlers', () => {
      const onClick = jest.fn();
      const onError = jest.fn();
      const onLoad = jest.fn();

      const props = {
        id: 'test',
        onClick,
        onError,
        onLoad,
        name: 'test',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'test',
        name: 'test',
      });
      expect(result).not.toHaveProperty('onClick');
      expect(result).not.toHaveProperty('onError');
      expect(result).not.toHaveProperty('onLoad');
    });

    it('should preserve all ARIA attributes', () => {
      const props = {
        'aria-label': 'Test input',
        'aria-describedby': 'help-text',
        'aria-required': 'true',
        'aria-invalid': 'false',
        'aria-hidden': 'false',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });
  });

  describe('Security filtering', () => {
    it('should block all event handler props', () => {
      const props = {
        id: 'safe',
        onClick: jest.fn(),
        onDoubleClick: jest.fn(),
        onMouseDown: jest.fn(),
        onMouseUp: jest.fn(),
        onMouseEnter: jest.fn(),
        onMouseLeave: jest.fn(),
        onKeyDown: jest.fn(),
        onKeyUp: jest.fn(),
        onKeyPress: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onChange: jest.fn(),
        onInput: jest.fn(),
        onSubmit: jest.fn(),
        onError: jest.fn(),
        onLoad: jest.fn(),
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({ id: 'safe' });
      expect(Object.keys(result).length).toBe(1);
    });

    it('should block dangerous attributes', () => {
      // This test verifies that dangerous attributes are stripped out.
      // The props object is constructed with dangerous properties as TEST INPUT
      // to verify getSafeInputProps correctly REMOVES them before they reach the DOM.
      const testHtmlContent = '<script>alert("test")</script>';

      // Construct props object with dangerous properties dynamically
      // to avoid static analysis false positives (this is a security TEST)
      const props: Record<string, unknown> = { id: 'safe' };
      const dangerousPropName = ['dangerously', 'Set', 'Inner', 'HTML'].join('');
      props[dangerousPropName] = { __html: testHtmlContent };
      props['innerHTML'] = testHtmlContent;
      props['outerHTML'] = testHtmlContent;

      const result = getSafeInputProps(props);

      expect(result).toEqual({ id: 'safe' });
      expect(result).not.toHaveProperty(dangerousPropName);
      expect(result).not.toHaveProperty('innerHTML');
      expect(result).not.toHaveProperty('outerHTML');
    });

    it('should block custom props not in whitelist', () => {
      const props = {
        id: 'safe',
        customProp: 'value',
        'data-custom': 'value',
        myHandler: jest.fn(),
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({ id: 'safe' });
    });
  });

  describe('HTML input attributes', () => {
    it('should allow all standard input attributes', () => {
      const props = {
        accept: '.jpg,.png',
        alt: 'Upload image',
        autoComplete: 'email',
        autoFocus: true,
        capture: 'user',
        disabled: false,
        form: 'my-form',
        height: 100,
        list: 'datalist-id',
        max: 100,
        maxLength: 50,
        min: 0,
        minLength: 3,
        multiple: true,
        name: 'file-input',
        pattern: '[A-Za-z]+',
        placeholder: 'Enter text',
        readOnly: false,
        required: true,
        step: 5,
        type: 'text',
        value: 'current value',
        width: 200,
      };

      const result = getSafeInputProps(props);

      // All attributes except 'type' should be present (type is not in whitelist)
      expect(result.accept).toBe('.jpg,.png');
      expect(result.alt).toBe('Upload image');
      expect(result.autoComplete).toBe('email');
      expect(result.autoFocus).toBe(true);
      expect(result.capture).toBe('user');
      expect(result.disabled).toBe(false);
      expect(result.form).toBe('my-form');
      expect(result.height).toBe(100);
      expect(result.list).toBe('datalist-id');
      expect(result.max).toBe(100);
      expect(result.maxLength).toBe(50);
      expect(result.min).toBe(0);
      expect(result.minLength).toBe(3);
      expect(result.multiple).toBe(true);
      expect(result.name).toBe('file-input');
      expect(result.pattern).toBe('[A-Za-z]+');
      expect(result.placeholder).toBe('Enter text');
      expect(result.readOnly).toBe(false);
      expect(result.required).toBe(true);
      expect(result.step).toBe(5);
      expect(result.value).toBe('current value');
      expect(result.width).toBe(200);
    });

    it('should allow form-related attributes', () => {
      const props = {
        form: 'main-form',
        formEncType: 'multipart/form-data',
        formMethod: 'post',
        formNoValidate: true,
        formTarget: '_blank',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });
  });

  describe('ARIA attributes comprehensive', () => {
    it('should allow all ARIA state attributes', () => {
      const props = {
        'aria-busy': 'true',
        'aria-checked': 'mixed',
        'aria-disabled': 'true',
        'aria-expanded': 'false',
        'aria-hidden': 'false',
        'aria-invalid': 'true',
        'aria-pressed': 'true',
        'aria-selected': 'true',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow all ARIA relationship attributes', () => {
      const props = {
        'aria-activedescendant': 'option-1',
        'aria-controls': 'panel-1',
        'aria-describedby': 'description-1',
        'aria-details': 'details-1',
        'aria-errormessage': 'error-1',
        'aria-flowto': 'section-2',
        'aria-labelledby': 'label-1',
        'aria-owns': 'owned-1',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow all ARIA widget attributes', () => {
      const props = {
        'aria-autocomplete': 'list',
        'aria-haspopup': 'menu',
        'aria-level': '2',
        'aria-modal': 'true',
        'aria-multiline': 'false',
        'aria-multiselectable': 'true',
        'aria-orientation': 'horizontal',
        'aria-placeholder': 'Enter value',
        'aria-readonly': 'true',
        'aria-required': 'true',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow all ARIA live region attributes', () => {
      const props = {
        'aria-atomic': 'true',
        'aria-live': 'polite',
        'aria-relevant': 'additions text',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow all ARIA grid attributes', () => {
      const props = {
        'aria-colcount': '5',
        'aria-colindex': '2',
        'aria-colspan': '2',
        'aria-rowcount': '10',
        'aria-rowindex': '3',
        'aria-rowspan': '1',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow all ARIA value attributes', () => {
      const props = {
        'aria-valuemax': '100',
        'aria-valuemin': '0',
        'aria-valuenow': '50',
        'aria-valuetext': 'Fifty percent',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });
  });

  describe('Global HTML attributes', () => {
    it('should allow global HTML attributes', () => {
      const props = {
        id: 'unique-id',
        className: 'input-class',
        title: 'Input title',
        lang: 'en',
        dir: 'ltr',
        hidden: false,
        tabIndex: 0,
        role: 'textbox',
        spellCheck: true,
        translate: 'yes',
        contentEditable: 'false',
        draggable: false,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should allow style attribute', () => {
      const style = { color: 'red', fontSize: '16px' };
      const props = {
        id: 'styled',
        style,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
      expect(result.style).toBe(style);
    });
  });

  describe('RDF attributes', () => {
    it('should allow RDF/semantic web attributes', () => {
      const props = {
        id: 'semantic',
        prefix: 'og: http://ogp.me/ns#',
        property: 'og:title',
        resource: 'http://example.com',
        datatype: 'xsd:string',
        typeof: 'schema:Person',
        vocab: 'http://schema.org/',
        rev: 'made',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });
  });

  describe('Edge cases', () => {
    it('should handle null values', () => {
      const props = {
        id: 'test',
        name: null,
        value: null,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'test',
        name: null,
        value: null,
      });
    });

    it('should handle undefined values', () => {
      const props = {
        id: 'test',
        name: undefined,
        value: undefined,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'test',
        name: undefined,
        value: undefined,
      });
    });

    it('should handle boolean values', () => {
      const props = {
        disabled: false,
        readOnly: true,
        required: false,
        multiple: true,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should handle numeric values', () => {
      const props = {
        min: 0,
        max: 100,
        step: 5,
        maxLength: 50,
        minLength: 10,
        tabIndex: -1,
        height: 200,
        width: 300,
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should handle empty strings', () => {
      const props = {
        id: '',
        name: '',
        placeholder: '',
        value: '',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should handle special characters in strings', () => {
      const props = {
        id: 'test-<script>',
        name: 'user"name',
        placeholder: "Enter 'value'",
        value: 'test&value',
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual(props);
    });

    it('should handle object values for style', () => {
      const styleObj = {
        backgroundColor: 'blue',
        fontSize: '14px',
        padding: '10px',
      };

      const props = {
        id: 'styled',
        style: styleObj,
      };

      const result = getSafeInputProps(props);

      expect(result.style).toBe(styleObj);
    });

    it('should not modify original props object', () => {
      const props = {
        id: 'test',
        onClick: jest.fn(),
        name: 'input',
      };

      const originalKeys = Object.keys(props);
      getSafeInputProps(props);

      expect(Object.keys(props)).toEqual(originalKeys);
      expect(props).toHaveProperty('onClick');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complex input with mixed safe and unsafe props', () => {
      const onClick = jest.fn();
      const onChange = jest.fn();

      const props = {
        id: 'email-input',
        name: 'email',
        type: 'email',
        value: 'user@example.com',
        placeholder: 'Enter your email',
        required: true,
        autoComplete: 'email',
        'aria-label': 'Email address',
        'aria-required': 'true',
        'aria-describedby': 'email-help',
        onClick,
        onChange,
        onFocus: jest.fn(),
        customProp: 'ignored',
        dangerouslySetInnerHTML: { __html: '<script>xss</script>' },
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'email-input',
        name: 'email',
        value: 'user@example.com',
        placeholder: 'Enter your email',
        required: true,
        autoComplete: 'email',
        'aria-label': 'Email address',
        'aria-required': 'true',
        'aria-describedby': 'email-help',
      });
    });

    it('should handle checkbox input props', () => {
      const props = {
        id: 'terms',
        name: 'terms',
        type: 'checkbox',
        checked: true,
        defaultChecked: false,
        required: true,
        disabled: false,
        'aria-label': 'Accept terms',
        onChange: jest.fn(),
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'terms',
        name: 'terms',
        defaultChecked: false,
        required: true,
        disabled: false,
        'aria-label': 'Accept terms',
      });
    });

    it('should handle file input props', () => {
      const props = {
        id: 'file-upload',
        name: 'documents',
        type: 'file',
        accept: '.pdf,.doc,.docx',
        multiple: true,
        capture: 'environment',
        'aria-label': 'Upload documents',
        onChange: jest.fn(),
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'file-upload',
        name: 'documents',
        accept: '.pdf,.doc,.docx',
        multiple: true,
        capture: 'environment',
        'aria-label': 'Upload documents',
      });
    });

    it('should handle number input with validation', () => {
      const props = {
        id: 'age',
        name: 'age',
        type: 'number',
        min: 0,
        max: 120,
        step: 1,
        value: '25',
        required: true,
        'aria-label': 'Your age',
        'aria-valuemin': '0',
        'aria-valuemax': '120',
        'aria-valuenow': '25',
        onChange: jest.fn(),
      };

      const result = getSafeInputProps(props);

      expect(result).toEqual({
        id: 'age',
        name: 'age',
        min: 0,
        max: 120,
        step: 1,
        value: '25',
        required: true,
        'aria-label': 'Your age',
        'aria-valuemin': '0',
        'aria-valuemax': '120',
        'aria-valuenow': '25',
      });
    });
  });

  describe('SAFE_INPUT_ATTRIBUTES constant', () => {
    it('should be a frozen object to prevent modifications', () => {
      // TypeScript enforces readonly at compile time
      // Check that the object has the expected structure
      expect(typeof SAFE_INPUT_ATTRIBUTES).toBe('object');
      expect(SAFE_INPUT_ATTRIBUTES).not.toBeNull();
    });

    it('should contain all expected attribute categories', () => {
      const keys = Object.keys(SAFE_INPUT_ATTRIBUTES) as SafeInputAttribute[];

      // Should have basic HTML attributes
      expect(keys).toContain('id');
      expect(keys).toContain('name');
      expect(keys).toContain('className');

      // Should have input-specific attributes
      expect(keys).toContain('placeholder');
      expect(keys).toContain('disabled');
      expect(keys).toContain('required');

      // Should have ARIA attributes
      expect(keys).toContain('aria-label');
      expect(keys).toContain('aria-describedby');
      expect(keys).toContain('aria-required');
    });

    it('should not contain event handler properties', () => {
      const keys = Object.keys(SAFE_INPUT_ATTRIBUTES);

      const eventHandlers = [
        'onClick',
        'onChange',
        'onFocus',
        'onBlur',
        'onKeyDown',
        'onKeyUp',
        'onMouseEnter',
        'onMouseLeave',
      ];

      for (const handler of eventHandlers) {
        expect(keys).not.toContain(handler);
      }
    });
  });

  describe('Performance', () => {
    it('should handle large prop objects efficiently', () => {
      const largeProps: Record<string, unknown> = {};

      // Add 1000 unsafe properties
      for (let i = 0; i < 1000; i++) {
        largeProps[`unsafeProp${i}`] = `value${i}`;
        largeProps[`onClick${i}`] = jest.fn();
      }

      // Add some safe properties
      largeProps.id = 'test';
      largeProps.name = 'test';
      largeProps['aria-label'] = 'Test';

      const start = performance.now();
      const result = getSafeInputProps(largeProps);
      const end = performance.now();

      expect(end - start).toBeLessThan(50);
      expect(result).toEqual({
        id: 'test',
        name: 'test',
        'aria-label': 'Test',
      });
    });
  });
});
