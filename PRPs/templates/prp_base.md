---
name: "Base PRP Template v2 - Context-Rich with Validation Loops"
description: |
  Template optimized for AI agents to implement features with sufficient context
  and self-validation capabilities to achieve working code through iterative refinement.
---

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
[What needs to be built - be specific about the end state and desires]

## Why
- [Business value and user impact]
- [Integration with existing features]
- [Problems this solves and for whom]

## What
[User-visible behavior and technical requirements]

### Success Criteria
- [ ] [Specific measurable outcomes]

## All Needed Context

### Documentation & References (list all context needed to implement the feature)
```yaml
# MUST READ - Include these in your context window
- url: [Official API docs URL]
  why: [Specific sections/methods you'll need]
  
- file: [path/to/example.ts]
  why: [Pattern to follow, gotchas to avoid]
  
- doc: [Library documentation URL] 
  section: [Specific section about common pitfalls]
  critical: [Key insight that prevents common errors]

- docfile: [PRPs/ai_docs/file.md]
  why: [docs that the user has pasted in to the project]
```

### Current Codebase tree (run `tree` in the root of the project) to get an overview of the codebase
```bash

```

### Desired Codebase tree with files to be added and responsibility of file
```bash

```

### Known Gotchas of our codebase & Library Quirks
```
# CRITICAL: [Library name] requires [specific setup]
# Example: Next.js App Router requires 'use client' for hooks
# Example: Supabase client must not be instantiated in loops
```

## Implementation Blueprint

### Data models and structure

Create the core data models, ensuring type safety and consistency.
```typescript
// Examples:
// - TypeScript interfaces / types
// - Zod schemas
// - Supabase table types
```

### List of tasks to be completed to fulfil the PRP in the order they should be completed

```yaml
Task 1:
MODIFY src/existing_module.ts:
  - FIND pattern: "class OldImplementation"
  - INJECT after line containing "function init"
  - PRESERVE existing method signatures

CREATE src/new_feature.ts:
  - MIRROR pattern from: src/similar_feature.ts
  - MODIFY class name and core logic
  - KEEP error handling pattern identical

...(...)

Task N:
...
```

### Per task pseudocode as needed added to each task
```typescript
// Task 1
// Pseudocode with CRITICAL details — don't write entire code
async function newFeature(param: string): Promise<Result> {
  // PATTERN: Always validate input first (see src/validators.ts)
  const validated = validateInput(param); // throws ValidationError

  // GOTCHA: Supabase client must be created server-side for auth
  const supabase = createServerClient();
  
  // PATTERN: Use existing retry decorator
  const result = await withRetry(() => supabase.from('table').select('*'));

  // PATTERN: Standardized response format
  return formatResponse(result); // see src/utils/responses.ts
}
```

### Integration Points
```yaml
DATABASE:
  - migration: "Add column 'feature_enabled' to users table"
  
CONFIG:
  - add to: .env.local
  - pattern: "NEXT_PUBLIC_FEATURE_FLAG=true"
  
ROUTES:
  - add to: src/app/api/feature/route.ts
  - pattern: mirror existing API route handlers
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint          # ESLint
npx tsc --noEmit     # TypeScript type checking

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Build
```bash
npm run build

# Expected: Successful build with no type errors.
```

### Level 3: Manual Test
```bash
npm run dev
# Then manually verify the feature works end-to-end in the browser
```

## Final Validation Checklist
- [ ] No lint errors: `npm run lint`
- [ ] No type errors: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] Manual test successful
- [ ] Error cases handled gracefully
- [ ] No hardcoded secrets or values that should be env vars

---

## Anti-Patterns to Avoid
- ❌ Don't create new patterns when existing ones work
- ❌ Don't skip validation because "it should work"
- ❌ Don't ignore type errors — fix them
- ❌ Don't use `any` type
- ❌ Don't hardcode values that should be config
- ❌ Don't catch all exceptions — be specific
