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
    document.getElementsByClassName("modal-list")[0].innerHTML = "";
    document.getElementsByClassName("modal-list")[1].innerHTML = "";
    document.getElementsByClassName("modal-list")[2].innerHTML = "";
    document.getElementsByClassName("trash")[0].innerHTML = ""; 
    document.getElementsByClassName("modal")[0].style.display = "none";
    document.getElementsByClassName("modal")[1].style.display = "none";
    document.getElementsByClassName("modal")[2].style.display = "none";
}

function closeOutside(e) {
    if (e.target.className === "modal") close();
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
    } else {
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

function displayViewScreen(clickedID, type) {
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

            var info = `<h2 class=view-info>Title: ${titleArr.join("&nbsp;")}</h2><br>
                        <h2 class=view-info>Date: ${date}</h2><br>
                        <h2 class=view-info>Time: ${time}</h2><br>
                        <h2 class=view-info bottom-view>Description: ${description}</h2><br>
                        <button disabled id=view style="color:#a3a8c2">View</button>`;
            
            document.getElementsByClassName("modal-list")[0].innerHTML = info;
        }
    });
}

var modalElements = {
    titleLabel: null,
    titleInput: null,
    dateLabel: null,
    dateInput: null,
    timeLabel: null,
    timeInput: null,
    descriptionLabel: null,
    descriptionTextArea: null,
    createButton: null,
    reviseButton: null,
    trashIcon: null,
    lineBreak: null
};

var view = {
    createTitleElems: function() {
        var titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", "title");
        var titleText = document.createTextNode("Title");
        titleLabel.appendChild(titleText);
        var titleInput = document.createElement("input");
        titleInput.setAttribute("type", "text");
        titleInput.setAttribute("id", "title");
        titleInput.setAttribute("placeholder", "Enter a title");
        modalElements.titleLabel = titleLabel;
        modalElements.titleInput = titleInput;
    },
    createDateElems: function() {
        var dateLabel = document.createElement("label");
        dateLabel.setAttribute("for", "date");
        var dateText = document.createTextNode("Date");
        dateLabel.appendChild(dateText);
        var dateInput = document.createElement("input");
        dateInput.setAttribute("type", "date");
        dateInput.setAttribute("id", "date");
        dateInput.setAttribute("placeholder", "Enter a date");
        modalElements.dateLabel = dateLabel;
        modalElements.dateInput = dateInput;
    },
    createTimeElems: function() {
        var timeLabel = document.createElement("label");
        timeLabel.setAttribute("for", "time");
        var timeText = document.createTextNode("Time");
        timeLabel.appendChild(timeText);
        var timeInput = document.createElement("input");
        timeInput.setAttribute("type", "time");
        timeInput.setAttribute("id", "time");
        timeInput.setAttribute("placeholder", "Enter a time");
        modalElements.timeLabel = timeLabel;
        modalElements.timeInput = timeInput;
    },
    createDescriptionElems: function() {
        var descriptionLabel = document.createElement("label");
        descriptionLabel.setAttribute("for", "description");
        var descriptionText = document.createTextNode("Description");
        descriptionLabel.appendChild(descriptionText);
        var descriptionTextArea = document.createElement("textarea");
        descriptionTextArea.setAttribute("id", "description");
        descriptionTextArea.setAttribute("placeholder", "Enter a description");
        modalElements.descriptionLabel = descriptionLabel;
        modalElements.descriptionTextArea = descriptionTextArea;
    },
    createTrashIcon: function() {
        var trashIcon = document.createElement("img");
        trashIcon.setAttribute("src", "images/trash.png");
        trashIcon.setAttribute("alt", "Delete");
        trashIcon.onclick = function() {
            deleteTask(taskID, type, true);
        };
        modalElements.trashIcon = trashIcon;
    },
    createLineBreak: function() {
        var lineBreak = document.createElement("br");
        modalElements.lineBreak = lineBreak;
    },
    createCreateButton: function() {
        var createButton = document.createElement("button");
        createButton.setAttribute("id", "create");
        createButton.onclick = function() { revise("", "todo", true); };
        createButtonText = document.createTextNode("Create");
        createButton.appendChild(createButtonText);
        modalElements.createButton = createButton;
    },
    createReviseButton: function(taskID, type) {
        var reviseButton = document.createElement("button");
        reviseButton.setAttribute("id", "revise");
        reviseButton.onclick = function() { revise(taskID, type, false); };
        reviseButtonText = document.createTextNode("Revise");
        reviseButton.appendChild(reviseButtonText);
        modalElements.reviseButton = reviseButton;
    },
};

function createElements(taskID, type) {
    view.createTitleElems();
    view.createDateElems();
    view.createTimeElems();
    view.createDescriptionElems();
    view.createTrashIcon();
    view.createLineBreak();
    if (taskID === "") {
        view.createCreateButton();
    } else {
        view.createReviseButton(taskID, type);
    }
}

function updateDOM(i) {
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.titleLabel);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.titleInput);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.dateLabel);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.dateInput);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.timeLabel);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.timeInput);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.descriptionLabel);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.descriptionTextArea);
    document.getElementsByClassName("modal-list")[i].appendChild(modalElements.lineBreak);
    
    if (i === 1) { 
        document.getElementsByClassName("trash")[0].appendChild(modalElements.trashIcon);
        document.getElementsByClassName("modal-list")[i].appendChild(modalElements.reviseButton);
    } else {
        document.getElementsByClassName("modal-list")[i].appendChild(modalElements.createButton);   
    }
}

function displayEditScreen(clickedID, type) {
    var taskID = clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    var date, time, description, timestamp, title;
    document.getElementsByClassName("modal")[1].style.display = "block";
    database.collection("users").doc(userID).collection(type).doc(taskID).get().then(function(doc) {
        if (doc.exists) {
            date = doc.data().date;
            description = doc.data().description;
            time = doc.data().time;
            title = doc.data().title; 
        
            createElements(taskID, type);
            modalElements.titleInput.setAttribute("value", title);  
            modalElements.dateInput.setAttribute("value", date);
            modalElements.timeInput.setAttribute("value", time);
            modalElements.descriptionTextArea.setAttribute("value", description);
            
            updateDOM(1);
        }
    });
}

function displayCreateScreen() {
    document.getElementsByClassName("modal")[2].style.display = "block";
    createElements("","");
    updateDOM(2);
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

function deleteTask(clickedID, collectionType, inModal) {
    if (!confirm("Delete this task?")) return;

    var taskID = (inModal) ? clickedID : clickedID.slice(5);
    var userID = firebase.auth().currentUser.uid;
    database.collection("users").doc(userID).collection(collectionType).doc(taskID).delete()
    .then(function() {
        console.log("Successfully deleted document");
        document.getElementById(taskID).style.display = "none";
        if (inModal) close();
    }).catch(function(error) {
        console.log("Error removing document: ", error);
    });
}

window.onload = function() {
    document.getElementById("signout").addEventListener("click", logout);
    document.getElementById("hamburger").addEventListener("click", toggleSidebar);
    document.getElementById("createbtn").addEventListener("click", displayCreateScreen);

    document.getElementsByClassName("close")[0].addEventListener("click", close);
    document.getElementsByClassName("close")[1].addEventListener("click", close);
    document.getElementsByClassName("close")[2].addEventListener("click", close);
    window.addEventListener("click", closeOutside);

    (document.getElementById("todo") !== undefined) ? document.getElementById("todo").addEventListener("click", viewTodo) : "";
    (document.getElementById("completed") !== undefined) ? document.getElementById("completed").addEventListener("click", viewCompleted) : "";
}