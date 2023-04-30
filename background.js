console.log("in the background");
chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
    console.log(token);
    chrome.storage.local.set({ "gdoc": token }).then(() => {
        console.log("Value is set to " + token);
    });
  });