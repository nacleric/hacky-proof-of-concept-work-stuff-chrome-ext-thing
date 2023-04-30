console.log("running on gdoc");

async function getGoogleDocument(token) {
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
    console.log(response.json())
}

chrome.storage.local.get(["gdoc"]).then((result) => {
    console.log("Value currently is " + result.gdoc);
    let token = result.gdoc;
    getGoogleDocument(token).catch(error => {
        console.log(error);
    })
});
