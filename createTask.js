const firebaseConfig = {
  apiKey: "AIzaSyDepZoaHvu87ZkUv3nKLiqcMOIa1igo068",
  authDomain: "plp-bootcamp.firebaseapp.com",
  projectId: "plp-bootcamp",
  storageBucket: "plp-bootcamp.appspot.com",
  messagingSenderId: "572952880606",
  appId: "1:572952880606:web:85064f68b8373aca40294f",
  measurementId: "G-RW5BYY2CDG",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var totalItems;
var maxCode;
var code;

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
            <button class=" button edit" id="editData" >EDIT TASK</button>
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
