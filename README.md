# SHOW/HIDE BITBUCKET PR COMMENTS

Make Pull request in Bitbucket easier to read

Functionality:
- Inject function to toggle comments when click on Comment's Time
- Inject Copy to Clipboard button which copy comment content to clipboard
- Automatically applies the hide/show settings when new comments appear

Limitations:
- The extension only runs after you click the extension icon on a pull request page.

## Install
- Download/Clone the repo 
- Go to Manage Extensions page, click on Load unpacked button, select the directory of downloaded/cloned repo

## Usage
Click the extension button once on a pull request page.
The extension injects the show/hide and copy features, and keeps applying the
configured visibility settings as new comments are added.
Click on a comment's timestamp to show/hide it.

## Settings
By default, extension hide all comments except the last comment. However, it can be modified. By right click on the extension icon, choose Options, you will be redirected to settings page. Input the desired number of recent comments to show and click on Save.