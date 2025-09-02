function myFunction() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(copyText.value)
    .then(function() {
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Copied: " + copyText.value;
      console.log("Text copied to clipboard");

      // Reset tooltip text after a delay (e.g., 2 seconds)
      setTimeout(function() {
        tooltip.innerHTML = "Copy to clipboard";
      }, 2000);
    })
    .catch(function(err) {
      console.error("Unable to copy text to clipboard", err);
    });
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}