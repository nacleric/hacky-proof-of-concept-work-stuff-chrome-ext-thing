console.log("content-script is running on notion");

class TextEvent {
    constructor(action, data, blockIndex) {
        this.action = action;
        this.data = data;
        this.blockIndex = blockIndex;
    }
}

let observerOptions = {
    characterData: true,
    childList: true,
    attributes: true,
    subtree: true,
};

let currentSnapshot = [];
let allChanges = [];

function getTextBlocks(currentSnapshot) {
    currentSnapshot = []
    let notionTextBlocks = document.querySelectorAll(".notion-text-block");
    for (let [index, textBlock] of notionTextBlocks.entries()) {
        currentSnapshot.push(textBlock.innerText);
    }
    console.log(currentSnapshot)
}

function callback(mutationList) {
    mutationList.forEach((mutation) => {
        switch (mutation.type) {
            case "characterData":
                if (mutation.target.nodeName === "#text") {
                    console.log("===[LOG] Insert Text===)");
                    getTextBlocks(currentSnapshot)
                    allChanges.push(new TextEvent("insertText", mutation.target.textContent))
                    console.log(allChanges)
                }
                break;
            case "childList":
                if (mutation.target.className === "notion-page-content") {
                    if (mutation.removedNodes.length > 0) {
                        console.log("===[LOG] Deleted Notion Block===")
                        getTextBlocks(currentSnapshot)
                        allChanges.push(new TextEvent("deleteBlock", mutation.target.textContent))
                        console.log(allChanges)
                    } else {
                        console.log("===[LOG] Inserted Notion Block===")
                        getTextBlocks(currentSnapshot)
                        allChanges.push(new TextEvent("insertBlock", mutation.target.textContent))
                        console.log(allChanges)
                    }
                } else if (mutation.target.className === "notranslate") {
                    console.log("===[LOG] Delete Text===");
                    getTextBlocks(currentSnapshot)
                    allChanges.push(new TextEvent("deleteText", mutation.target.textContent))
                    console.log(allChanges)
                }
                break;
        }
    });
}


console.log("Delayed for 3 seconds.");
setTimeout(() => {
    console.log("Extension Loaded")

    let notionPageContent = document.querySelector(".notion-page-content")
    let notionPageContentObserver = new MutationObserver(callback);
    notionPageContentObserver.observe(notionPageContent, observerOptions);
}, "3000");
