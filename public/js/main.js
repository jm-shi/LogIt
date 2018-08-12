const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function formatTime(time) {
  let hour = time.substring(0, 2);
  const minute = time.substring(3, 5);
  const meridiem = hour < 12 ? 'am' : 'pm';
  hour = hour == 0 ? 12 : hour;
  hour = hour < 10 ? hour.slice(1, 2) : hour;
  hour = meridiem === 'pm' ? hour % 12 : hour;
  return `${hour}:${minute} ${meridiem}`;
}

function formatDate(date) {
  let month = date.substring(5, 7);
  let day = date.substring(8, 10);
  const year = date.substring(0, 4);
  month = month < 10 ? month.slice(1, 2) : month;
  day = day < 10 ? day.slice(1, 2) : day;
  return `${months[month - 1]} ${day}, ${year}`;
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.href = 'index.min.html';
    })
    .catch(function(error) {
      alert(error);
    });
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

function close() {
  document.getElementsByClassName('modal-list')[0].innerHTML = '';
  document.getElementsByClassName('modal-list')[1].innerHTML = '';
  document.getElementsByClassName('modal-list')[2].innerHTML = '';
  document.getElementsByClassName('trash')[0].innerHTML = '';
  document.getElementsByClassName('modal')[0].style.display = 'none';
  document.getElementsByClassName('modal')[1].style.display = 'none';
  document.getElementsByClassName('modal')[2].style.display = 'none';
}

function closeOutside(e) {
  if (e.target.className === 'modal') close();
}

function viewTodo() {
  window.location.href = 'home.min.html';
}

function viewCompleted() {
  window.location.href = 'completed.min.html';
}

function revise(taskID, type, createNewTask) {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const description = document.getElementById('description').value;

  if (title === '' || date === '' || time === '') {
    alert('You must enter a title, date, and time.');
    return;
  }

  const timestamp = Date.parse(date + ' ' + time) / 1000;
  if (timestamp === undefined || timestamp === '') timestamp = 0;
  const user = firebase.auth().currentUser;

  if (!createNewTask) {
    database
      .collection('users')
      .doc(user.uid)
      .collection(type)
      .doc(taskID)
      .set({
        title: title,
        date: date,
        time: time,
        description: description,
        timestamp: timestamp
      })
      .then(function() {
        document.getElementsByClassName('modal-list')[0].innerHTML = '';
        location.reload();
      })
      .catch(function(error) {
        console.log('Error: ' + error);
      });
  } else {
    database
      .collection('users')
      .doc(user.uid)
      .collection('todo')
      .doc()
      .set({
        title: title,
        date: date,
        time: time,
        description: description,
        timestamp: timestamp
      })
      .then(function() {
        document.getElementsByClassName('modal-list')[1].innerHTML = '';
        location.reload();
      })
      .catch(function(error) {
        console.log('Error: ' + error);
      });
  }
}

function displayViewScreen(clickedID, type) {
  const taskID = clickedID.slice(5);
  const userID = firebase.auth().currentUser.uid;
  let date, time, description, title;

  document.getElementsByClassName('modal')[0].style.display = 'block';
  database
    .collection('users')
    .doc(userID)
    .collection(type)
    .doc(taskID)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        date = formatDate(doc.data().date);
        description = doc.data().description;
        time = formatTime(doc.data().time);
        title = doc.data().title;
        titleArr = title.split(
          ' '
        ); /* Ensures the displayed title includes words after spaces */

        var info = `<h2 class=view-info>
                            <span class=header>Title: </span>
                            ${titleArr.join('&nbsp;')}</h2><br>
                        <h2 class=view-info>
                            <span class=header>Date: </span>
                            ${date}</h2><br>
                        <h2 class=view-info>
                            <span class=header>Time: </span>
                            ${time}</h2><br>
                        ${
                          description === ''
                            ? ''
                            : `<h2 class=view-info bottom-view>    
                            <span class=header>Description: </span>
                            ${description}</h2><br>`
                        }
                        <button disabled id=view style="color:#a3a8c2">View</button>`;

        document.getElementsByClassName('modal-list')[0].innerHTML = info;
      }
    });
}

function displayEditScreen(clickedID, type) {
  const taskID = clickedID.slice(5);
  const userID = firebase.auth().currentUser.uid;
  let date, time, description, title;
  document.getElementsByClassName('modal')[1].style.display = 'block';
  database
    .collection('users')
    .doc(userID)
    .collection(type)
    .doc(taskID)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        date = doc.data().date;
        description = doc.data().description;
        time = doc.data().time;
        title = doc.data().title;
        titleArr = title.split(
          ' '
        ); /* Ensures the displayed title includes words after spaces */

        trashIcon = `
          <img
            src='images/trash.png'
            alt='Delete'
            onclick={deleteTask(clickedID, type, true)}
          />`;

        var info = `<label for=title>Title</label>
                    <input type=text id=title name=title placeholder='Enter a title' value=${titleArr.join(
                      '&nbsp;'
                    )}
                    )}><br>
                    <label for=date>Date</label>
                    <input type=date id=date name=date placeholder='Enter a date' value=${date}><br>
                    <label for=time>Time</label>
                    <input type=time id=time name=time placeholder='Enter a time' value=${time}><br>
                    <label for=description>Description</label>
                    <textarea id=description name=description placeholder='Enter a description'>${description}</textarea><br>
                    <button id=revise onclick="revise( '${taskID}', '${type}', false )">Revise</button>`;
        var trashIcon = `<img onclick="deleteTask('${taskID}', '${type}', true)" src='images/trash.png' alt=Delete>`;

        document.getElementsByClassName('modal-list')[1].innerHTML = info;
        document.getElementsByClassName('trash')[0].innerHTML = trashIcon;
      }
    });
}

function displayCreateScreen() {
  document.getElementsByClassName('modal')[2].style.display = 'block';

  var info = `<label for=title>Title</label>
    <input type=text id=title name=title placeholder='Enter a title' value=''><br>
    <label for=date>Date</label>
    <input type=date id=date name=date placeholder='Enter a date' value=''><br>
    <label for=time>Time</label>
    <input type=time id=time name=time placeholder='Enter a time' value=''><br>
    <label for=description>Description</label>
    <textarea id=description name=description placeholder='Enter a description'></textarea><br>
    <button id='create' onclick="revise( '', 'todo', true )">Create</button>`;

  document.getElementsByClassName('modal-list')[2].innerHTML = info;
}

function completeTask(clickedID) {
  if (!confirm('Mark task as complete?')) return;
  const taskID = clickedID.slice(5);
  const userID = firebase.auth().currentUser.uid;
  let date, time, description, timestamp, title;
  database
    .collection('users')
    .doc(userID)
    .collection('todo')
    .doc(taskID)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        date = doc.data().date;
        time = doc.data().time;
        description = doc.data().description;
        timestamp = doc.data().timestamp;
        title = doc.data().title;
        database
          .collection('users')
          .doc(userID)
          .collection('completed')
          .doc(taskID)
          .set({
            date: date,
            time: time,
            description: description,
            timestamp: timestamp,
            title: title
          })
          .then(function() {
            database
              .collection('users')
              .doc(userID)
              .collection('todo')
              .doc(taskID)
              .delete()
              .then(function() {
                console.log('Successfully moved document to completed section');
                document.getElementById(taskID).style.display = 'none';
              })
              .catch(function(error) {
                console.log('Error moving document: ', error);
              });
          });
      }
    });
}

function deleteTask(clickedID, collectionType, inModal) {
  if (!confirm('Delete this task?')) return;

  const taskID = inModal ? clickedID : clickedID.slice(5);
  const userID = firebase.auth().currentUser.uid;
  database
    .collection('users')
    .doc(userID)
    .collection(collectionType)
    .doc(taskID)
    .delete()
    .then(function() {
      console.log('Successfully deleted document');
      document.getElementById(taskID).style.display = 'none';
      if (inModal) close();
    })
    .catch(function(error) {
      console.log('Error removing document: ', error);
    });
}

window.onload = function() {
  document.getElementById('signout').addEventListener('click', logout);
  document.getElementById('hamburger').addEventListener('click', toggleSidebar);
  document
    .getElementById('createbtn')
    .addEventListener('click', displayCreateScreen);

  document.getElementsByClassName('close')[0].addEventListener('click', close);
  document.getElementsByClassName('close')[1].addEventListener('click', close);
  document.getElementsByClassName('close')[2].addEventListener('click', close);
  window.addEventListener('click', closeOutside);

  document.getElementById('todo') !== undefined
    ? document.getElementById('todo').addEventListener('click', viewTodo)
    : '';
  document.getElementById('completed') !== undefined
    ? document
        .getElementById('completed')
        .addEventListener('click', viewCompleted)
    : '';
};
