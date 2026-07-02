# Build

## Spec name: $ARGUMENTS

Implement exactly what is described in `specs/$ARGUMENTS.md`. Nothing more, nothing less.

## Rules

- Read the entire spec before writing a single line of code.
- Implement every requirement in the spec. Do not skip any.
- Do not add features, abstractions, or "nice to haves" that are not in the spec.
- Do not refactor unrelated existing code.
- Do not invent requirements — if something is ambiguous, implement the simplest reading and note it.
- Follow the constraints section exactly (tech stack, existing components, exclusions).

## Process

1. **Read the spec** — load `specs/$ARGUMENTS.md` in full.
2. **Plan** — map each requirement to the files and changes needed. Note any ambiguities.
3. **Implement** — build requirement by requirement in the order listed in the spec.
4. **Verify** — check each item in the Definition of Done before declaring complete.

## Output

When implementation is complete, print a coverage report in this exact format:

```
## Build coverage — specs/$ARGUMENTS.md

### Requirements
- [x] Req 1 — <one-line description of what was done>
- [x] Req 2 — <one-line description of what was done>
...

### Definition of Done
- [x] <item> — PASS
- [ ] <item> — FAIL: <reason, if any>
...

### Notes
<Any ambiguities encountered and how you resolved them. Leave blank if none.>
```

If any Definition of Done item cannot be verified automatically, mark it with `MANUAL CHECK NEEDED` and describe what to look for.

After the report, tell the user they can run `/review $ARGUMENTS` to validate the build against the spec.
