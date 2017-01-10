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

function updateList(rows) {
  limit = rows > storageSize ? storageSize : rows;
  html = '<table id="print">';
  html += "<tr><th>Firstname</th>" +
    "<th>Lastname</th>" +
    "<th>Email</th>" +
    "<th>Location</th>" +
    "<th>Phone</th>" +
    "<th>Current Class</th>" +
    "<th>Address</th>" +
    "<th>Option</th></tr>";
  for (var i = 0; i < limit; i++) {
    var current = JSON.parse(localStorage.getItem("array_" + i));
    html += "<tr><td>" + current.firstname + "</td>" +
      "<td>" + current.lastname + "</td>" +
      "<td>" + current.email + "</td>" +
      "<td>" + current.location + "</td>" +
      "<td>" + current.phone + "</td>" +
      "<td>" + current.current_class + "</td>" +
      "<td>" + current.address.communication + "<br />" +
      current.address.permanent + "</td><tr>";
  }
  html += "<table>";
  $("#list").html(html);
}

$('#limitRows').on('change', function() {
  updateList(this.value);
});