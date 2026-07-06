#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 300000}'

# Install humanizer skill if not already present
if [ ! -d "$HOME/.claude/skills/humanizer" ]; then
  mkdir -p "$HOME/.claude/skills"
  git clone https://github.com/blader/humanizer.git "$HOME/.claude/skills/humanizer"
fi

# Install claude-mem if not already present and start the worker
if ! command -v claude-mem &>/dev/null; then
  npm install -g claude-mem
  claude-mem install
fi
npx claude-mem start &
