var storageLength;
var storageCount;
var limitPrev;
var limitNow;
var students;
var table = $("#print");


function student(fn, ln, email, loc, phone, cc, addressCommu,
  addressPerm, marks1, marks2, marks3, marks4) {
  this.firstname = fn;
  this.lastname = ln;
  this.email = email;
  this.location = loc;
  this.phone = phone;
  this.current_class = cc;
  this.address = {
    communication: addressCommu,
    permanent: addressPerm
  };
  this.marks = {
    english: marks1,
    science: marks2,
    computers: marks3,
    hardware: marks4
  }
}

$(document).ready(function() {
  jQuery.ajax({
    "type": "GET",
    "url": "data.json",
    success: function(data) {
      if (data) {
        if (typeof(Storage) !== "undefined") {
          var storageLength = data.length;
          console.log(storageLength);
          localStorage.setItem("students", JSON.stringify(data));
          limitPrev = 10;
          updateList(limitPrev);
        }
      }
    }
  });
});

function updateList(rows) {
  students = JSON.parse(localStorage.getItem("students"));
  var limit = rows > students.length ? students.length : rows;
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
      "<td>" + current.location.toString() + "</td>" +
      "<td>" + current.phone + "</td>" +
      "<td>" + current.current_class + "</td>" +
      "<td>" + current.address.communication + "<br />" +
      current.address.permanent + "</td>" +
      '<td><input type="button" value="Detail" class="detail">' +
      '<input type="button" value="Edit" class="edit" >' +
      '<input type="button" value="Delete" class="delete" ></td></tr>';
  }
  html += "<table>";
  $("#list").html(html);
}

$('#limitRows').on('change', function() {
  limitNow = this.value;

  limitNow = Number(limitNow);
  limitPrev = Number(limitPrev);

  if (limitNow > limitPrev) { //append rows
    while (limitPrev < limitNow) {
      appendRow(limitPrev++);
    }
  } else {
    while (limitPrev > limitNow) { //delete rows       
      limitPrev--;
      $("#" + limitPrev).remove();
      $("#detailRow" + limitPrev).remove();
    }
  }
  limitPrev = limitNow;
});

$(document).on('click', 'input[class="detail"]', function() {
  var row = $(this).closest('tr');
  var id = row.attr("id");
  if (row.next().attr("class") == "detailRow") {
    row.next().remove();
  } else {
    row.after('<tr id="detailRow' + id + '" class= "detailRow"><td colspan="100%">' +
      '<label class="title">English</label>' +
      '<input type="text" id="row' + id + 'mark1" disabled="true">' +
      '<label class="title">Science</label>' +
      '<input type="text" id="row' + id + 'mark2" disabled="true">' +
      '<label class="title">Computer</label>' +
      '<input type="text" id="row' + id + 'mark3" disabled="true">' +
      '<label class="title">Hardwares</label>' +
      '<input type="text" id="row' + id + 'mark4" disabled="true"></td></tr>');
    students = JSON.parse(localStorage.getItem("students"));
    $("#row" + id + "mark1").val(students[id].marks.english);
    $("#row" + id + "mark2").val(students[id].marks.science);
    $("#row" + id + "mark3").val(students[id].marks.computers);
    $("#row" + id + "mark4").val(students[id].marks.hardware);
  }
});

$(document).on('click', 'input[id="addNew"]', function() {
  $("#addNewForm").toggle();
  $("#myForm").css("display", "block");
  $("#submit").attr("value", "Add");
})

$(document).on('click', 'input[value="Add"]', function() {
  submitAddNewForm();
  $("#myForm").css("display", "none");
  $("#addNewForm").toggle();
  clearBox();
  updateList($('#limitRows').val())
});

$(document).on('click', 'input[class="edit"]', function() {
  var id = $(this).closest('tr').attr("id");
  $("#editForm").toggle();
  $("#myForm").css("display", "block");
  $("#submit").attr("value", "Update");
  $("#submit").attr("class", id);
  fetchStudent(id);
})

$(document).on('click', 'input[value="Update"]', function() {
  var id = $(this).attr("class");
  submitEditForm(Number(id))
  $("#myForm").css("display", "none");
  $("#editForm").toggle();
  clearBox();
  updateList($('#limitRows').val())
});


$(document).on('click', 'input[class="delete"]', function() {
  var row = $(this).closest('tr');
  var id = row.attr("id");
  if (row.next().attr("class") == "detailRow") { //remove detail row
    row.next().remove();
  }
  row.remove(); //remove row
  reorganizeRow(Number(id) + 1); //reorganize row id
  students = JSON.parse(localStorage.getItem("students"));
  students.splice(id, 1); //delete student from object array
  appendRow($('#limitRows').val() - 1); //append row to the last
  updateStorage(students); //udpdate localStorage
});

function appendRow(rowId) {
  var current = students[rowId];
  $("#print").append(
    "<tr id=" + rowId + "><td>" + current.firstname + "</td>" +
    "<td>" + current.lastname + "</td>" +
    "<td>" + current.email + "</td>" +
    "<td>" + current.location + "</td>" +
    "<td>" + current.phone + "</td>" +
    "<td>" + current.current_class + "</td>" +
    "<td>" + current.address.communication + "<br />" +
    current.address.permanent + "</td>" +
    '<td><input type="button" value="Detail" class="detail">' +
    '<input type="button" value="Edit" class="edit" >' +
    '<input type="button" value="Delete" class="delete" ></td></tr>');
}

function reorganizeRow(id) {
  var last = $('#limitRows').val();
  while (id < last) {
    $("#" + id).attr("id", id - 1);
    id++;
  }
}

function fetchStudent(id) {
  students = JSON.parse(localStorage.getItem("students"));
  $("#firstname").val(students[id].firstname);
  $("#lastname").val(students[id].lastname);
  $("#email").val(students[id].email);
  $("#location").val(students[id].location);
  $("#phone").val(students[id].phone);
  $("#currentClass").val(students[id].current_class);
  $("#addressCommu").val(students[id].address.communication);
  $("#addressPerm").val(students[id].address.permanent);
  $("#marks1").val(students[id].marks.english);
  $("#marks2").val(students[id].marks.science);
  $("#marks3").val(students[id].marks.computers);
  $("#marks4").val(students[id].marks.hardware);
}

function clearBox() {
  $("#firstname").val("");
  $("#lastname").val("");
  $("#email").val("");
  $("#location").val("");
  $("#phone").val("");
  $("#currentClass").val("");
  $("#addressCommu").val("");
  $("#addressPerm").val("");
  $("#marks1").val("");
  $("#marks2").val("");
  $("#marks3").val("");
  $("#marks4").val("");
}

function submitEditForm(id) {
  var loc = $("#location").val();
  var location = loc.split(",");
  var newStudent = new student($("#firstname").val(), $("#lastname").val(),
    $("#email").val(), location,
    $("#phone").val(), $("#currentClass").val(),
    $("#addressCommu").val(), $("#addressPerm").val(),
    $("#marks1").val(), $("#marks2").val(),
    $("#marks3").val(), $("#marks4").val());
  students = JSON.parse(localStorage.getItem("students"));
  students[id] = newStudent;
  updateStorage(students);
}

function submitAddNewForm(id) {
  var loc = $("#location").val();
  var location = loc.split(",");
  var newStudent = new student($("#firstname").val(), $("#lastname").val(),
    $("#email").val(), location,
    $("#phone").val(), $("#currentClass").val(),
    $("#addressCommu").val(), $("#addressPerm").val(),
    $("#marks1").val(), $("#marks2").val(),
    $("#marks3").val(), $("#marks4").val());
  students = JSON.parse(localStorage.getItem("students"));
  students.push(newStudent);
  updateStorage(students);
}

function updateStorage(students) {
  localStorage.setItem("students", JSON.stringify(students));
}