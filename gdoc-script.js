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

function createSnapshot() {
    getGoogleDocument().then((document) => {
        let body = parseBody(document.body.content);
        console.log(new Snapshot(body, new Date()));
    });
}

function main() {
    // FIFO
    let checkCopypaste = [];
    let editingIFrame = document.querySelector(
        ".docs-texteventtarget-iframe"
    );
    editingIFrame.contentDocument.addEventListener("keydown", function(event) {
        console.log(event)
    });

    // document.addEventListener("keypress", function(event) {
    //     console.log(event)
    // });

    chrome.storage.local.get(["gdoc"]).then((result) => {
        console.log("Value currently is " + result.gdoc);
        token = result.gdoc;

        setInterval(createSnapshot, 5000);
    });
}

main();
