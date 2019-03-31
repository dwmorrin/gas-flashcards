[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)
# Google Apps Script Flash Cards
Flash cards displayed in a web app, using Google Sheets for storage.

## Features
- Creates the Google Sheet used for storage automatically, using the [PropertiesService](https://developers.google.com/apps-script/reference/properties/properties-service)
to store the generated sheet info per user.
- [google.script.history](https://developers.google.com/apps-script/guides/html/reference/history)
to control the back button.
- Client-side JavaScript includes helper function to render underscores as subscripts
and carets as superscripts (essential for chemistry flash cards).

## Notes on installing
I recommend getting [clasp](https://github.com/google/clasp) which works well with git.
This is meant to be deployed as a [web app](https://developers.google.com/apps-script/guides/web).
