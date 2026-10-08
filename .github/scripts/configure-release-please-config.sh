#!/usr/bin/env bash
set -euo pipefail

config_file='.github/release-please/config.json'
manifest_file='.github/release-please/manifest.json'
output_file='.github/release-please/config.generated.json'

case "${RELEASE_CHANNEL:-}" in
  stable)
    prerelease=false
    ;;
  prerelease)
    prerelease=true
    ;;
  '')
    version=$(jq -er '."."' "$manifest_file")
    if [[ "$version" == *-* ]]; then
      prerelease=true
    else
      prerelease=false
    fi
    ;;
  *)
    echo "Unsupported RELEASE_CHANNEL: $RELEASE_CHANNEL" >&2
    exit 1
    ;;
esac

jq --argjson prerelease "$prerelease" \
  --arg prerelease_type "${RELEASE_PRERELEASE_TYPE:-next}" \
  'if $prerelease then
     .prerelease = true | .["prerelease-type"] = $prerelease_type | .versioning = "prerelease"
   else
     del(.prerelease, .["prerelease-type"], .versioning)
   end' \
  "$config_file" > "$output_file"
