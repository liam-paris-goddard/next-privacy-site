const fs = require('fs');
const css = require('css');

// Read the CSS from the file
const cssText = fs.readFileSync('src/components/header/header.scss', 'utf8');

// Parse the CSS
const obj = css.parse(cssText);

// Use a Set to track unique rules
const uniqueRules = new Set();

// Filter out duplicate rules
obj.stylesheet.rules = obj.stylesheet.rules.filter(rule => {
  // Convert the rule back to CSS text
  const ruleText = css.stringify({ stylesheet: { rules: [rule] } });

  // If we've seen this rule before, filter it out
  if (uniqueRules.has(ruleText)) {
    return false;
  }

  // Otherwise, add it to the set of seen rules and keep it
  uniqueRules.add(ruleText);
  return true;
});

// Convert the cleaned CSS back to text
const cleanedCssText = css.stringify(obj);

// Write the cleaned CSS back to the file
fs.writeFileSync('src/components/footer/clean-footer.scss', cleanedCssText);