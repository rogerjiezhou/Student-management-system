var storageSize;
var limit;

$(document).ready(function() {
  jQuery.ajax({
    "type": "GET",
    "url": "data.json",
    success: function(data) {
      if (data) {
        if (typeof(Storage) !== "undefined") {
          var len = data.length;
          storageSize = len;
          for (var i = 0; i < len; i++)
            localStorage.setItem("array_" + i, JSON.stringify(data[i]))
        }
        updateList(10);
      }
    }
  });
});