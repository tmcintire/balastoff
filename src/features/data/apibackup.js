import moment from 'moment';
import firebase, { firebaseRef } from '../../../firebase';
import * as actions from '../data/actions';
import * as helpers from '../data/helpers';
import store from '../../store';

/* Firebase References */

const eventsRef = firebaseRef.child('events');

export function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch((err) => {
    if (err) {
      store.dispatch(actions.loginerror());
    }
  }).then((success) => {
    if (success) {
      helpers.getUserPermissions(success.uid);
      const user = {
        id: success.uid,
      };
      store.dispatch(actions.setUser(user));
      window.location = '#/';
    }
  });
}

// Add Event
export function addEvent(newEvent) {
  eventsRef.push().set(newEvent);
}

export function deleteEvent(eventId) {
  eventsRef.child(eventId).remove();
  helpers.fetchEvents();
}

/* Fetch event details given an ID parameter */
export function fetchEventDetails(id) {
  eventsRef.orderByKey().equalTo(id).on('value', (snapshot) => {
    const events = snapshot.val() || {};
    const parsedEvents = [];
    Object.keys(events).forEach((event) => { // Iterate through event and push it to an array
      parsedEvents.push({
        ...events[event],
      });
    });
    const disabled = new Date(parsedEvents[0].date).getTime() < new Date(moment().format('L')).getTime();
    store.dispatch(actions.fetchEventDetails(parsedEvents, disabled));
  });
}

export function editEventDetails(id, eventDetails) {
  const eventRef = eventsRef.child(id);
  eventRef.update(eventDetails);
  updateExpenses(id);
  updateCash(id);
}


/* Add ticket */
export function addTicket(eventId, newTicket) {
  const eventTickets = eventsRef.child(eventId).child('tickets');
  const newTicketKey = eventTickets.push().key;
  eventTickets.child(newTicketKey).update(newTicket);
}

export function deleteTicket(eventId, ticketId) {
  eventsRef.child(eventId).child('tickets').child(ticketId).remove();
}

export function fetchCommonTickets() {
  const common = [];
  firebaseRef.child('tickets').on('value', (snapshot) => {
    const tickets = snapshot.val() || '';
    Object.keys(tickets).forEach((ticket) => { // Iterate through event and push it to an array
      common.push({
        ...tickets[ticket],
      });
    });
    store.dispatch(actions.fetchCommonTickets(common));
  });
}


// Fetch ticket details given a ticket ID
export function fetchTicketDetails(id, ticketid) {
  eventsRef
  .child(id)
  .child('tickets')
  .child(ticketid)
  .on('value', (snapshot) => {
    const tickets = snapshot.val() || {};
    store.dispatch(actions.fetchTicketDetails(tickets));
  });
}
// Edit the details of a particuar ticket, given a ticket ID
export function editTicketDetails(id, ticketid, ticketDetails) {
  const eventRef = eventsRef.child(id);
  const ticketsRef = eventRef.child('tickets');
  const ticketRef = ticketsRef.child(ticketid);
  ticketRef.update(ticketDetails);
  updateTotals(id);
}


// Function to modify tickets (increase or decrease)
export function modifyTicket(eventId, typeId, count, price, edit) {
    // Set firebase references
  const eventRef = eventsRef.child(eventId);
  const ticketsRef = eventRef.child('tickets');
  const ticketRef = ticketsRef.child(typeId);

  let newCount;
  if (edit === 'add') { // check if add
    newCount = count + 1;
  } else if (edit === 'remove') { // check if remove
    newCount = count - 1;
  }

  // set the new total
  const newTotal = newCount * price;

  // Update the ticket in the database
  ticketRef.update({
    count: newCount,
    total: newTotal,
  });

  updateTotals(eventId);
  updateExpenses(eventId);
  updateCash(eventId);
}

function updateTotals(eventId) {
  const eventRef = eventsRef.child(eventId);
  const state = store.getState();
  const event = state.data.event[0];
  const ticketsTotal = () => (
    Object.keys(event.tickets).map((ticket) => {
      const ticketTotal = (event.tickets[ticket].count * event.tickets[ticket].price);
      return ticketTotal;
    })
  );
  const totalRevenue = ticketsTotal().reduce((a, b) => a + b);

  const getCountTotal = () => (
    Object.keys(event.tickets).map((ticket) => {
      const countTotal = event.tickets[ticket].count;
      return countTotal;
    })
  );
  const totalCount = getCountTotal().reduce((a, b) => a + b);

  eventRef.update({
    totalRevenue,
    totalCount,
  });
}

// Update the cashbox amount
export function updateCash(eventId) {
  const eventRef = eventsRef.child(eventId);
  const event = store.getState().data.event[0];
  const expenses = event.expenses;
  const parsedExpenses = [];
  if (expenses) {
    Object.keys(expenses).forEach((expense) => {
      parsedExpenses.push({
        ...event.expenses[expense],
      });
    });
    let totalExpenses = 0;
    for (let i = 0; i < parsedExpenses.length; i += 1) {
      totalExpenses += parsedExpenses[i].cost;
    }
    const endingCash = Math.floor((event.totalRevenue - totalExpenses) + parseInt(event.cash, 10));
    const net = endingCash - parseInt(event.cash, 10);
    eventRef.update({
      totalExpenses,
      endingCash,
      net,
    });
  }
}

// Expenses
export function fetchExpenseDetails(eventId, expenseId) {
  const eventRef = eventsRef.child(eventId);
  const expensesRef = eventRef.child('expenses');
  const expenseRef = expensesRef.child(expenseId);
  expenseRef.on('value', (snapshot) => {
    const expense = snapshot.val() || {};
    store.dispatch(actions.fetchExpenseDetails(expense));
  });
}

// Add expense
export function addExpense(eventId, expense) {
  const eventRef = eventsRef.child(eventId);
  const expensesRef = eventRef.child('expenses');
  expensesRef.push().set(expense);

  updateTotals(eventId);
  updateExpenses(eventId);
  updateCash(eventId);
}

// Edit expense details given new information
export function editExpenseDetails(eventId, expenseId, expense) {
  const eventRef = eventsRef.child(eventId);
  const expensesRef = eventRef.child('expenses');
  const expenseRef = expensesRef.child(expenseId);
  expenseRef.update(expense);
  store.dispatch(actions.clearExpense());

  updateTotals(eventId);
  updateExpenses(eventId);
  updateCash(eventId);
}

export function removeExpense(eventId, expenseId) {
  const eventRef = eventsRef.child(eventId);
  const expensesRef = eventRef.child('expenses');
  const expenseRef = expensesRef.child(expenseId);
  expenseRef.remove();

  store.dispatch(actions.clearExpense());

  updateTotals(eventId);
  updateExpenses(eventId);
  updateCash(eventId);
}

// change the paid status on an expense
export function changeCheckBox(eventId, expenseId, checked) {
  const eventRef = eventsRef.child(eventId);
  const expensesRef = eventRef.child('expenses');

  expensesRef.child(expenseId).update({
    paid: checked,
  });
}


// Function to update event totals when a ticket is modified
// The majority of this code is to calculate the new administrative fee every
// time a new ticket is added or removed.

// Find the band expense
function findBand(expense) {
  return expense.type === 'Band';
}

// Find the venue expense
function findVenue(expense) {
  return expense.type === 'Venue';
}

/* Get the expenses from firebase and return them */
export function getEvent() {
  const state = store.getState().data;
  const event = state.event[0];
  return event;
}

/* parse the expenses in order to search for bands and venues */
export function parseExpenses(expenses) {
  const parsedExpenses = [];
  Object.keys(expenses).forEach((expense) => {
    parsedExpenses.push({
      ...expenses[expense],
      key: expense,
    });
  });
  return parsedExpenses;
}

export function expensesPercentTotal(expenses) {
  const percentTotal = () => (
    Object.keys(expenses).map((expense) => {
      let percent;
      if (expenses[expense].percent === '') {
        percent = 0;
      } else {
        percent = parseInt(expenses[expense].percent, 10);
      }
      return percent;
    })
  );
  return percentTotal().reduce((a, b) => a + b);
}

/* Get the total of all the expenses for the event and return a total */
export function getTotalEventExpenses(expenses) {
  const expensesTotal = () => (
    Object.keys(expenses).map((expense) => {
      const expenseTotal = (expenses[expense].cost);
      return expenseTotal;
    })
  );
  return expensesTotal().reduce((a, b) => a + b);
}

/* This function is executed each time a ticket is added.  This function does several things.
 * First */
export function updateExpenses(eventId, adminFeeStatus) {
    /* Define the expenses and then find the band and venue expenses specifically */
  const event = getEvent();
  const expenses = event.expenses;
  const parsedExpenses = parseExpenses(expenses);
  const bandExpense = parsedExpenses.find(findBand);
  const venueExpense = parsedExpenses.find(findVenue);

  const totalPercentage = expensesPercentTotal(parsedExpenses);
  console.log(totalPercentage);
  // Make sure the band and the venue both exist
  if (bandExpense !== undefined && venueExpense !== undefined) {
    // define the band and expense keys
    const bandExpenseId = bandExpense.key;
    const venueExpenseId = venueExpense.key;

    let newAdminFee;
    let newVenueExpense = (event.totalRevenue * venueExpense.percent) / 100;
    let venueMod = parseFloat((newVenueExpense % 1).toFixed(1), 10);
    newVenueExpense -= venueMod;
    let newBandExpense = ((event.totalRevenue * bandExpense.percent) / 100) + venueMod; // eslint-disable-line

    /* Check if the event has revenue, this check is needed in case all the
     * tickets are removed and the revenue gets brought back down to zero */
    if (event.totalRevenue > 0) {
      /**
        * Here we check to see if the event fee is less than the max fee and
        * if the new band expense is greater than the band minimumas well as
        * if the adminfeestatus is true
      **/
      // eslint-disable-next-line
      if (event.fee <= parseInt(event.max_fee, 10) && newBandExpense > event.band_minimum && adminFeeStatus !== 'NoAdminFee') {

          /* Check to see if there are percentages assigned to the expenses */
        if (bandExpense.percent > 0 && venueExpense.percent > 0) {
          const maxBandPercentage = (event.max_fee * parseInt(bandExpense.percent, 10)) / 100;
          const maxVenuePercentage = event.max_fee - maxBandPercentage;

          /**
            *Find the difference between the new band expense and the mimimum
            * band expense for the event.  If the difference is greater than
            * the max band fee definded above, then set the band admin fee
            * to the max percentage.  (for example: if the band minium is 600
            * and the new band expense is 700.  The difference is 100.
            *  If the band percentage was set at *70%, * this would mean
            * the band is only allowed $70 at maximum, so we would need to
            * set the band's admin fee at $70
          **/
          const r = newBandExpense - event.band_minimum;
          let bandAdmin;
          bandAdmin = r > maxBandPercentage ? maxBandPercentage : r;
          if (r > maxBandPercentage) {
            bandAdmin = maxBandPercentage;
          } else {
            bandAdmin = r;
          }

          /**
            * Define the venue's admin fee by calculating what the band's
            * admin fee was and if the venue admin comes out to be higher
            * than the max venue fee then set the venue admin fee to the max fee's value.
          **/
          let venueAdmin = parseInt(((bandAdmin / (bandExpense.percent / 100)) - bandAdmin).toFixed(1), 10); // eslint-disable-line
          if (venueAdmin > maxVenuePercentage) {
            venueAdmin = maxVenuePercentage;
          }


          /* Take away the admin fees from the new expenses and then check the
           * status of the admin fee.  Then set the admin fee to the sum of
           * the two admin fees */
          newBandExpense -= bandAdmin;
          newVenueExpense -= venueAdmin;
          newAdminFee = bandAdmin + venueAdmin;
        }
      } else { // if there are no percentages assigned
        newAdminFee = 0;
        newVenueExpense = (event.totalRevenue * parseInt(venueExpense.percent, 10)) / 100; // eslint-disable-line
        venueMod = newVenueExpense % 1;
        newVenueExpense -= venueMod;
        newBandExpense = (event.totalRevenue * (bandExpense.percent / 100));
      }

      /* Checking for a negative admin fee */
      if (newAdminFee < 0) {
        newAdminFee = 0;
      }

      /* Checking if the new admin fee is greater than the event fee,
       * if it is set the admin fee to the max event fee */
      if (newAdminFee > event.max_fee) {
        newAdminFee = event.max_fee;
      }
    } else if (event.totalRevenue === 0) { // Reset everything to 0 if there is no revenue
      newBandExpense = 0;
      newVenueExpense = 0;
      newAdminFee = 0;
    }

      /* Get the total of all expenses */
    const totalExpenses = getTotalEventExpenses(event.expenses);

      /* If the admin fee status is set to 'noadminfee' then set all the
       * options to zero, and return the total expenses. This functionality
       * is for the "Remove Admin Fee" button inside the app */
    const eventRef = eventsRef.child(eventId);
    const expensesRef = eventRef.child('expenses');
    if (adminFeeStatus === 'NoAdminFee') {
      eventRef.update({
        fee: 0,
        max_fee: 0,
        band_minimum: 0,
        totalExpenses,
      });
    } else {
      eventRef.update({
        fee: newAdminFee,
        totalExpenses,
      });
    }

    /* Check to see if there is a bandExpense */
    if (newBandExpense) { // not sure if this is needed, check this
      expensesRef.child(bandExpenseId).update({
        cost: newBandExpense,
      });
    }
    if (newVenueExpense) { // not sure if this is needed, check this
      expensesRef.child(venueExpenseId).update({
        cost: newVenueExpense,
      });
    }
  }
}

export function removeAdminFee(eventId) {
  updateExpenses(eventId, 'NoAdminFee');
  updateTotals(eventId);
  updateCash(eventId);
}
