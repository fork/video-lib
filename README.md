# VideoLib

Helper methods for HTML video playback.

This library helps you on problems occuring when implementing custom HTML5 video players. In particular, it has helper methods to:

-   Use movingimage with HLS as source, with fallback for non-HLS-compatible browsers
-   Apply custom CSS style to subtitles
-   Emulating `object-fit: cover;` with Internet Explorer support
-   Waiting for a video to become ready

Please take a look at the JSDoc of each method for further information.

## Tricks

-   Some browsers do not accept `<track kind="subtitles">` to be `mode="hidden"`. Use `kind="metadata"` instead.

## Creating a release

Certain steps need to be done in order to create a new release:

1. Decide on a [semver](https://semver.org/spec/v2.0.0.html) version number
1. Start a new release using `git flow release start [version number]`
1. Update the `package.json` version
1. Update the `CHANGELOG.md`
1. Commit changes: `git commit -a -m "Prepare release [version number]"`. This should automatically update `dist/index.js`
1. Finish release using `git flow release finish`
1. Push all changes: `git push origin --all`
