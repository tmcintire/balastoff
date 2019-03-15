import * as React from 'react';

export const Instructions = () => (
  <div className="container">
    <h1 className="text-center">Instructions</h1>
    <hr />

    <h2 className="text-center">IF A DANCER IS REGISTERED FOR THE EVENT AND CHECKING IN FOR THE FIRST TIME</h2>

    <ol>
      <li>{'Greet each participant with a smile and "Welcome, recruit!"'}</li>
      <li>{'Ask for the dancers name to locate them on the registration list (list is organized by last name and can be done \
          using the search bar at the top or control/command + f).'}</li>
      <li>Click on their name to open their registration information.</li>
      <li>Locate their access badge via their registration ID number.</li>
      <li>{'LEVEL: Double check their level check/level color matches on their badge.'}
        <p className="indent"><strong>a. </strong>Flight School and Mercury have a level color due to no level check. Flight
          School begins at 10:00, and Mercury begins at 11:00am. Both are at UAH.</p>
        <p className="indent"><strong>b. </strong>{'Gemini, Apollo, and Skylab all have a "level check" (LC) color. \
          LC is at 10:00am Saturday morning at UAH. They will be issued a separate colored sticker upon completion of \
          the level check. They MUST be present for the LC in order to be placed in these missions.'}</p>
        <p className="indent"><strong>c. </strong>SpaceX has a dark blue color, and their first session is at 1:00pm.</p>
        <p className="indent"><strong>d. </strong>Dance passes are orange in color.</p>
      </li>
      <li>COMPETITIONS: Check to see if the dancer is registered for any competitions.
        <p className="indent"><strong>a. </strong>YES: verify with dancer and confirm the name of their partner.
          <p className="indent"><strong>i. </strong>ADDING A PARTNER: type the name into the box beside the appropriate comp.</p>
        </p>
        <p className="indent"><strong>b. </strong>NO: ask if the dancer would like to add any comps onto their registration
           (dancer must pay at this point for any comps they wish to enter).
          <p className="indent"><strong>i. </strong>If the dancer registers for a comp at this point, record their payment on
            the money in/out sheet and add them to the comps file.</p>
          <p className="indent"><strong>ii. </strong>{'Selected the appropriate drop down menu for the competition they wish to register\
             for and select "yes".'}</p>
          <p className="indent"><strong>iii. </strong>Add partner name if needed. </p>
        </p>
        <p className="indent"><strong>c. </strong>If they are registered for the Ad/Nov, ask if they are leading or following
          and select the appropriate answer on the drop down menu.</p>
      </li>
      <li>{'BALANCES: Check to see if the dancer has an outstanding balance on their registration that they owe to the event.  \
        All dancers must be paid in full before they may receive their access card and enter the event.'}
        <p className="indent"><strong>a. </strong>{'Select "Fully Paid" to notate participant has paid in full before entering event.'}</p>
      </li>
      <li>{'Select "View" by clicking on the registration ID number. '}</li>
      <li>
        {'ACCESS BADGE: Hand dancer their "access badge" for the event. THEY MUST KEEP TRACK OF THEIR BADGE. \
          This will be used during the level check and throughout the weekend.'}
      </li>
      <li>
        GEAR: Check to see if the dancer has any mission gear they have purchased.
        <p className="indent"><strong>a: </strong>YES: direct them to the merchandise table.</p>
        <p className="indent"><strong>a: </strong>NO: tell them they are good to go.</p>
      </li>
      <li>{'Once all of the above steps have been completed, click "Check In!"'}</li>
    </ol>

    <h2 className="text-center">IF A DANCER IS NOT REGISTERED FOR THE EVENT AND CHECKING IN FOR THE FIRST TIME – DAY PASSES ONLY</h2>
    <hr />

    <ol>
      <li>Ask for the dancers name.</li>
      <li>Add the dancer to the registration list, filling in all their details. Full weekend passes and dance
        passes must be cleared by Kirsten Wilson before purchase. Check pricing pages for class passes and dance passes.</li>
      <li>Collect payment from the dancer for their selected items and record it on the money in/out sheet.</li>
      <li>Give the dancer their access badge (lanyard for full weekend, wristband for classes only).
        NOTE: if a dancer registered for a class level above Beginner or Mercury and did not participate in
        the level check, they will need approval from an instructor, Joe Pangburn, or Kadie Pangburn to take it. </li>
    </ol>
  </div>
);
