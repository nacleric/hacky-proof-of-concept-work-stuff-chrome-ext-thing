console.log("running on gdoc");

let token = "";

class Snapshot {
    constructor(data, time) {
        this.data = data;
        this.time = time;
    }
}

async function getGoogleDocument() {
    const response = await fetch(
        "https://docs.googleapis.com/v1/documents/1zaLaPwcU_ZypiadBbp4Js7FFTpywY0E7UEY6Sl48ewc",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.json();
}

function parseBody(bodyContent) {
    let body = "";
    bodyContent.forEach((l) => {
        if (l.paragraph) {
            l.paragraph.elements.forEach((el) => {
                body += el.textRun.content;
            });
        }
    });
    return body;
}

function createSnapshot(isManual) {
    getGoogleDocument().then((document) => {
        let body = parseBody(document.body.content);
        console.log(new Snapshot(body, new Date(), isManual));
    });
}

function main() {
    let keyPressQueue = [];
    let editingIFrame = document.querySelector(
        ".docs-texteventtarget-iframe"
    );
    editingIFrame.contentDocument.addEventListener("keydown", function (event) {
        if (event) {
            keyPressQueue.push(event.key.toLowerCase())
        }

        if (keyPressQueue.length > 2) {
            keyPressQueue.shift()
        }

        if (keyPressQueue[0] === "meta" && keyPressQueue[1] === "v") {
            console.log("copypasted mac");
        } else if (keyPressQueue[0] === "control" && keyPressQueue[1] === "v") {
            console.log("copypasted windows")
        }
        console.log(keyPressQueue)
    });

    chrome.storage.local.get(["gdoc"]).then((result) => {
        console.log("Value currently is " + result.gdoc);
        token = result.gdoc;

        setInterval(createSnapshot, 5000);
    });
}

main();
