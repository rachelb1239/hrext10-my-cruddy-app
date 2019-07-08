/*

 ### Basic Reqs
- [ ] Where to store data? (localstorage)
- [ ] How to modify data? (update action, delete action)

*/

//localStorage functions
var createItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

var updateItem = function(key, value) {
  return window.localStorage.setItem(key, value);
}

var deleteItem = function(key) {
  return window.localStorage.removeItem(key);
}

var clearDatabase = function() {
  return window.localStorage.clear();
}

const getKeyValue = function(key) {
  return window.localStorage.getItem(key)
}

const updateRedux = function (key) {
  value = JSON.stringify(addToItem(getDateStatsObj(), JSON.parse(getKeyValue(key))))
  return window.localStorage.setItem(key, value)
}

const addToItem = function (target, source) {
 return Object.assign({},target, source)
}

const getDateStatsObj = function () {
  return { [document.getElementById('date').value] : getCarStats() }
}

const reducerCarStats = (acc, cur) => { 
  acc[cur.id] = cur.value
  return acc
}

const getCarStats = function() {
  return Array.prototype.reduce.call(document.getElementsByClassName('value'), reducerCarStats, {})
}

const wrapObjectData = function(obj, label) { 
  let wrappedData = ''
  for (let keys in obj) {
    if (typeof obj[keys] === 'object') {
      wrappedData += `<tr><td>${label}</td>`
      wrappedData += wrapObjectData(obj[keys]) + `</tr>`
    } else {
      wrappedData += `<td>${obj[keys]}</td>`
    }
  }
  return wrappedData
}

var showDatabaseContents = function() {
  $('tbody').html('');
  for (let i = 0; i < window.localStorage.length; i++) {
    let key = window.localStorage.key(i);
    let values = JSON.parse(getKeyValue(key));
    $('tbody').append(wrapObjectData(values, key));
  }
}

var keyExists = function(key) {
  return window.localStorage.getItem(key) !== null
}

var getKeyInput = function() {
  return $('.key').val();
}

var getValueInput = function() {
  return JSON.stringify(getDateStatsObj());
}

var resetInputs = function() {
  $('.key').val('');
  $('.value').val('');
}

// Event Handlers
$(document).ready(function() {
  showDatabaseContents();

  $('.create').click(function() {
    if (getKeyInput() !== '' && getValueInput() !== '') {
      if (keyExists(getKeyInput())) {
        if(confirm('key already exists in database, do you want to update instead?')) {
          updateItem(getKeyInput(), getValueInput());
          showDatabaseContents();
        }
      } else {
        createItem(getKeyInput(), getValueInput());
        showDatabaseContents();
        resetInputs();
      }
    } else  {
      alert('key and value must not be blank');
    }
  });

  $('.update').click(function() {
    if (getKeyInput() !== '' && getValueInput() !== '') {
      if (keyExists(getKeyInput())) {
        updateRedux(getKeyInput());
        showDatabaseContents();
        resetInputs();
      } else {
        alert('key does not exist in database');
      }
    } else {
      alert('key and value must not be blank');
    }
  });

  $('.delete').click(function() {
     if (getKeyInput() !== '') {
      if (keyExists(getKeyInput())) {
        deleteItem(getKeyInput());
        showDatabaseContents();
        resetInputs();
      } else {
        alert('key does not exist in database');
      }
    } else {
      alert('key must not be blank');
    }
  });

  $('.reset').click(function() {
    resetInputs();
  })

  $('.clear').click(function() {
    if (confirm('WARNING: Are you sure you want to clear the database? \n                THIS ACTION CANNOT BE UNDONE')) {
      clearDatabase();
      showDatabaseContents();
    }
  })
})