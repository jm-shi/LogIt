window.onload = function() {
    document.getElementById("signout").addEventListener("click", logout);
    document.getElementById("createbtn").addEventListener("click", displayCreateScreen);
    document.getElementById("hamburger").addEventListener("click", toggleSidebar);

    document.getElementsByClassName("close")[0].addEventListener("click", close);
    document.getElementsByClassName("close")[1].addEventListener("click", close);
    window.addEventListener("click", closeOutside);

    (document.getElementById("todo") !== undefined) ? document.getElementById("todo").addEventListener("click", viewTodo) : "";
    (document.getElementById("completed") !== undefined) ? document.getElementById("completed").addEventListener("click", viewCompleted) : "";
}

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "index.html";
    }).catch(function(error) {
        alert(error);
    });
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

function close() {
    document.getElementsByClassName("modal")[0].style.display = "none";
    document.getElementsByClassName("modal")[1].style.display = "none";
}

function closeOutside(e) {
    if (e.target.className === "modal") {
        document.getElementsByClassName("modal")[0].style.display = "none";
        document.getElementsByClassName("modal")[1].style.display = "none";
    }
}

function viewTodo() {
    window.location.href = "home.html";
}

function viewCompleted() {
    window.location.href = "completed.html";
}

function revise(taskID, type, createNewTask) {
    var title = document.getElementById("title").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var description = document.getElementById("description").value;

    if (title === "" || date === "" || time === "") {
        alert("You must enter a title, date, and time.");
        return;
    }

    var timestamp = Date.parse(date + " " + time)/1000;
    if (timestamp === undefined || timestamp === "") timestamp = 0;
    var user = firebase.auth().currentUser;

    if (!createNewTask) {
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
    else {
        database.collection("users").doc(user.uid).collection("todo").doc().set({
            title: title,
            date: date,
            time: time,
            description: description,
            timestamp: timestamp
        }).then(function() {
            document.getElementsByClassName("modal-list")[1].innerHTML = "";
            location.reload();
        }).catch(function(error) {
            console.log("Error: " + error);
        });
    }
}

function displayCreateScreen() {
    document.getElementsByClassName("modal")[1].style.display = "block";

    var info = `<label for=title>Title</label>
    <input type=text id=title name=title placeholder='Enter a title'><br>
    <label for=date>Date</label>
    <input type=date id=date name=date placeholder='Enter a date'><br>
    <label for=time>Time</label>
    <input type=time id=time name=time placeholder='Enter a time'><br>
    <label for=description>Description</label>
    <textarea id=description name=description placeholder='Enter a description'></textarea><br>
    <button id='create' onclick="revise( '', 'todo', true )">Create</button>`;

    document.getElementsByClassName("modal-list")[1].innerHTML = info;
}

function completeTask(clickedID) {
    if (!confirm("Mark task as complete?")) return;
   var taskID = clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    var date, time, description, timestamp, title;
    database.collection("users").doc(userID).collection("todo").doc(taskID).get().then(function(doc) {
        if (doc.exists) {
            date = doc.data().date;
            time = doc.data().time;
            description = doc.data().description;
            timestamp = doc.data().timestamp;
            title = doc.data().title;
            database.collection("users").doc(userID).collection("completed").doc(taskID).set({
                date: date,
                time: time,
                description: description,
                timestamp: timestamp,
                title: title
            }).then(function() {
                database.collection("users").doc(userID).collection("todo").doc(taskID).delete().then(function() {
                    console.log("Successfully moved document to completed section");
                    document.getElementById(taskID).style.display = "none";
                }).catch(function(error) {
                    console.log("Error moving document: ", error);
                });
            });
        }
    });
}

function displayEditScreen(clickedID, type) {
    var taskID = clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    var date, time, description, timestamp, title;
    document.getElementsByClassName("modal")[0].style.display = "block";
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
                        <textarea id=description name=description placeholder='Enter a description'>${description}</textarea><br>
                        <button id=revise onclick="revise( '${taskID}', '${type}', false )">Revise</button>`;
            var trashIcon = `<img onclick="deleteTask('${taskID}', '${type}', true)" src=trash.png alt=Delete>`;

            document.getElementsByClassName("modal-list")[0].innerHTML = info;
            document.getElementById("trash").innerHTML = trashIcon;
        }
    })
}

function deleteTask(clickedID, type, inModal) {
    if (!confirm("Delete this task?")) return;
    var taskID = (inModal) ? clickedID : clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    database.collection("users").doc(userID).collection(type).doc(taskID).delete()
    .then(function() {
        console.log("Successfully deleted document");
        document.getElementById(taskID).style.display = "none";
        if (inModal) close();
    }).catch(function(error) {
        console.log("Error removing document: ", error);
    });
}
