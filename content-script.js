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

let changelog = [];

function callback(mutationList) {
    mutationList.forEach((mutation) => {
        switch (mutation.type) {
            case "characterData":
                if (mutation.target.nodeName === "#text") {
                    console.log("characterData changed (insert text)");
                    changelog.push(new TextEvent("insert", mutation.target.textContent))
                    console.log(changelog)
                    console.log(mutation.target)
                }
                break;
            case "childList":
                if (mutation.target.className === "notion-page-content") {
                    console.log("add or deleted notion Block")
                } else if (mutation.target.className === "notranslate") {
                    console.log("childList changed (delete text)");
                    console.log(mutation);
                    changelog.push(new TextEvent("delete", mutation.target.textContent))
                    console.log(changelog)
                }
                break;
            case "subtree":
                console.log("subtree triggered");
                console.log(mutation);
                break;
        }
    });
}

let allText = [];
let allNotionBlockObservers = [];

console.log("Delayed for 3 seconds.");
setTimeout(() => {
    let notionPageContent = document.querySelector(".notion-page-content")
    console.log("in here")
    console.log(notionPageContent)
    let notionPageContentObserver = new MutationObserver(callback);
    notionPageContentObserver.observe(notionPageContent, observerOptions);
}, "3000");


function foobar() {
    let notionTextBlocks = document.querySelectorAll(".notion-text-block");
    console.log(notionTextBlocks);
    for (let [index, textBlock] of notionTextBlocks.entries()) {
        console.log(textBlock);
        allText.push(textBlock.innerText);

        let notionBlockObserver = new MutationObserver(callback);
        allNotionBlockObservers.push(notionBlockObserver);
        notionBlockObserver.observe(notionTextBlocks[index], observerOptions);
    }
    console.log(allText)
    console.log(allNotionBlockObservers);
}