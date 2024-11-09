// Put all the javascript code here, that you want to execute in background.
function changeTitle(currentTab, containerName) {
    
    // browser.windows.update(currentTab.windowId, {titlePreface: '' });
    const currentTitle = currentTab.title;
    if (currentTitle.indexOf(containerName) >= 0) {
        return;
    }
    // const script = `document.title = document.title + ' [${containerName}]'`;
    // browser.tabs.executeScript(currentTab.id, {code: script})
    browser.scripting
    .executeScript({
        target: {
            tabId: currentTab.id,
        },
        args: [containerName],
        func: (containerName) => {
            document.title = document.title + ` [${containerName}]`
        },
    })
    .then((result) => {
        if (result.error) {
            console.error(result.error);
        } else {
            console.log('title was modified');
        }
    })
    .catch((err) => {
        // browser.windows.update(currentTab.windowId, {titlePreface: '[' + containerName + '] ' });
        console.error(err);
    });
}

function getContainerName(cookieStoreId) {
    if (!browser.contextualIdentities) {
        // containers are not activated
        return;
    }
    console.log('cookieStoreId', cookieStoreId);
    return browser.contextualIdentities
    .get(cookieStoreId)
    .then((contextIdentity) => {
        const containerName = contextIdentity.name;
        return containerName;
    })
    .catch((err) => {
        return 'default';
    });
}

function onTab(currentTab) {
    if (currentTab.status == 'loading') {
        // wait for update
        return;
    }
    getContainerName(currentTab.cookieStoreId)
    .then((containerName) => {
        if (!containerName) {
            return;
        }
        changeTitle(currentTab, containerName);
    })
    .catch((err) => {
        console.error(err);
    });
}

function onWindow(windowId) {
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        const currentTab = tabs[0];
        if (windowId != currentTab.windowId) {
            console.log('tab from another window ' + currentTab.title);
            return;
        }
        onTab(currentTab);
    });
}

function tabActivated(activeInfo) {
    console.log('tab activated');
	onWindow(activeInfo.windowId);
}

function tabUpdated(tabId, changeInfo, currentTab) {
    console.log('tab updated', changeInfo);
    onTab(currentTab);
}

function windowFocused(windowId) {
    if (windowId < 0) {
        return;
    }
    console.log('window focused');
    onWindow(windowId);
}

if (!browser.contextualIdentities) {
    // containers are not activated
} else {
    browser.tabs.onActivated.addListener(tabActivated);
    browser.tabs.onUpdated.addListener(tabUpdated, {
        properties: ['status', 'title']
    });
    // browser.windows.onFocusChanged.addListener(windowFocused);
}


