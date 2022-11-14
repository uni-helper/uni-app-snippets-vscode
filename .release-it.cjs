module.exports = {
  "git": {
    "commitMessage": "chore(release): v${version}",
    "tagName": "v${version}"
  },
  "npm": {
    "publish": false,
    "timeout": 30
  },
  "hooks": {
    "after:bump": "tsx ./scripts/generate.ts && vsce package && vsce publish -p $VSCE_PAT && ovsx publish -p $OVSX_PAT"
  }
}
