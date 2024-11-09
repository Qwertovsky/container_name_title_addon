# Add container name to title

It is a add-on for Firefox. It adds container name to the end of document title. If you use [Multi-Account Containers](https://support.mozilla.org/en-US/kb/containers?as=u&utm_source=inproduct) and time tracker application, this add-on helps to separate browser activities.

# Install

For Firefox see [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/add_container_name_to_title/)

# How it works

Add-on inject script
```javascript
document.title = document.title + ` [${containerName}]`
```

API is [scripting.executeScript()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/executeScript). This API does not work on some sites (e.g., developer.mozilla.org). The second variant is [windows.update()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows/update). But it adds a string to the beginning of the browser window's title. So it changes the user experience.

The `containerName` is got from [Contextual identities](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities). If tab has no container, `containerName` = `default`.

The add-on listens to events: [tabs.onActivated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onActivated) and [tabs.onUpdated](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated). An active tab switch, a document title change(some sites set title dynamically) and a document status update (wait until tab is loaded).

# Developing

Install [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)
```
npm install --global web-ext
```
Check code
```
web-ext lint
```
Load temporary add-on in browser with containers.

Package
```
web-ext build
```
