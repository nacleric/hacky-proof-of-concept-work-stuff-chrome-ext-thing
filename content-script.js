console.log("content-script is running on notion");

class Events {
    constructor(action, index, data) {
        this.action = action;
        this.index = index;
        this.data = data;
    }
}

let observerOptions = {
    characterData: true,
    attributes: true,
    childList: true,
    subtree: true,
};

function callback(mutationList, observer) {
    mutationList.forEach((mutation) => {
        switch (mutation.type) {
            case "characterData":
                console.log("characterData changed");
                console.log(mutation);
                break;
            case "childList":
                console.log("childList changed");
                console.log(mutation);
                break;
        }
    });
}

let allText = "";

console.log("Delayed for 5 seconds.");
setTimeout(() => {
    // Try out notion-selectable
    // let notionTextBlocks = document.querySelectorAll(".notion-selectable");

    let notionTextBlocks = document.querySelectorAll(".notion-text-block");
    console.log(notionTextBlocks);
    for (let textBlock of notionTextBlocks) {
        console.log(textBlock);
        allText += textBlock.innerText;
    }
    console.log(allText);

    let observer = new MutationObserver(callback);
    observer.observe(notionTextBlocks[notionTextBlocks.length - 1], observerOptions);
}, "5000");
