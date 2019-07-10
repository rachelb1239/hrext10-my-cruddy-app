// display order
const tableDisplayOrder = ['starting-mileage','ending-mileage', 'purpose-of-trip'];

//localStorage functions
const createItem = function(key, value) {
  return window.localStorage.setItem(key, value)
}

const updateItem = function(key, value) {
  return window.localStorage.setItem(key, value)
}

const deleteItem = function(key) {
  return window.localStorage.removeItem(key)
}

const clearDatabase = function() {
  return window.localStorage.clear()
}

const getKeyValue = function(key) {
  return window.localStorage.getItem(key)
}

const keyExists = function(key) {
  return getKeyValue(key) !== null
}

// Retrieve Input Functions
const getKeyInput = function() {
  return $('.key').val()
}

const getDateStatsObj = function () {
  let inputDate = document.getElementById('date').value
  let keyValue = JSON.parse(getKeyValue(getKeyInput()))
  let recordCount = 0
  if (keyValue === null) {
    keyValue = {};
  }
  if (keyValue.hasOwnProperty(inputDate)) {
    keyValue[inputDate].push(getCarStats())
  } else {
    keyValue[inputDate] = [getCarStats()]
  }
  return keyValue;
}

const reducerCarStats = (acc, cur) => { 
  acc[cur.id] = cur.value
  return acc
}

const getCarStats = function() {
  return Array.prototype.reduce.call(document.getElementsByClassName('value'), reducerCarStats, {})
}

const getValueInput = function() { 
  return JSON.stringify(getDateStatsObj());
}

// Format/display data
const getTableHTML = function(key, obj) { 
  let wrappedData = ''
  for (let dates in obj) {
    obj[dates].forEach(function (value, index) {
     wrappedData += `<tr><td>${key}</td>` // car label
     wrappedData += `<td>${dates}</td>`// date label
     wrappedData += `<td>${index + 1}</td>` // entry # for date
     tableDisplayOrder.forEach(function(dispValue) {
        wrappedData += `<td>${value[dispValue]}</td>`
      })
      wrappedData += `</tr>`
    })
  }
  return wrappedData
}

const showDatabaseContents = function() {
  $('tbody').html('');
  for (let i = 0; i < window.localStorage.length; i++) {
    let key = window.localStorage.key(i);
    let values = JSON.parse(getKeyValue(key));
    $('tbody').append(getTableHTML(key, values));
  }
}

const resetInputs = function() {
  $('.key').val('');
  $('.value').val('');
}

// Event Handlers
$(document).ready(function() {
  showDatabaseContents();

  $('.create').click(function() {
    let keyInput = getKeyInput();
    if (keyInput !== '' && getValueInput() !== '') {
      if (keyExists(keyInput)) {
        if(confirm('Key already exists in database. Do you want to update instead?')) {
          updateItem(keyInput, getValueInput());
          showDatabaseContents();
        }
      } else {
        createItem(keyInput, getValueInput());
        showDatabaseContents();
        resetInputs();
      }
    } else  {
      alert('Key and value must not be blank');
    }
  });

  $('.update').click(function() {
    let keyInput = getKeyInput();
    if (keyInput !== '' && getValueInput() !== '') {
      if (keyExists(keyInput)) {
        updateItem(keyInput, getValueInput());
        showDatabaseContents();
        resetInputs();
      } else {
        alert('Key does not exist in database');
      }
    } else {
      alert('Key and value must not be blank');
    }
  });

  $('.delete').click(function() {
     if (getKeyInput() !== '') {
      if (keyExists(getKeyInput())) {
        deleteItem(getKeyInput());
        showDatabaseContents();
        resetInputs();
      } else {
        alert('Key does not exist in database');
      }
    } else {
      alert('Key must not be blank');
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