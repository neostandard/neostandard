#!/usr/bin/env bash
set -euo pipefail

manifest_file='.github/release-please/manifest.json'

case "${RELEASE_CHANNEL:-}" in
  stable)
    config_file='.github/release-please/config.json'
    ;;
  prerelease)
    config_file='.github/release-please/config-prerelease.json'
    ;;
  '')
    version=$(jq -er '."."' "$manifest_file")
    if [[ "$version" == *-* ]]; then
      config_file='.github/release-please/config-prerelease.json'
    else
      config_file='.github/release-please/config.json'
    fi
    ;;
  *)
    echo "Unsupported RELEASE_CHANNEL: $RELEASE_CHANNEL" >&2
    exit 1
    ;;
esac

printf 'config_file=%s\n' "$config_file" >> "$GITHUB_OUTPUT"
