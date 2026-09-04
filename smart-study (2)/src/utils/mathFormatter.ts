/**
 * Utility to convert raw LaTeX expressions and mathematical codes
 * into clean, readable Unicode formatted text.
 * Prevents raw unparsed LaTeX artifacts (like \frac, \pm, \sqrt, $#@*&)
 * from appearing as garbage symbols to students.
 */

export function formatMathText(raw: string): string {
  if (!raw) return '';

  let text = raw;

  // Replace common LaTeX fractions: \frac{a}{b} -> (a / b)
  // Handle nested or simple fractions with regex loop
  for (let i = 0; i < 5; i++) {
    if (!text.includes('\\frac')) break;
    text = text.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1 / $2)');
  }

  // Square roots: \sqrt{x} or \sqrt[n]{x}
  text = text.replace(/\\sqrt\[(\d+)\]\{([^{}]+)\}/g, 'ⁿ√($2)');
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  text = text.replace(/\\sqrt\s+(\w+)/g, '√$1');

  // Common math symbols
  const symbolMap: Record<string, string> = {
    '\\pm': '±',
    '\\mp': '∓',
    '\\times': '×',
    '\\div': '÷',
    '\\cdot': '·',
    '\\bullet': '•',
    '\\leq': '≤',
    '\\le': '≤',
    '\\geq': '≥',
    '\\ge': '≥',
    '\\neq': '≠',
    '\\approx': '≈',
    '\\sim': '~',
    '\\equiv': '≡',
    '\\infty': '∞',
    '\\propto': '∝',
    '\\Delta': 'Δ',
    '\\delta': 'δ',
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\Gamma': 'Γ',
    '\\theta': 'θ',
    '\\Theta': 'Θ',
    '\\pi': 'π',
    '\\Pi': 'Π',
    '\\lambda': 'λ',
    '\\Lambda': 'Λ',
    '\\mu': 'μ',
    '\\sigma': 'σ',
    '\\Sigma': 'Σ',
    '\\omega': 'ω',
    '\\Omega': 'Ω',
    '\\phi': 'φ',
    '\\Phi': 'Φ',
    '\\rho': 'ρ',
    '\\tau': 'τ',
    '\\epsilon': 'ε',
    '\\eta': 'η',
    '\\angle': '∠',
    '\\circ': '°',
    '\\degree': '°',
    '\\to': '→',
    '\\rightarrow': '→',
    '\\leftarrow': '←',
    '\\Rightarrow': '⇒',
    '\\Leftarrow': '⇐',
    '\\iff': '⇔',
    '\\in': '∈',
    '\\notin': '∉',
    '\\subset': '⊂',
    '\\cup': '∪',
    '\\cap': '∩',
    '\\forall': '∀',
    '\\exists': '∃',
    '\\nabla': '∇',
    '\\partial': '∂',
    '\\int': '∫',
    '\\sum': '∑',
    '\\prod': '∏',
    '\\quad': '  ',
    '\\qquad': '    ',
    '\\,': ' ',
    '\\;': ' ',
    '\\!': '',
    '\\left(': '(',
    '\\right)': ')',
    '\\left[': '[',
    '\\right]': ']',
    '\\left\\{': '{',
    '\\right\\}': '}',
    '\\{': '{',
    '\\}': '}',
    '\\_': '_',
    '\\%': '%',
  };

  for (const [latex, unicode] of Object.entries(symbolMap)) {
    text = text.split(latex).join(unicode);
  }

  // Remove LaTeX wrappers like \text{...}, \mathrm{...}, \mathbf{...}
  text = text.replace(/\\(text|mathrm|mathit|textsf)\{([^{}]+)\}/g, '$2');
  text = text.replace(/\\mathbf\{([^{}]+)\}/g, '**$1**');

  // Convert common exponents ^2, ^3, ^0, ^1, etc.
  const superscriptMap: Record<string, string> = {
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
    '+': '⁺',
    '-': '⁻',
    '=': '⁼',
    '(': '⁽',
    ')': '⁾',
    'n': 'ⁿ',
    'i': 'ⁱ',
    'x': 'ˣ',
  };

  text = text.replace(/\^\{([0-9+\-nix]+)\}/g, (_, chars) =>
    chars.split('').map((c: string) => superscriptMap[c] || c).join('')
  );
  text = text.replace(/\^([0-9])/g, (_, digit) => superscriptMap[digit] || digit);
  text = text.replace(/\^\\circ/g, '°');

  // Subscripts _1, _2, _i
  const subscriptMap: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
    '+': '₊',
    '-': '₋',
    'a': 'ₐ',
    'e': 'ₑ',
    'i': 'ᵢ',
    'o': 'ₒ',
    'r': 'ᵣ',
    'u': 'ᵤ',
    'v': 'ᵥ',
    'x': 'ₓ',
  };

  text = text.replace(/_\{([0-9+\-aeioruvx]+)\}/g, (_, chars) =>
    chars.split('').map((c: string) => subscriptMap[c] || c).join('')
  );
  text = text.replace(/_([0-9])/g, (_, digit) => subscriptMap[digit] || digit);

  // Clean up standalone unneeded double dollars $$ and single $
  // Convert $$ formula $$ into clean centered bold or block
  text = text.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_match, formula) => {
    return `\n\n> **${formula.trim()}**\n\n`;
  });

  // Convert inline $ formula $
  text = text.replace(/\$([^\$\n]+)\$/g, '$1');

  // Strip any remaining lone dollar signs from LaTeX
  text = text.replace(/\$/g, '');

  // Clean up remaining escaped backslashes before plain letters
  text = text.replace(/\\([a-zA-Z]+)/g, '$1');

  return text;
}

/**
 * Creates clean text preview for quick cards and notes
 */
export function cleanNotePreview(content: string, maxLen = 130): string {
  if (!content) return '';
  const formatted = formatMathText(content);
  return formatted
    .replace(/[#*`_>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}
