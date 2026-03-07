export type TokenType =
  | 'literal'
  | 'meta'
  | 'anchor'
  | 'quantifier'
  | 'class'
  | 'group'
  | 'alternation'
  | 'escape'

export interface Token {
  text: string
  type: TokenType
}

export function tokenize(pattern: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  let inClass = false

  while (i < pattern.length) {
    const ch = pattern[i]

    // Escape sequence: \X — always two characters
    if (ch === '\\' && i + 1 < pattern.length) {
      tokens.push({ text: ch + pattern[i + 1], type: 'escape' })
      i += 2
      continue
    }

    if (inClass) {
      if (ch === ']') {
        tokens.push({ text: ch, type: 'class' })
        inClass = false
      } else {
        tokens.push({ text: ch, type: 'class' })
      }
      i++
      continue
    }

    switch (ch) {
      case '[':
        tokens.push({ text: ch, type: 'class' })
        inClass = true
        i++
        break
      case '(':
      case ')':
        tokens.push({ text: ch, type: 'group' })
        i++
        break
      case '*':
      case '+':
      case '?':
        tokens.push({ text: ch, type: 'quantifier' })
        i++
        break
      case '{': {
        // Consume {n} or {n,m} — only treat as quantifier if well-formed
        let j = i + 1
        while (j < pattern.length && pattern[j] !== '}' && pattern[j] !== '{') j++
        if (j < pattern.length && pattern[j] === '}') {
          tokens.push({ text: pattern.slice(i, j + 1), type: 'quantifier' })
          i = j + 1
        } else {
          tokens.push({ text: ch, type: 'literal' })
          i++
        }
        break
      }
      case '^':
      case '$':
        tokens.push({ text: ch, type: 'anchor' })
        i++
        break
      case '.':
        tokens.push({ text: ch, type: 'meta' })
        i++
        break
      case '|':
        tokens.push({ text: ch, type: 'alternation' })
        i++
        break
      default:
        tokens.push({ text: ch, type: 'literal' })
        i++
    }
  }

  return tokens
}

export function tokenClass(type: TokenType): string {
  switch (type) {
    case 'meta':        return 'text-sky-500 dark:text-sky-400'
    case 'anchor':      return 'text-violet-500 dark:text-violet-400'
    case 'quantifier':  return 'text-amber-500 dark:text-amber-400'
    case 'class':       return 'text-green-600 dark:text-green-400'
    case 'group':       return 'text-blue-500 dark:text-blue-400'
    case 'alternation': return 'text-violet-500 dark:text-violet-400'
    case 'escape':      return 'text-rose-500 dark:text-rose-400'
    case 'literal':     return 'text-gray-800 dark:text-gray-200'
  }
}
