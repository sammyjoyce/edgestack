#!/bin/sh
# Husky shell script
if [ -z "$husky_skip_init" ]; then
  hook_name="$(basename "$0")"
  if [ "$HUSKY" = "0" ]; then
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    . ~/.huskyrc
  fi
fi
