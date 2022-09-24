let askPathForFileType = (fileExtenstion) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      fileExtenstion: fileExtenstion
    }, 
    function(response) {
      let storageApiRequest = {};
      storageApiRequest["suggestedPath->" + fileExtenstion] = response.path;
      storageCache[`suggestedPath->` + fileExtenstion] = response.path;
      chrome.storage.sync.set(storageApiRequest);
    });
  });
}

chrome.downloads.onDeterminingFilename.addListener(
  (downloadItem, suggest) => {
    let filePath = downloadItem.filename;
    let fileExtenstion = filePath.split(".").at(-1).trim().toLowerCase();
    let fileName = filePath.split("\\").at(-1).trim();
    fetch("config.json")
    .then(response => response.json())
    .then(response => response[fileExtenstion])
    .then(folder => {
      let filenameSuggestion = {
        conflictAction: "uniquify",
        filename: folder + "\\" + fileName,
      }
      console.log(filenameSuggestion); 
      suggest(filenameSuggestion);
    })

    return true;
  }
)

