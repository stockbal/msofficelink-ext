# msofficelink-ext
###### _Version 1.3.1_

> Chrome Extension to handle MS Office Document links

## Features

- Enables several options for MS Office Document Links (Word, Excel and Powerpoint)
- Searchable History for opened/handled documents
- Create Favorites
- Overwrite the default action upon link click
- Copy the link to the clipboard
  - the original link (WOPI-Frame is removed)
  - open Excel in Read-Only/Edit mode
  - open Online
- Whitelist/Blacklist feature to activate/deactivate MS Doc Link on certain pages  
  **Note**: This concerns only the following features
  - concrete MS Office Link action (apart from Original)
  - creating a history entry upon clicking on an MS Office Document Link

## Build Setup

``` bash
# install dependencies
npm install

# serve the chrome extension with automatic page reload upon detecting changes
npm run dev

# build for production with minification
npm run build

```
