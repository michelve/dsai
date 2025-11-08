// Show UI
figma.showUI(__html__, { width: 340, height: 280 });

// Message handler
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-tokens') {
    try {
      await importTokens(msg.data);
    } catch (error) {
      console.error('Import error:', error);
      figma.ui.postMessage({
        type: 'import-error',
        message: `Import failed: ${error.message}`,
      });
    }
  }
};

function isAlias(value) {
  return value && value.toString().trim().charAt(0) === '{';
}

async function importTokens(data) {
  // Support both array format [{ Collections: {...} }] and direct object
  const tokenData = Array.isArray(data) ? data[0] : data;

  figma.ui.postMessage({
    type: 'import-progress',
    message: 'Processing token data...',
  });

  let createdCount = 0;
  let updatedCount = 0;

  // Process each collection
  for (const [collectionName, collectionData] of Object.entries(tokenData)) {
    figma.ui.postMessage({
      type: 'import-progress',
      message: `Processing collection: ${collectionName}...`,
    });

    // Find or create collection
    const allCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let collection = allCollections.find((c) => c.name === collectionName);

    if (!collection) {
      collection = figma.variables.createVariableCollection(collectionName);
      createdCount++;
    } else {
      updatedCount++;
    }

    // Store tokens and aliases for processing
    const tokens = {};
    const aliases = {};

    // Process modes
    if (collectionData.modes) {
      const modeNames = Object.keys(collectionData.modes);

      // Set up modes
      const existingModes = collection.modes;

      // Rename or create modes to match token data
      for (let i = 0; i < modeNames.length; i++) {
        const modeName = modeNames[i];

        if (i < existingModes.length) {
          // Rename existing mode
          collection.renameMode(existingModes[i].modeId, modeName);
        } else {
          // Add new mode
          collection.addMode(modeName);
        }
      }

      // Get updated modes after setup
      const modes = collection.modes;

      // Process colors for each mode (first mode only for now)
      const firstModeName = modeNames[0];
      const firstModeData = collectionData.modes[firstModeName];
      const modeId = modes[0].modeId;

      if (firstModeData.colors) {
        await traverseTokens({
          collection,
          modeId,
          type: 'color',
          object: firstModeData.colors,
          tokens,
          aliases,
          key: '',
        });
      }

      // Process aliases after all tokens are created
      await processAliases({ collection, modeId, aliases, tokens });

      // Now set values for other modes
      for (let modeIndex = 1; modeIndex < modeNames.length; modeIndex++) {
        const modeName = modeNames[modeIndex];
        const modeData = collectionData.modes[modeName];
        const modeModeId = modes[modeIndex].modeId;

        if (modeData.colors) {
          await setModeValues({
            modeId: modeModeId,
            object: modeData.colors,
            tokens,
            key: '',
          });
        }
      }
    }
  }

  figma.ui.postMessage({
    type: 'import-success',
    message: `✅ Import complete! ${createdCount} created, ${updatedCount} updated`,
  });
}

async function traverseTokens({ collection, modeId, type, object, tokens, aliases, key }) {
  for (const [tokenKey, tokenValue] of Object.entries(object)) {
    // Skip meta fields
    if (tokenKey.charAt(0) === '$') {
      continue;
    }

    const fullKey = key ? `${key}/${tokenKey}` : tokenKey;

    // Check if this is a token with a value
    if (tokenValue.$value !== undefined) {
      const tokenType = type || tokenValue.$type;

      // Only process color tokens, skip string/number types
      if (tokenType !== 'color') {
        continue;
      }

      if (isAlias(tokenValue.$value)) {
        // Handle alias reference
        const valueKey = tokenValue.$value
          .trim()
          .replace(/[\{\}]/g, '') // Remove braces
          .replace(/^colors\./, '') // Remove "colors." prefix if present
          .replace(/^colors\//, '') // Remove "colors/" prefix if present
          .replace(/\./g, '/'); // Convert dots to slashes

        if (tokens[valueKey]) {
          // Create alias immediately if target exists
          tokens[fullKey] = createVariableAlias(
            collection,
            modeId,
            fullKey,
            valueKey,
            tokens,
            tokenValue
          );
        } else {
          // Store for later processing
          aliases[fullKey] = {
            key: fullKey,
            type: tokenType,
            valueKey,
            description: tokenValue.$description,
            scopes: tokenValue.$scopes,
          };
        }
      } else {
        // Create color variable with direct value
        tokens[fullKey] = createColorVariable(collection, modeId, fullKey, tokenValue);
      }
    } else {
      // Recurse into nested objects
      await traverseTokens({
        collection,
        modeId,
        type: type || tokenValue.$type,
        object: tokenValue,
        tokens,
        aliases,
        key: fullKey,
      });
    }
  }
}

function createColorVariable(collection, modeId, name, token) {
  // Try to find existing variable first
  const allVariables = figma.variables.getLocalVariables('COLOR');
  let variable = allVariables.find(
    (v) => v.name === name && v.variableCollectionId === collection.id
  );

  if (!variable) {
    variable = figma.variables.createVariable(name, collection, 'COLOR');
  }

  variable.setValueForMode(modeId, parseColor(token.$value));

  // Build description with extensions if available
  let description = token.$description || '';

  if (token.$extensions) {
    const extensionLines = [];
    if (token.$extensions.category) {
      extensionLines.push(`Category: ${token.$extensions.category}`);
    }
    if (token.$extensions['bootstrap.version']) {
      extensionLines.push(`Bootstrap: ${token.$extensions['bootstrap.version']}`);
    }
    if (token.$extensions.accessibility) {
      if (token.$extensions.accessibility.contrast) {
        extensionLines.push(`Contrast: ${token.$extensions.accessibility.contrast}`);
      }
      if (token.$extensions.accessibility.usage) {
        extensionLines.push(`Usage: ${token.$extensions.accessibility.usage}`);
      }
    }

    if (extensionLines.length > 0) {
      const extensionsBlock = extensionLines.join(' • ');
      description = description ? `${description}\n\n${extensionsBlock}` : extensionsBlock;
    }
  }

  if (description) {
    variable.description = description;
  }

  // Set code syntax for each platform
  if (token.$codeSyntax) {
    if (token.$codeSyntax.WEB) {
      variable.setVariableCodeSyntax('WEB', token.$codeSyntax.WEB);
    }
    if (token.$codeSyntax.ANDROID) {
      variable.setVariableCodeSyntax('ANDROID', token.$codeSyntax.ANDROID);
    }
    if (token.$codeSyntax.iOS) {
      variable.setVariableCodeSyntax('iOS', token.$codeSyntax.iOS);
    }
  }

  if (token.$scopes) {
    variable.scopes = mapScopes(token.$scopes);
  }

  return variable;
}

function createVariableAlias(collection, modeId, name, valueKey, tokens, token) {
  const targetVariable = tokens[valueKey];

  // Try to find existing variable first
  const allVariables = figma.variables.getLocalVariables('COLOR');
  let variable = allVariables.find(
    (v) => v.name === name && v.variableCollectionId === collection.id
  );

  if (!variable) {
    variable = figma.variables.createVariable(name, collection, 'COLOR');
  }

  variable.setValueForMode(modeId, {
    type: 'VARIABLE_ALIAS',
    id: targetVariable.id,
  });

  // Build description with extensions if available
  let description = token && token.$description ? token.$description : '';

  if (token && token.$extensions) {
    const extensionLines = [];
    if (token.$extensions.category) {
      extensionLines.push(`Category: ${token.$extensions.category}`);
    }
    if (token.$extensions['bootstrap.version']) {
      extensionLines.push(`Bootstrap: ${token.$extensions['bootstrap.version']}`);
    }
    if (token.$extensions.accessibility) {
      if (token.$extensions.accessibility.contrast) {
        extensionLines.push(`Contrast: ${token.$extensions.accessibility.contrast}`);
      }
      if (token.$extensions.accessibility.usage) {
        extensionLines.push(`Usage: ${token.$extensions.accessibility.usage}`);
      }
    }

    if (extensionLines.length > 0) {
      const extensionsBlock = extensionLines.join(' • ');
      description = description ? `${description}\n\n${extensionsBlock}` : extensionsBlock;
    }
  }

  if (description) {
    variable.description = description;
  }

  // Set code syntax for each platform
  if (token && token.$codeSyntax) {
    if (token.$codeSyntax.WEB) {
      variable.setVariableCodeSyntax('WEB', token.$codeSyntax.WEB);
    }
    if (token.$codeSyntax.ANDROID) {
      variable.setVariableCodeSyntax('ANDROID', token.$codeSyntax.ANDROID);
    }
    if (token.$codeSyntax.iOS) {
      variable.setVariableCodeSyntax('iOS', token.$codeSyntax.iOS);
    }
  }

  if (token && token.$scopes) {
    variable.scopes = mapScopes(token.$scopes);
  }

  return variable;
}

async function processAliases({ collection, modeId, aliases, tokens }) {
  const aliasArray = Object.values(aliases);
  let generations = aliasArray.length;

  console.log('Processing', aliasArray.length, 'aliases');
  console.log('Available tokens:', Object.keys(tokens).slice(0, 10));

  while (aliasArray.length && generations > 0) {
    for (let i = 0; i < aliasArray.length; i++) {
      const { key, valueKey, description, scopes } = aliasArray[i];
      const targetVariable = tokens[valueKey];

      if (targetVariable) {
        aliasArray.splice(i, 1);
        tokens[key] = createVariableAlias(collection, modeId, key, valueKey, tokens, {
          $description: description,
          $scopes: scopes,
        });
        console.log('✓ Resolved alias:', key, '→', valueKey);
        i--;
      } else {
        console.log('✗ Cannot resolve alias:', key, '→', valueKey, '(target not found)');
      }
    }
    generations--;
  }

  if (aliasArray.length > 0) {
    console.log('Warning:', aliasArray.length, 'aliases could not be resolved');
  }
}

async function setModeValues({ modeId, object, tokens, key }) {
  for (const [tokenKey, tokenValue] of Object.entries(object)) {
    // Skip meta fields
    if (tokenKey.charAt(0) === '$') {
      continue;
    }

    const fullKey = key ? `${key}/${tokenKey}` : tokenKey;

    // Check if this is a token with a value
    if (tokenValue.$value !== undefined) {
      const variable = tokens[fullKey];

      if (variable) {
        if (isAlias(tokenValue.$value)) {
          // Set alias for this mode
          const valueKey = tokenValue.$value
            .trim()
            .replace(/[\{\}]/g, '') // Remove braces
            .replace(/^colors\./, '') // Remove "colors." prefix if present
            .replace(/^colors\//, '') // Remove "colors/" prefix if present
            .replace(/\./g, '/'); // Convert dots to slashes

          const targetVariable = tokens[valueKey];
          if (targetVariable) {
            variable.setValueForMode(modeId, {
              type: 'VARIABLE_ALIAS',
              id: targetVariable.id,
            });
          }
        } else {
          // Set direct value for this mode
          variable.setValueForMode(modeId, parseColor(tokenValue.$value));
        }
      }
    } else {
      // Recurse into nested objects
      await setModeValues({
        modeId,
        object: tokenValue,
        tokens,
        key: fullKey,
      });
    }
  }
}

function parseColor(colorString) {
  // Remove whitespace
  colorString = colorString.trim();

  // Handle hex colors
  if (colorString.startsWith('#')) {
    const hex = colorString.substring(1);

    // Support both #RGB and #RRGGBB
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    }

    return { r, g, b, a: 1 };
  }

  // Handle rgba colors
  if (colorString.startsWith('rgba')) {
    const values = colorString
      .match(/rgba?\(([^)]+)\)/)[1]
      .split(',')
      .map((v) => parseFloat(v.trim()));
    return {
      r: values[0] / 255,
      g: values[1] / 255,
      b: values[2] / 255,
      a: values[3] !== undefined ? values[3] : 1,
    };
  }

  // Handle rgb colors
  if (colorString.startsWith('rgb')) {
    const values = colorString
      .match(/rgb\(([^)]+)\)/)[1]
      .split(',')
      .map((v) => parseFloat(v.trim()));
    return {
      r: values[0] / 255,
      g: values[1] / 255,
      b: values[2] / 255,
      a: 1,
    };
  }

  // Default fallback
  return { r: 0, g: 0, b: 0, a: 1 };
}

function mapScopes(scopes) {
  // Map our scope names to Figma's VariableScope enum
  const scopeMap = {
    ALL_SCOPES: ['ALL_SCOPES'],
    ALL_FILLS: ['ALL_FILLS'],
    FRAME_FILL: ['FRAME_FILL'],
    SHAPE_FILL: ['SHAPE_FILL'],
    TEXT_FILL: ['TEXT_FILL'],
    STROKE: ['STROKE_COLOR'],
    STROKE_COLOR: ['STROKE_COLOR'],
    EFFECT_COLOR: ['EFFECT_COLOR'],
  };

  const figmaScopes = [];

  for (const scope of scopes) {
    const mapped = scopeMap[scope];
    if (mapped) {
      figmaScopes.push(...mapped);
    }
  }

  return figmaScopes.length > 0 ? figmaScopes : ['ALL_SCOPES'];
}
