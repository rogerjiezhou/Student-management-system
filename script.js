var storageCount;
var limit;
var students;

$(document).ready(function() {
  jQuery.ajax({
    "type": "GET",
    "url": "data.json",
    success: function(data) {
      if (data) {
        if (typeof(Storage) !== "undefined") {
          var len = data.length;
          localStorage.setItem("students", JSON.stringify(data));
          students = JSON.parse(localStorage.getItem("students"));
          updateList(10);
        }
      } 
    }
  });
});

function updateList(rows) {
  limit = rows > students.length ? students.length : rows;
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
    var current = students[i];
    html += "<tr id=" + i + "><td>" + current.firstname + "</td>" +
      "<td>" + current.lastname + "</td>" +
      "<td>" + current.email + "</td>" +
      "<td>" + current.location + "</td>" +
      "<td>" + current.phone + "</td>" +
      "<td>" + current.current_class + "</td>" +
      "<td>" + current.address.communication + "<br />" +
      current.address.permanent + "</td>" +
      '<td><input type="button" value="Detail" class="detail">' +
      '<input type="button" value="Edit" class="edit" >' +
      '<input type="button" value="Delete" class="delete" ></td><tr>';
  }
  html += "<table>";
  $("#list").html(html);
}

$('#limitRows').on('change', function() {
  updateList(this.value);
});

$(document).on('click', 'input[class="detail"]', function() {
  $("#myForm").css("display", "block");
  var userKey = $(this).closest('tr').attr("id");
  fetchUser(userKey);
  disableInput();
})

$(document).on('click', 'input[value="Close"]', function() {
    $("#myForm").css("display", "none");
    // $(this).closest('tr').attr("id");
  })
  // $(document).on('click', 'input[class="edit"]', function() {
  //   $(this).closest('tr').attr("id");
  // })

$(document).on('click', 'input[class="delete"]', function() {
  localStorage.removeItem($(this).closest('tr').attr("id"));
  updateList($('#limitRows').val());
})

function fetchUser(userKey) {
  var user = JSON.parse(localStorage.getItem(userKey));
  $("#firstname").val(user.firstname);
  $("#lastname").val(user.lastname);
  $("#email").val(user.email);
  $("#location").val(user.location);
  $("#phone").val(user.phone);
  $("#currentClass").val(user.current_class);
  $("#address").val(user.address);
  $("#marks").val(user.marks);
}

function disableInput() {
  $("#firstname").prop('disabled', true);
  $("#lastname").prop('disabled', true);
  $("#email").prop('disabled', true);
  $("#location").prop('disabled', true);
  $("#phone").prop('disabled', true);
  $("#currentClass").prop('disabled', true);
  $("#address").prop('disabled', true);
  $("#marks").prop('disabled', true);
}
