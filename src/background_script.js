function changeTitle(currentTab, containerName) {
    const currentTitle = currentTab.title;
    if (currentTitle.indexOf(containerName) >= 0) {
        return;
    }
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
            // console.log('title was modified');
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

function getContainerName(cookieStoreId) {
    if (!browser.contextualIdentities) {
        // containers are not activated
        return;
    }
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
            // tab from another window
            return;
        }
        onTab(currentTab);
    });
}

function tabActivated(activeInfo) {
	onWindow(activeInfo.windowId);
}

function tabUpdated(tabId, changeInfo, currentTab) {
    onTab(currentTab);
}

if (!browser.contextualIdentities) {
    // containers are not activated
} else {
    browser.tabs.onActivated.addListener(tabActivated);
    browser.tabs.onUpdated.addListener(tabUpdated, {
        properties: ['status', 'title']
    });
}


