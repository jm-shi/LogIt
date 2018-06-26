window.onload = function() {
    document.getElementById("signout").addEventListener("click", logout);
    document.getElementById("createbtn").addEventListener("click", createTask);
    document.getElementById("hamburger").addEventListener("click", toggleSidebar);
    document.getElementsByClassName("close")[0].addEventListener("click", close);
    window.addEventListener("click", closeOutside);

    (document.getElementById("todo") !== null) ? document.getElementById("todo").addEventListener("click", viewTodo) : "";
    (document.getElementById("completed") !== null) ? document.getElementById("completed").addEventListener("click", viewCompleted) : "";
}

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "index.html";
    }).catch(function(error) {
        alert(error);
    });
}

function createTask() {
    window.location.href = "createTask.html";
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

function close() {
    document.getElementById("modal").style.display = "none";
}

function closeOutside(e) {
    if (e.target === modal) {
        document.getElementById("modal").style.display = "none";
    }
}

function viewTodo() {
    window.location.href = "home.html";
}

function viewCompleted() {
    window.location.href = "completed.html";
}

function revise(taskID, type) {
    var title = document.getElementById("title").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var description = document.getElementById("description").value;
    
    if (title === "") {
        alert("Please enter a title.");
        return;
    }
    if (date === "") {
        alert("Please enter a date.");
        return;
    }
    if (time === "") {
        alert("Please enter a time.");
        return;
    }

    var timestamp = Date.parse(date + " " + time)/1000;
    if (timestamp === undefined || timestamp === "") timestamp = 0;
    var user = firebase.auth().currentUser;

    database.collection("users").doc(user.uid).collection(type).doc(taskID).set({
        title: title,
        date: date,
        time: time,
        description: description,
        timestamp: timestamp
    }).then(function() {
        document.getElementsByClassName("modal-list")[0].innerHTML = "";
        location.reload();
    }).catch(function(error) {
        console.log("Error: " + error);
    });
}

function editTask(clickedID, type) {
    var taskID = clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    var date, time, description, timestamp, title;
    document.getElementById("modal").style.display = "block";
    database.collection("users").doc(userID).collection(type).doc(taskID).get().then(function(doc) {
        if (doc.exists) {
            date = doc.data().date;
            description = doc.data().description;
            time = doc.data().time;
            title = doc.data().title; 
            titleArr = title.split(" "); // Ensures the displayed title includes words after spaces

            var info = `<label for=title>Title</label>
                        <input type=text id=title name=title placeholder='Enter a title' value=${titleArr.join("&nbsp;")}><br>
                        <label for=date>Date</label>
                        <input type=date id=date name=date placeholder='Enter a date' value=${date}><br>
                        <label for=time>Time</label>
                        <input type=time id=time name=time placeholder='Enter a time' value=${time}><br>
                        <label for=description>Description</label>
                        <textarea id=description name=description placeholder='Enter a description' value=${description}></textarea><br>
                        <button id=revise onclick="revise( '${taskID}', '${type}' )">Revise</button>`;

            document.getElementsByClassName("modal-list")[0].innerHTML = info;
        }
    })
}

function deleteTask(clickedID, type) {
    var taskID = clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    database.collection("users").doc(userID).collection(type).doc(taskID).delete()
    .then(function() {
        console.log("Successfully deleted document");
        document.getElementById(taskID).style.display = "none";
    }).catch(function(error) {
        console.log("Error removing document: ", error);
    });
}
