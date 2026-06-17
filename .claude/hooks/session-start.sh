#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install humanizer skill if not already present
if [ ! -d "$HOME/.claude/skills/humanizer" ]; then
  mkdir -p "$HOME/.claude/skills"
  git clone https://github.com/blader/humanizer.git "$HOME/.claude/skills/humanizer"
fi
