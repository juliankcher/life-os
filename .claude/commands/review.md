# Review

## Spec name: $ARGUMENTS

Compare the current build against `specs/$ARGUMENTS.md` and produce a gap report.

## Rules

- Go through every requirement and every Definition of Done item individually.
- Do not pass a requirement if it is only partially met — partial = fail.
- Do not pass a requirement based on intent or code structure — only on observable behavior.
- Name the exact spec item (by number or text) for every finding.
- Do not suggest improvements beyond the spec. Scope is defined by the spec, not by what "would be better".

## Process

1. **Load the spec** — read `specs/$ARGUMENTS.md` in full.
2. **Inspect the build** — read the relevant source files. Run linting or type checks if available.
3. **Check each requirement** — for each numbered requirement, determine: PASS or FAIL.
4. **Check each Definition of Done item** — for each checklist item, determine: PASS, FAIL, or MANUAL CHECK NEEDED.
5. **Write the report** — see format below.

## Output

Print the review report in this exact format:

```
## Review — specs/$ARGUMENTS.md

### Requirements
- [x] Req 1: <text> — PASS
- [ ] Req 2: <text> — FAIL
  - Gap: <exact description of what is wrong or missing>
  - Fix: <specific change needed to pass this requirement>
...

### Definition of Done
- [x] <item> — PASS
- [ ] <item> — FAIL
  - Gap: <what was observed vs. what was required>
  - Fix: <specific change needed>
- [ ] <item> — MANUAL CHECK NEEDED
  - How to check: <instructions for a human reviewer>
...

### Verdict
PASS — all requirements met. Ready to ship.
  OR
FAIL — <N> requirement(s) and <M> Definition of Done item(s) need fixes.
```

If the verdict is FAIL, end with:

> "Hand these fixes to `/build $ARGUMENTS` to address them."

If the verdict is PASS, end with:

> "All spec requirements are met. The build is complete."
