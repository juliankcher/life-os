# Spec

## Feature name: $ARGUMENTS

Interview the user to build a complete specification for a feature or app.

## Rules

- Ask ONE focused question at a time and wait for the answer before asking the next.
- Never ask multiple questions in one message.
- Never start building, writing code, or suggesting implementation approaches during the interview.
- Keep questions concrete — avoid vague prompts like "tell me more".
- Stop asking when you can answer all of the following with confidence:
  1. What is the objective? (the single sentence that defines success)
  2. What are the must-have requirements? (everything the build MUST do)
  3. What are the constraints? (tech stack, style, existing code to integrate with, things to avoid)
  4. What are the edge cases? (unusual inputs, empty states, error conditions, concurrency)
  5. What does "done" look like? (concrete, checkable acceptance criteria)

## Interview process

Start by asking: "What do you want to build?" (or, if $ARGUMENTS is provided, ask the first clarifying question about $ARGUMENTS directly).

Work through the five dimensions above in a natural conversation order. Infer what you can from prior answers; only ask what you still need.

When you have confident answers to all five dimensions, say:

> "I have enough to write the spec. One moment."

Then write the spec immediately — do not ask for permission.

## Output

Save the spec to `specs/<name>.md` where `<name>` is a short kebab-case identifier derived from the feature name.

The spec file must follow this exact structure:

```markdown
# <Feature Name>

## Objective
One sentence: what this build must achieve and for whom.

## Requirements
Numbered list. Each item is a single, verifiable statement beginning with a verb (e.g. "Display…", "Allow…", "Reject…", "Persist…"). No vague language like "handle appropriately" — describe the exact behavior.

## Edge Cases
Bullet list. Each item names a specific situation and the expected behavior (e.g. "Empty list — show a placeholder message, not a blank screen").

## Constraints
Bullet list of fixed boundaries: tech stack, existing APIs or components to use, things explicitly out of scope, performance or accessibility requirements.

## Definition of Done
Numbered checklist. Each item is a binary pass/fail check a reviewer can run or observe without interpretation. Written in the form "[ ] <observable outcome>".
```

After saving, tell the user the file path and that they can run `/build <name>` to implement it.
