var storageCount;
var limit;

$(document).ready(function() {
  jQuery.ajax({
    "type": "GET",
    "url": "data.json",
    success: function(data) {
      if (data) {
        if (typeof(Storage) !== "undefined") {
          var len = data.length;
          for (var i = 0; i < len; i++)
            localStorage.setItem("array_" + i, JSON.stringify(data[i]))
        }
        updateList(10);
      }
    }
  });
});

function updateList(rows) {
  limit = rows > localStorage.length ? localStorage.length : rows;
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
    var current = JSON.parse(localStorage.getItem(localStorage.key(i)));
    html += "<tr id=" + localStorage.key(i) + "><td>" + current.firstname + "</td>" +
      "<td>" + current.lastname + "</td>" +
      "<td>" + current.email + "</td>" +
      "<td>" + current.location + "</td>" +
      "<td>" + current.phone + "</td>" +
      "<td>" + current.current_class + "</td>" +
      "<td>" + current.address.communication + "<br />" +
      current.address.permanent + "</td>" +
      '<td><input type="button" value="Detail" >' +
      '<input type="button" value="Edit" >' +
      '<input type="button" value="Delete" ></td><tr>';
  }
  html += "<table>";
  $("#list").html(html);
}

$('#limitRows').on('change', function() {
  updateList(this.value);
});

$(document).on('click', 'input[class="delete"]', function() {
  localStorage.removeItem($(this).closest('tr').attr("id"));
  updateList($('#limitRows').val());
})