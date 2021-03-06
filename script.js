var storageLength;
var storageCount;
var limitPrev;
var limitNow;
var students;

//student object
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

//read data
$(document).ready(function() {
  limitPrev = 10;
  if(localStorage.getItem("students") === null) {
    jQuery.ajax({
      "type": "GET",
      "url": "data.json",
      success: function(data) {
        if (data) {
          if (typeof(Storage) !== "undefined") {
            var storageLength = data.length;
            localStorage.setItem("students", JSON.stringify(data));
            updateList(limitPrev);
          }
        }
      }
    });
  }else {
    students = JSON.parse(localStorage.getItem("students"));
    updateList(limitPrev);
  }
});

//refresh list
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
  
  $("#outOfRecord").hide();
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

//add student event
$(document).on('click', 'input[id="addNew"]', function() {      
  $("#addNewForm").toggle();
  $("#myForm").css("display", "block");
  $("#submit").attr("value", "Add");
})

//add button event
$(document).on('click', 'input[value="Add"]', function() {      
  submitAddNewForm();
  $("#myForm").css("display", "none");
  $("#addNewForm").toggle();
  clearBox();
  updateList($('#limitRows').val())
});

//edit button event
$(document).on('click', 'input[class="edit"]', function() {     
  var id = $(this).closest('tr').attr("id");
  $("#editForm").toggle();
  $("#myForm").css("display", "block");
  $("#submit").attr("value", "Update");
  $("#submit").attr("class", id);
  fetchStudent(id);
})

//update button event
$(document).on('click', 'input[value="Update"]', function() { 
  var id = $(this).attr("class");
  submitEditForm(Number(id))
  $("#myForm").css("display", "none");
  $("#editForm").toggle();
  clearBox();
  updateList($('#limitRows').val())
});

//delete button event
$(document).on('click', 'input[class="delete"]', function() {    
  var row = $(this).closest('tr');
  var id = row.attr("id");
  if (row.next().attr("class") == "detailRow") {      //remove detail row
    row.next().remove();
  }
  row.remove(); //remove row
  reorganizeRow(Number(id) + 1); //reorganize row id
  students = JSON.parse(localStorage.getItem("students"));
  students.splice(id, 1); //delete student from object array
  appendRow($('#limitRows').val() - 1); //append row to the last
  updateStorage(students); //udpdate localStorage
});

$(document).on('click', 'input[id="cancel"]', function() {
  $("#myForm").css("display", "none");
  $("#editForm").hide();
  $("#addNewForm").hide();
  clearBox();
});

//search event
$("#search").keyup(function() {                         
  if($(this).val().length !== 0) {
    var keyword = $(this).val();
    $("#print").remove();
    students = JSON.parse(localStorage.getItem("students"));
    searchList(keyword.toLowerCase());
  }else {
    updateList($('#limitRows').val());
  }
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

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(ev.target.value.length == 0) {
      ev.target.value += data;
    } else
      ev.target.value += "," + data;
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function searchList(keyword) {
  html = '<table id="print">';
  html += "<tr><th>Firstname</th>" +
    "<th>Lastname</th>" +
    "<th>Email</th>" +
    "<th>Location</th>" +
    "<th>Phone</th>" +
    "<th>Current Class</th>" +
    "<th>Address</th>" +
    "<th>Option</th></tr>";
  for (var i = 0; i < students.length; i++) {
    var current = students[i];
    if(current.firstname.toLowerCase().includes(keyword) ||
       current.lastname.toLowerCase().includes(keyword) ||
      current.current_class.toString().toLowerCase().includes(keyword) ||
       current.location.toString().toLowerCase().includes(keyword) ||
       current.phone.toLowerCase().includes(keyword)){
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
  }
  html += "<table>";
  $("#list").html(html);
}

function updateStorage(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
    students = JSON.parse(localStorage.getItem("students"));
    if(students.length != limitPrev){
      appendRow(limitPrev++);
    }else {
      $("#outOfRecord").show();
    }
  }
});

