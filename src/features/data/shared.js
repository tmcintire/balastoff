/* Shared function for confirmation of deletion of events */
export function confirmDeleteEvent() {
  const retVal = confirm('Are you sure you want to delete this event?'); // eslint-disable-line
  switch (retVal) {
    case true:
      return true;
    default:
      return false;
  }
}

/* Shared function for confirmation of deletion of tickets */
export function confirmDeleteTicket() {
  const retVal = confirm('Are you sure you want to delete this ticket?'); // eslint-disable-line
  switch (retVal) {
    case true:
      return true;
    default:
      return false;
  }
}

/* Shared function for confirmation of deletion of expense */
export function confirmDeleteExpense() {
  const retVal = confirm('Are you sure you want to delete this expense?'); // eslint-disable-line
  switch (retVal) {
    case true:
      return true;
    default:
      return false;
  }
}

/* Function to sort array in ascending order */
export function sortArrayAscendingByDate(a, b) {
  return new Date(a.value.date).getTime() - new Date(b.value.date).getTime();
}

/* Function to sort array in descending order */
export function sortArrayDescendingByDate(a, b) {
  return new Date(b.value.date).getTime() - new Date(a.value.date).getTime();
}

/* Function to sort array in descending alphabetical order*/
export function sortArrayDescendingByName(a, b) {
  const valueA = a.type;
  const valueB = b.type;

  if (valueA < valueB) {
    return -1;
  } else if (valueA > valueB) {
    return 1;
  } else {
    return 0;
  }
}

export function orderExpenses(expenses) {
    // Create an array of the returned expenses
  const expenseArray = [];
  Object.keys(expenses).map((expense) => { //eslint-disable-line
    expenseArray.push({
      key: expense,
      ...expenses[expense],
    });
  });
  // Sort the expenes
  expenseArray.sort(sortArrayDescendingByName);

  // Send the objects back into an object
  const expenseObject = {};
  let i;
  for (i = 0; i < expenseArray.length; i += 1) {
    expenseObject[expenseArray[i].key] = expenseArray[i];
  }
  return expenseObject;
}

// Function order events given a direction
export function orderEvents(events, direction) {
  // Create an array of the returned events
  const eventsArray = [];
  Object.keys(events).map((event) => { //eslint-disable-line
    eventsArray.push({
      key: event,
      value: events[event],
    });
  });
  // Sort the events
  if (direction === 'ascending') {
    eventsArray.sort(sortArrayAscendingByDate);
  } else {
    eventsArray.sort(sortArrayDescendingByDate);
  }

  // Send the objects back into an object
  const eventsObject = {};
  let i;
  for (i = 0; i < eventsArray.length; i += 1) {
    eventsObject[eventsArray[i].key] = eventsArray[i].value;
  }
  return eventsObject;
}
