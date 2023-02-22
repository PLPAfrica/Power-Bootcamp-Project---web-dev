const firebaseConfig = {
  apiKey: "AIzaSyBEC8nZF1gLS8mEJiNfpxyiLfC79JqXkA0",
  authDomain: "task-man-c7972.firebaseapp.com",
  projectId: "task-man-c7972",
  storageBucket: "task-man-c7972.appspot.com",
  messagingSenderId: "1047263220371",
  appId: "1:1047263220371:web:1b0b88233ba16509e4b366",
  measurementId: "G-9VR0K26NHG",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var totalItems;
var maxCode;
var code;

//change the color and disabled attribute for edit button
// show or hide the innerHTML of element with status id
function changeStatus(code) {
  var status;
  firebase
    .database()
    .ref("TaskList/" + code)
    .on("value", function (snapshot) {
      status = snapshot.val().status;
    });

  if (status === "pending") {
    firebase
      .database()
      .ref("TaskList/" + code)
      .update({
        status: "completed",
      });
    document.getElementById(code).querySelector("#done").style.color =
      "#00b200";
    document.getElementById(code).querySelector("#editbtn").disabled = true;
    document
      .getElementById(code)
      .querySelector("#editbtn").style.backgroundColor =
      "rgba(116, 116, 116, 0.671)";
    document.getElementById(code).querySelector("#status").innerHTML = `
            <i class="far fa-check-circle"></i> Completed
            `;
  } else {
    firebase
      .database()
      .ref("TaskList/" + code)
      .update({
        status: "pending",
      });
    document.getElementById(code).querySelector("#done").style.color = "gray";
    document.getElementById(code).querySelector("#editbtn").disabled = false;
    if (
      document.getElementById(code).querySelector("#editbtn").style
        .removeProperty
    ) {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeProperty("background-color");
    } else {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeAttribute("background-color");
    }
    document.getElementById(code).querySelector("#status").innerHTML = "";
  }
}

function storeTask(event) {
  event.preventDefault();

  var task = document.getElementById("task").value;
  var desc = document.getElementById("desc").value;
  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";

  //  store data to firebase

  firebase
    .database()
    .ref("TaskList/" + code)
    .set({
      task: task,
      desc: desc,
      status: "pending",
    });

  document.getElementById("tasks-header").insertAdjacentHTML(
    "afterend",

    `
        <div class="Task-item" id="${code}">
          <div class="data" id="${task}" >
            <button class="done" id="done" onclick="changeStatus('${code}')" > <i class="far far-check-circle"></i> </button>
            <h2 class="Task">${task}</h2>
            <p class="desc">${desc}</p>
            <p id="status"></p>
          </div>
          <hr>
          <div class="buttons">
            <button class=" button edit" id="editData" onclick = "editData('${code}')" >EDIT TASK</button>
            <button class=" button delete" id="deleteData" onclick="deleteData('${code}')"  >DELETE TASK</button>
          </div>
        </div>
      `
  );
}

function deleteData(code) {
  firebase
    .database()
    .ref("TaskList/" + code)
    .remove();
  document.getElementById(code).remove();

  firebase
    .database()
    .ref("TotalTasks")
    .update({
      totalItems: totalItems - 1,
    });
}

// Edit Task

function editData(c) {
  document.getElementById("task").value = document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".Task").innerHTML;

  document.getElementById("desc").value = document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".desc").innerHTML;

  if (document.getElementById("addTask") !== null) {
    document.getElementById("addTask").remove();
  }
  document.getElementById("form-btns").innerHTML = `
    <button class="button update" id = "updateTask" onclick = "updateData('${c}')">󠀫󠀫<i class="fas fa-sync-alt"></i> UPDATE TASK</button>
    <button class="button cancel" id = "cancelTask" onclick = "cancelUpdation()"><i class="fas fa-ban"></i> CANCEL</button>
    `;
}

// Update Data and clear cancel and update task buttons

function updateData(c) {
  var updateTask = document.getElementById("task").value;
  var updateDesc = document.getElementById("desc").value;

  firebase
    .database()
    .ref("TaskList/" + c)
    .update({
      task: updateTask,
      desc: updateDesc,
    });

  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("updateTask").remove();
  document.getElementById("cancelTask").remove();

  document.getElementById("form-btns").innerHTML = `
  <button type="submit" class="button add" id = "addTask" >󠀫󠀫<i class="fas fa-plus"></i> ADD TASK</button>
  `;

  // Updating the task in the side bar
  document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".Task").innerHTML = updatedTask;
  document
    .getElementById(c)
    .querySelector(".data")
    .querySelector(".desc").innerHTML = updatedDesc;
}

function cancelUpdation() {
  document.getElementById("task").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("updateTask").remove();
  document.getElementById("cancelTask").remove();

  document.getElementById("form-btns").innerHTML = `
  <button type="submit" class="button add" id = "addTask" >󠀫󠀫<i class="fas fa-plus"></i> ADD TASK</button>
  `;
}

var data;
firebase
  .database()
  .ref("TaskList")
  .on("value", function (snapshot) {
    data = snapshot.val();
  });

// Show All Functionality
function showAll() {
  if (data === null && document.getElementById("info") == null) {
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="no-task-info" id = "info">
            <i class="fas fa-info-circle"></i>
            No pending tasks
        </div>`
    );
  }

  for (code in data) {
    var code = code;
    var task = data[code]["task"];
    var desc = data[code]["desc"];
    var status = data[code]["status"];

    var color;
    if (status === "pending") {
      color = "gray";
    } else {
      color = "#00b200";
    }
  }
  // Show the data in the body in form of card
  document.getElementById("tasks-header").insertAdjacentHTML(
    "afterend",
    `<div class="Task-item" id="${code}">
      <div class="data" id="${task}">
          
          <h2 class="Task">${task}</h2>
          <p class="desc">${desc}</p>
          <small id = "status"></small>
      </div>
      <hr>
      <div class="buttons">
          <button class="button edit" id="editbtn" onclick = "editData('${code}')"><i class="fas fa-edit"></i> EDIT TASK</button>
          <button class="button delete" id="deletebtn" onclick = "deleteData('${code}')"><i class="fas fa-trash-alt"></i> DELETE TASK</button>
      </div>
      
      </div>`
  );

  if (status === "pending") {
    document.getElementById(code).querySelector("#editbtn").disabled = false;
    if (
      document.getElementById(code).querySelector("#editbtn").style
        .removeProperty
    ) {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeProperty("background-color");
    } else {
      document
        .getElementById(code)
        .querySelector("#editbtn")
        .style.removeAttribute("background-color");
    }
    document.getElementById(code).querySelector("#status").innerHTML = "";
  } else {
    document.getElementById(code).querySelector("#editbtn").disabled = true;
    document
      .getElementById(code)
      .querySelector("#editbtn").style.backgroundColor =
      "rgba(116, 116, 116, 0.671)";
    document.getElementById(code).querySelector("#status").innerHTML = `
          <i class="far fa-check-circle"></i> Completed
          `;
  }
}

// Delete everything in our database
function deleteAll() {
  var option = false;
  if (totalItems === 0 && document.getElementById("info") === null) {
    document.getElementById("tasks-header").insertAdjacentHTML(
      "afterend",
      `<div class="no-task-info" id = "info">
            <i class="fas fa-info-circle"></i>
            No pending tasks
        </div>`
    );
  }

  if (totalItems !== 0) {
    option = confirm(
      "The tasks will be permanently deleted. Do you want to continue?"
    );
    if (option === true) {
      firebase.database().ref("TaskList").remove();
      document.querySelectorAll(".Task-item").forEach((element) => {
        element.remove();
      });
      firebase.database().ref("TotalTasks").update({
        totalItems: 0,
        maxCode: 0,
      });
      document.getElementById("tasks-header").insertAdjacentHTML(
        "afterend",
        `<div class="no-task-info" id = "info">
                <i class="fas fa-info-circle"></i>
                All items deleted
            </div>`
      );
    }
  }
}
