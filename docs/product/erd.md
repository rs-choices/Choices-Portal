# Database structure (ERD)

This document describes the tables Choices needs, what each one holds, how they
link to each other and the rules they must follow. It is a first overview for
the start of the project, not a finished schema: it uses plain field types
rather than database code, and it has no diagram. It can be read as it is, or
pasted into Claude Design to draw the diagram.

It is built only from what exists today: the client app Figma export
(`Choices.pdf`, 122 screens), the Business Portal design, and the other
documents in this folder. Ideas from [suggestions.md](suggestions.md) are left
out. Anything the designs show but the product has not decided is included and
marked **Undecided**, with the reason, so that nothing is lost and nothing is
mistaken for a decision.

## How to read this document

Each table is listed with its fields. The columns mean:

- **Field**: the name of the piece of information.
- **Type**: what kind of value it is (see the list below).
- **Required**: **Yes** if every row must have it, **No** if it can be empty.
- **Notes**: what it means, where it shows in the designs, and any link to
  another table.

Field types:

| Type | Meaning |
|---|---|
| ID | The unique identifier of the row. Every table has one, called `id`. |
| Link to *Table* | Points to one row of another table (a foreign key). |
| Text | A short piece of text, such as a name. |
| Long text | A paragraph, such as a description or a review. |
| Number | A whole number, such as a party size. |
| Money | An amount with its currency, such as AED 299. |
| Percent | A value from 0 to 100. |
| Yes/No | True or false. |
| Date, Time, Date and time | A calendar date, a time of day, or both. |
| Choice | One value from a fixed list, given in the notes. |
| Choices | Several values from a fixed list. |
| Location | A point on the map (latitude and longitude). |
| Image | A stored photo. |

Every table also has **created at** and **updated at** dates. They are not
repeated in each table below.

Relationships are written as:

- **One to one**: each row on one side matches at most one row on the other.
- **One to many**: one row on the left side has many rows on the right side.
- **Many to many**: many on each side, joined through a linking table, which is
  named.

## Domains at a glance

| # | Domain | Tables | What it covers |
|---|---|---|---|
| A | Accounts | Account, Client profile, Business user | Who signs in, to which product |
| B | Places | Category, Sub-type, Tag, Venue, Venue sub-type, Venue tag, Branch, Opening hours, Venue photo | Everything a venue listing is made of |
| C | Offers and events | Offer, Event | What venues post for clients |
| D | Client taste | Client preferences, Client interest | The preference quiz and its settings page |
| E | Client activity | Interaction, Place reaction, Saved place, Offer reminder, Calendar item | What clients do in the app, which feeds portal analytics |
| F | Trips | Trip, Trip stop, Stop candidate, Trip invitee, Suggested route | Plan My Day, routes and My Trips |
| G | Reviews | Review, Trip rating | Ratings, "What people say" and owner replies |
| H | Bookings | Booking, Offer claim | Reservations and redemptions (**Undecided**) |
| I | Venue business | Team member, Plan, Subscription, Invoice | The portal team, plans and billing |
| J | Messages | Notification, Notification setting, Support request | Alerts and help messages on both sides |

Some things on the screens are **calculated, not stored**. They have no table;
see [Calculated, not stored](#calculated-not-stored).

---

## A. Accounts

A person signs in once, as an **Account**. A client account gets a **Client
profile**. A venue owner or team member gets a **Business user** record. Sign-in
itself (SMS codes, email, Apple, Google, passwords, reset links and the
verification codes used to change a phone number or delete an account) is
handled by the authentication service, so it needs no table of its own here.

### A1. Account

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| phone | Text | No | With country code. The client app's main sign-in. Unique. |
| email | Text | No | For recovery in the app, and for sign-in in the portal. Unique. |
| sign-in methods | Choices | Yes | Phone, Email, Apple, Google, Password |
| kind | Choice | Yes | Client, Business, Choices team |
| status | Choice | Yes | Active, Deactivated |
| deactivated at | Date and time | No | Set when a client confirms **Deactivate account** with the emailed code |

### A2. Client profile

One per client account. Filled in during sign-up and in **Profile details**.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| account | Link to Account | Yes | One to one |
| first name | Text | Yes | |
| last name | Text | Yes | |
| birth date | Date | Yes | The client must be at least 18 |
| bio | Text | No | "Always chasing rooftops & live music." |
| photo | Image | No | Profile picture |
| banner | Image | No | **Change banner** on Profile details |
| terms accepted at | Date and time | Yes | When the client ticked **I agree** |
| terms version | Text | Yes | Which Terms and Privacy Notice they accepted |
| notifications on | Yes/No | Yes | The single notifications switch in Settings |
| location allowed | Yes/No | Yes | The answer to "Enable location" |
| last known area | Text | No | The area shown at the top of Home, for example "Dbayeh". Optional to store; see open questions |

### A3. Business user

One per portal account. The same person can work for several venues through
**Team member** (I1).

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| account | Link to Account | Yes | One to one |
| full name | Text | Yes | |
| language | Choice | Yes | English, Arabic |
| time zone | Text | Yes | For example Asia/Dubai |
| portal tour seen at | Date and time | No | Empty until the five-step tour is finished or skipped |

---

## B. Places

A **Venue** is the listing a client sees: its name, category, description,
photos and tags. A **Branch** is one physical location of that venue, with its
own address, map pin, WhatsApp number and hours. Every venue has at least one
branch. Only Enterprise venues can have more than one, which is where "Choose a
branch" appears in the app.

### B1. Category

The four top-level groups in **All Categories**.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| name | Text | Yes | Food & Beverage, Activities, Events, Leisure. Unique. |
| position | Number | Yes | Display order |
| icon | Image | No | |

### B2. Sub-type

The tiles inside a category, and the cuisine and activity choices in the quiz.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| category | Link to Category | Yes | One category has many sub-types |
| name | Text | Yes | For example Italian, Burgers, Sushi, Breakfast, Hiking, Spa, Beach, Rock climbing, Night, Art, Comedy, Live music. Unique within its category. |
| position | Number | Yes | Display order |

### B3. Tag

The labels on venue pages and in filters. Each has a group so the app knows
which filter or quiz step it belongs to.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| name | Text | Yes | Unique |
| group | Choice | Yes | Amenity (Family friendly, Outdoor seating, Free Wi-Fi, Laptop friendly, Pet friendly, Valet parking, Sea view, Delivers), Dietary (Halal, Vegan, Vegetarian, Gluten-free, Dairy-free), Experience (Beginner friendly, Solo friendly, Adrenaline rush), Vibe (Views, Nature, Chill) |

### B4. Venue

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| name | Text | Yes | |
| category | Link to Category | Yes | One category has many venues |
| description | Long text | No | |
| price level | Choice | No | $ (under AED 50), $$ (AED 50–150), $$$ (AED 150+), per person |
| mood | Choice | No | Day, Night, Both. Used by the Day/Night switch and filter |
| setting | Choice | No | Indoor, Outdoor, Both. Used by the Indoor/Outdoor switch |
| difficulty | Choice | No | Easy, Medium, Hard. Activities only |
| typical duration | Number | No | In minutes, for example 240 for "4h" on a swipe card |
| free entry | Yes/No | Yes | Availability filter |
| booking available | Yes/No | Yes | Availability filter, and "Booking required" on cards |
| is public spot | Yes/No | Yes | Yes for parks, hikes and beaches with no owner. **Undecided**: who adds and maintains them |
| status | Choice | Yes | Draft (onboarding not finished), Live, Hidden |
| went live at | Date and time | No | Set by **Finish and go live**. Used for "New" sorting and "a new place just dropped" |

The average rating, the number of ratings, the cover photo and whether the venue
is open now are calculated, not stored.

### B5. Venue sub-type

Linking table: a venue can have several sub-types (Roadsters is "American,
Burgers").

| Field | Type | Required | Notes |
|---|---|---|---|
| venue | Link to Venue | Yes | |
| sub-type | Link to Sub-type | Yes | The pair is unique |

### B6. Venue tag

Linking table between Venue and Tag.

| Field | Type | Required | Notes |
|---|---|---|---|
| venue | Link to Venue | Yes | |
| tag | Link to Tag | Yes | The pair is unique |

### B7. Branch

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many branches |
| name | Text | Yes | For example "Verdun" or "Hamra" |
| is main | Yes/No | Yes | Exactly one main branch per venue |
| address | Text | Yes | "Verdun Street, Beirut" |
| area | Text | Yes | Used in portal onboarding and in the app header |
| city | Text | Yes | |
| location | Location | Yes | For the map, distance and walking time |
| phone | Text | No | |
| WhatsApp number | Text | Yes | Opened by **Chat on WhatsApp**, the only way to reserve today |
| status | Choice | Yes | Open, Temporarily closed, Closed |

### B8. Opening hours

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| branch | Link to Branch | Yes | One branch has many rows, usually one per weekday |
| weekday | Choice | Yes | Monday to Sunday |
| opens | Time | No | Empty when closed that day |
| closes | Time | No | Can be after midnight, for example 11 AM to 1 AM |
| closed | Yes/No | Yes | |

### B9. Venue photo

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many photos |
| image | Image | Yes | |
| position | Number | Yes | The photo at position 1 is the cover everywhere in the app |
| shows | Choice | No | Day, Night, Indoor, Outdoor. Lets the venue page switch photos |

---

## C. Offers and events

### C1. Offer

A deal a venue posts. It appears in **Popular Offers** and on the venue page.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many offers |
| branch | Link to Branch | No | Empty means every branch |
| type | Choice | Yes | Discount, Set menu, Happy hour, Event (see the note under Event) |
| title | Text | Yes | Needed before an offer can even be saved as a draft |
| deal | Text | No | "30% off all drinks", "AED 45 set menu" |
| discount percent | Percent | No | Used by "Sort by Discount" (50% and above) |
| price | Money | No | For set menus |
| description | Long text | No | |
| photo | Image | No | |
| starts at | Date and time | No | Needed to publish |
| ends at | Date and time | No | Needed to publish. "Valid until 11 PM tonight" |
| daily from | Time | No | For offers that run only part of each day, such as a morning deal |
| daily until | Time | No | |
| redemptions available | Number | No | How many times the offer can be used. Empty means no limit |
| status | Choice | Yes | Draft, Scheduled, Active, Paused, Expired |
| published at | Date and time | No | |
| ended early at | Date and time | No | Set when the owner ends it before its end date |
| copied from | Link to Offer | No | Set when an offer is duplicated or run again |
| created by | Link to Business user | Yes | |

### C2. Event

Something that happens on a date: a concert, an exhibition, a comedy night.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | The host, for example Sursock Museum. One venue has many events |
| branch | Link to Branch | No | Where it takes place |
| sub-type | Link to Sub-type | Yes | An Events sub-type such as Night, Day, Art, Comedy, Live music |
| title | Text | Yes | "Stand-up Comedy Night" |
| description | Long text | No | The programme text on the event page |
| photo | Image | No | |
| starts at | Date and time | Yes | |
| ends at | Date and time | No | |
| all day | Yes/No | Yes | "All Day" on the card |
| price | Money | No | Empty when free entry |
| free entry | Yes/No | Yes | |
| booking required | Yes/No | Yes | |
| capacity | Number | No | Total spots. "4 spots left" is capacity minus confirmed bookings |
| featured | Yes/No | Yes | For "Big upcoming events" on the calendar. **Undecided**: whether Choices picks these or they are simply the biggest |
| status | Choice | Yes | Scheduled, Live, Past |

**Note:** the portal lists events under **Offers & Events**, and the offer form
has an **Event** type. This overview keeps Event as its own table, because
events have a date, capacity and their own lifecycle and category in the app.
Whether the offer type **Event** should be removed, or should create an Event
row, is **Undecided**.

---

## D. Client taste

### D1. Client preferences

One per client. The single-choice answers from the preference quiz, editable
later in Settings → Preferences.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | One to one |
| spending range | Choice | No | Budget-friendly, Mid-range, Premium, No limits. Empty if skipped |
| discovery radius | Choice | No | Nearby (under 2 km), Short drive (up to 10 km), Anywhere |
| quiz finished at | Date and time | No | Empty if the client skipped the quiz |

### D2. Client interest

The multi-choice answers from the quiz: cuisines, drinks, activities, dietary
needs, event and activity interests. Each answer points to a Sub-type or a Tag,
so it can be matched directly against venues.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | One client has many interests |
| kind | Choice | Yes | Food, Drinks, Activity, Dietary, Event interest, Activity interest |
| sub-type | Link to Sub-type | No | For example Italian, Hiking, Comedy |
| tag | Link to Tag | No | For example Halal, Vegan |

Rule: exactly one of **sub-type** or **tag** is filled. The same interest cannot
be added twice for the same client.

---

## E. Client activity

### E1. Interaction

A log of everything a client does with a venue, offer or event. It is never
edited, only added to. The portal's Analytics, Dashboard and Customers pages
are counted from it.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | |
| venue | Link to Venue | Yes | |
| branch | Link to Branch | No | When known |
| offer | Link to Offer | No | When the action was on an offer |
| event | Link to Event | No | When the action was on an event |
| trip | Link to Trip | No | For trip inclusions |
| action | Choice | Yes | View, Swipe right, Swipe left, Swipe maybe, Save, Like, Remind me, Add to calendar, WhatsApp tap, Trip inclusion, Share |
| source | Choice | No | Search, Recommendation, Swipe deck, Category page, Shared by a friend, Profile link, Notification, Trip planner. Feeds "Where views come from" |
| happened at | Date and time | Yes | Feeds charts and the busiest hours heat map |

### E2. Place reaction

The client's latest verdict on a venue from the swipe deck or the venue page.
The **Liked** list is every row with the reaction Liked.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | |
| venue | Link to Venue | Yes | The pair client and venue is unique |
| reaction | Choice | Yes | Liked, Maybe, Rejected |
| reacted at | Date and time | Yes | |

### E3. Saved place

The **Saved Places** list, grouped in the app by the venue's category.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | |
| venue | Link to Venue | Yes | The pair client and venue is unique |
| saved at | Date and time | Yes | |

### E4. Offer reminder

Created when a client presses **Remind me about this offer**.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | |
| offer | Link to Offer | Yes | The pair client and offer is unique |
| notified at | Date and time | No | When the "offer ending soon" reminder was sent |

### E5. Calendar item

What the client adds to the calendar under **Personal**: a venue visit, an
event or a trip. The **Choices** calendar tab shows events directly from the
Event table and needs no rows here.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | |
| kind | Choice | Yes | Venue visit, Event, Trip |
| venue | Link to Venue | No | For a venue visit |
| event | Link to Event | No | For an event |
| trip | Link to Trip | No | For a trip |
| date | Date | Yes | |
| time | Time | No | |

Rule: exactly one of **venue**, **event** or **trip** is filled, matching the
kind.

---

## F. Trips

A **Trip** is one planned day out. It is made of ordered **Trip stops**, one per
slot ("Breakfast", "Beach", "Hiking"). While planning, the client collects
several **Stop candidates** per stop and then picks one.

### F1. Trip

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | The planner. One client has many trips |
| title | Text | Yes | "Batroun Coastal Day" |
| date | Date | Yes | |
| length | Choice | Yes | Half day (up to 5 hours), Full day (5+ hours) |
| starts at | Time | Yes | |
| ends at | Time | Yes | |
| with who | Choice | Yes | Family, Friends, Partner, Alone |
| people | Number | Yes | 1 or more |
| budget from | Money | No | Per person |
| budget to | Money | No | Per person |
| start label | Text | Yes | "Current location" or an address |
| start location | Location | Yes | |
| end choice | Choice | Yes | Chosen destination, Surprise me, I have an event |
| end label | Text | No | "Batroun, Lebanon" |
| end location | Location | No | |
| end event | Link to Event | No | When the client ends at a Choices event |
| outside event name | Text | No | When the event is not on Choices, for example a concert |
| outside event time | Date and time | No | |
| suggested route | Link to Suggested route | No | When the trip started from one |
| status | Choice | Yes | Planning, Route ready, Upcoming, In progress, Completed |
| total minutes | Number | No | Filled when the route is generated ("~7h 10m") |
| total distance | Number | No | In kilometres ("92 km") |
| route path | Long text | No | The drawn route from the maps service |

### F2. Trip stop

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| trip | Link to Trip | Yes | One trip has many stops |
| position | Number | Yes | Order in the day, unique within the trip |
| sub-type | Link to Sub-type | No | The kind of stop, such as Breakfast or Hiking |
| custom title | Text | No | For a custom slot, such as "Visit Teta" |
| from | Time | Yes | |
| until | Time | Yes | |
| main activity | Yes/No | Yes | The starred stop. At most one per trip |
| venue | Link to Venue | No | The chosen place. Empty until chosen, and can stay empty for a custom slot |

Rule: each stop has either a **sub-type** or a **custom title**.

### F3. Stop candidate

The places a client collects for a stop, by swiping or from saved places.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| stop | Link to Trip stop | Yes | One stop has many candidates |
| venue | Link to Venue | Yes | The pair stop and venue is unique |
| verdict | Choice | Yes | Chosen, Maybe, Rejected. Rejected places do not appear again for this trip |
| came from | Choice | Yes | Swipe, Saved places |

### F4. Trip invitee

The friends shown under **Invite Friends** on the route.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| trip | Link to Trip | Yes | One trip has many invitees |
| client | Link to Client profile | No | When the friend uses Choices |
| name | Text | Yes | |
| phone | Text | No | When the friend is invited from contacts |
| status | Choice | Yes | Invited, Accepted, Declined |

**Undecided:** the design shows invited names but no invite or friends flow. It
is not known whether friends must have a Choices account.

### F5. Suggested route

The ready-made day trips on **Suggested Routes**, such as "Batroun Coastal Day,
35 km, 40 min".

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| title | Text | Yes | |
| highlights | Text | Yes | "Beach · Breakfast spots · Historic ports" |
| distance | Number | Yes | In kilometres |
| duration | Number | Yes | In minutes |
| stops | Long text | No | The kinds of stops and venues it proposes |
| status | Choice | Yes | Active, Hidden |

The match percentage is calculated per client, not stored. **Undecided:**
whether these routes are written by the Choices team or generated.

---

## G. Reviews

### G1. Review

A star rating of a venue, shown under **What people say** and in the portal.
The rating a client gives each stop at the end of a trip is also a review.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| client | Link to Client profile | Yes | One client writes many reviews |
| venue | Link to Venue | Yes | One venue has many reviews |
| branch | Link to Branch | No | |
| trip stop | Link to Trip stop | No | Set when the review came from rating a trip stop |
| stars | Number | Yes | 1 to 5 |
| message | Long text | No | |
| status | Choice | Yes | Published, Hidden. **Undecided:** whether reviews are checked before they go live |
| reply | Long text | No | The owner's one reply |
| replied by | Link to Business user | No | |
| replied at | Date and time | No | The client is notified |

Rules: one review per client per trip stop. One reply per review, which is why
the reply is kept on the review itself.

### G2. Trip rating

The rating of the whole trip ("Rate Choices Trip advisor"). It rates the Choices
planner, so venues never see it.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| trip | Link to Trip | Yes | One to one |
| stars | Number | Yes | 1 to 5 |
| message | Long text | No | |

---

## H. Bookings (Undecided)

The portal design has a full Bookings section. The client app has no booking
screens: clients reserve in WhatsApp, outside Choices. These tables follow the
portal design, so the portal can record bookings by hand (walk-ins and WhatsApp
reservations) even if the app never books directly.

### H1. Booking

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many bookings |
| branch | Link to Branch | Yes | |
| client | Link to Client profile | No | Empty when the customer is not a known Choices user |
| customer name | Text | Yes | |
| customer phone | Text | No | |
| party size | Number | Yes | 1 or more |
| booked for | Date and time | Yes | |
| offer | Link to Offer | No | The offer used |
| event | Link to Event | No | For events with **Booking required** |
| source | Choice | Yes | Walk-in, WhatsApp (entered by staff), In the app (future) |
| status | Choice | Yes | Requested, Confirmed, Checked in, Cancelled, No-show |
| confirmed at | Date and time | No | The customer is notified |
| checked in at | Date and time | No | |
| cancelled at | Date and time | No | |
| recorded by | Link to Business user | No | Who entered or last handled it |

### H2. Offer claim

The portal counts **claims**, but the app has no claim button. For now a claim
is calculated: a **Remind me** or a **WhatsApp tap** from an offer (both in
Interaction), or a check-in that used the offer (in Booking). This table is only
needed if a real claim or redemption step is added.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| offer | Link to Offer | Yes | One offer has many claims |
| client | Link to Client profile | No | |
| booking | Link to Booking | No | When redeemed at check-in |
| claimed at | Date and time | Yes | |
| redeemed at | Date and time | No | |

---

## I. Venue business

### I1. Team member

Who can use the portal for a venue, and with which role.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many team members |
| business user | Link to Business user | No | Empty until the invitation is accepted |
| invited email | Text | Yes | |
| role | Choice | Yes | Owner, Manager, Staff |
| status | Choice | Yes | Invited ("Invite sent"), Active, Removed |
| invited by | Link to Business user | No | |
| accepted at | Date and time | No | |

### I2. Plan

The subscription plans. Prices are provisional.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| name | Text | Yes | Starter, Growth, Enterprise. Unique |
| monthly price | Money | No | AED 299, AED 799. Empty for Enterprise (custom) |
| max active offers | Number | No | 10 for Starter. Empty means unlimited |
| analytics | Yes/No | Yes | |
| priority placement | Yes/No | Yes | Higher in search and Swipe picks |
| multiple locations | Yes/No | Yes | |
| API access | Yes/No | Yes | |
| support level | Choice | Yes | Basic, Priority, Account manager |

### I3. Subscription

A venue's current and past plans.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| venue | Link to Venue | Yes | One venue has many subscriptions over time, one current |
| plan | Link to Plan | Yes | |
| status | Choice | Yes | Active, Ending (cancelled, live until the month ends), Ended, Payment failed |
| started at | Date | Yes | |
| current period ends | Date | Yes | The next payment date |
| cancelled at | Date and time | No | |
| card brand | Text | No | Shown on Billing. The card itself stays with the payment provider |
| card last four | Text | No | |
| payment provider reference | Text | No | |

### I4. Invoice

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| subscription | Link to Subscription | Yes | One subscription has many invoices |
| period from | Date | Yes | |
| period to | Date | Yes | |
| amount | Money | Yes | Before VAT |
| VAT | Money | Yes | 5% |
| total | Money | Yes | |
| status | Choice | Yes | Due, Paid, Failed |
| PDF | Text | No | Link to the invoice file |

---

## J. Messages

### J1. Notification

One alert for one person, in the app or in the portal.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| account | Link to Account | Yes | Who receives it |
| venue | Link to Venue | No | For portal alerts, which venue it is about |
| type | Choice | Yes | App: New place match, Trending near you, Event starting, Offer ending, Review reply, Weekly vibe recap. Portal: New booking, Offer expiring, New review, Upcoming payment, Weekly summary |
| title | Text | Yes | "Live music starts tonight in Mar Mikhael" |
| body | Long text | No | |
| opens | Choice | No | Venue, Offer, Event, Trip, Booking, Review |
| opens id | Text | No | Which row to open when tapped |
| read at | Date and time | No | |

### J2. Notification setting

Which alert types a person has switched on. Portal users switch each type
separately. Clients have one switch, kept on Client profile, so they need no
rows here.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| business user | Link to Business user | Yes | |
| type | Choice | Yes | New booking, Offer expiring (one hour before), New review, Weekly summary email (Sunday mornings) |
| on | Yes/No | Yes | The pair business user and type is unique |

### J3. Support request

Messages sent from **Help** in the app or **Send a message** in the portal.

| Field | Type | Required | Notes |
|---|---|---|---|
| id | ID | Yes | |
| account | Link to Account | No | Empty if sent before signing in |
| venue | Link to Venue | No | For portal requests |
| first name | Text | Yes | |
| last name | Text | Yes | |
| email | Text | Yes | |
| phone | Text | No | |
| inquiry type | Choice | Yes | The list is not in the design yet |
| message | Long text | Yes | |
| status | Choice | Yes | Open, Answered, Closed |

---

## Relationships

| From | Relationship | To | Through or via |
|---|---|---|---|
| Account | one to one | Client profile | Client profile.account |
| Account | one to one | Business user | Business user.account |
| Category | one to many | Sub-type | Sub-type.category |
| Category | one to many | Venue | Venue.category |
| Venue | many to many | Sub-type | Venue sub-type |
| Venue | many to many | Tag | Venue tag |
| Venue | one to many | Branch | Branch.venue |
| Branch | one to many | Opening hours | Opening hours.branch |
| Venue | one to many | Venue photo | Venue photo.venue |
| Venue | one to many | Offer | Offer.venue |
| Branch | one to many | Offer | Offer.branch (optional) |
| Offer | one to many | Offer | Offer.copied from |
| Venue | one to many | Event | Event.venue |
| Sub-type | one to many | Event | Event.sub-type |
| Client profile | one to one | Client preferences | Client preferences.client |
| Client profile | many to many | Sub-type and Tag | Client interest |
| Client profile | one to many | Interaction | Interaction.client |
| Venue, Offer, Event, Trip | one to many | Interaction | Interaction.venue, .offer, .event, .trip |
| Client profile | many to many | Venue | Place reaction |
| Client profile | many to many | Venue | Saved place |
| Client profile | many to many | Offer | Offer reminder |
| Client profile | one to many | Calendar item | Calendar item.client |
| Client profile | one to many | Trip | Trip.client |
| Suggested route | one to many | Trip | Trip.suggested route |
| Event | one to many | Trip | Trip.end event |
| Trip | one to many | Trip stop | Trip stop.trip |
| Venue | one to many | Trip stop | Trip stop.venue (the chosen place) |
| Trip stop | many to many | Venue | Stop candidate |
| Trip | one to many | Trip invitee | Trip invitee.trip |
| Client profile | one to many | Review | Review.client |
| Venue | one to many | Review | Review.venue |
| Trip stop | one to one | Review | Review.trip stop |
| Business user | one to many | Review | Review.replied by |
| Trip | one to one | Trip rating | Trip rating.trip |
| Venue, Branch | one to many | Booking | Booking.venue, .branch |
| Client profile | one to many | Booking | Booking.client (optional) |
| Offer, Event | one to many | Booking | Booking.offer, .event |
| Offer | one to many | Offer claim | Offer claim.offer |
| Venue | many to many | Business user | Team member |
| Plan | one to many | Subscription | Subscription.plan |
| Venue | one to many | Subscription | Subscription.venue |
| Subscription | one to many | Invoice | Invoice.subscription |
| Account | one to many | Notification | Notification.account |
| Business user | one to many | Notification setting | Notification setting.business user |
| Account | one to many | Support request | Support request.account |

## Rules and constraints

### Accounts

- A client must be at least 18 on the day they sign up, and must accept the
  Terms and Privacy Notice.
- Phone number and email are each unique across all accounts.
- Changing a phone number and deactivating an account both need a verification
  code first.
- A deactivated account cannot sign in. What happens to its reviews and trips is
  an open question.

### Venues

- Every venue has at least one branch and exactly one main branch.
- Only venues on a plan with **multiple locations** (Enterprise) can have more
  than one branch.
- Onboarding needs at least three photos. The photo at position 1 is the cover.
- A venue must have an Owner in Team member, except public spots, which have no
  owner.
- Only **Live** venues appear in the app.

### Offers

- An offer needs a title to be saved at all. It needs a start and end to be
  published.
- On publish, the status becomes **Scheduled** if the start is in the future,
  otherwise **Active**.
- Scheduled becomes Active at its start. Active becomes Expired at its end, or
  when ended early. Active and Paused can switch back and forth.
- Only **Active** offers appear in the app, and only while their venue is Live.
- The number of Active offers per venue cannot exceed the plan's **max active
  offers** (10 on Starter).
- Duplicating an offer, or running an expired one again, creates a new
  **Draft** with **copied from** set.
- An offer's branch, when set, must belong to the offer's venue.

### Events

- Scheduled becomes Live at its start and Past at its end.
- Spots left is capacity minus confirmed and checked-in bookings, and cannot go
  below zero.
- An event with **booking required** should have a capacity.

### Client activity and trips

- A client has at most one reaction and one saved row per venue, and one
  reminder per offer.
- Interactions are only ever added, never changed or deleted, except when an
  account is deleted.
- A trip's stops have unique positions and at most one main activity.
- A place rejected for a trip stop does not appear again for that trip.
- Only a **Completed** trip can be rated.

### Reviews

- Stars are 1 to 5.
- One review per client per trip stop, and one owner reply per review.
- Only the venue's Owner or Manager can reply. **Undecided:** the portal design
  does not say which roles can reply.

### Bookings (Undecided)

- Requested becomes Confirmed or Cancelled. Confirmed becomes Checked in,
  Cancelled or No-show.
- A walk-in is recorded straight as **Checked in**.
- A check-in that uses an offer counts as a redemption of that offer.
- A booking's branch must belong to its venue.

### Team and billing

- Each venue has exactly one Owner.
- Owners can do everything. Managers edit offers and events and see analytics.
  Staff manage bookings, check customers in and see live offers.
- A venue has one current subscription at a time.
- **Analytics** is visible only if the plan includes it, and only to Owners and
  Managers.
- A cancelled subscription keeps the venue Live until the end of the paid
  month.
- VAT is 5% of the amount.

## Calculated, not stored

These appear on screens but come from the tables above, so they are not stored:

| On screen | Calculated from |
|---|---|
| Match score ("Matched 5+ preferences") | Client interest and preferences compared with Venue sub-type, Venue tag, price level and distance |
| Average rating and number of ratings ("(1.2k)") | Review |
| Cover photo | Venue photo at position 1 |
| Open now | Opening hours and the current time |
| Distance and walking time | Branch location and the client's location |
| Places per category ("1758 places") | Venue |
| Trending now | Recent Interaction counts |
| Energy map and "This week in vibes" | The client's Interaction, Place reaction and Saved place, by category and sub-type |
| Profile counts (47, 82, 12) | The client's saved places, reactions and trips. **Undecided:** the design does not label them |
| Suggested route match percentage | Client interest compared with the route's stops |
| Portal dashboard, charts and Analytics | Interaction and Booking |
| Offer claims and conversion | Claims (see Offer claim) divided by venue views, for the same period |
| Customers list, segments and history | Interaction, Saved place, Place reaction, Review, Trip stop and Booking, for that venue |
| Setup checklist | Venue, Venue photo and Offer |
| Spots left | Event capacity and Booking |

## Not stored as tables

- **Static pages**: About Choices, FAQs, Privacy policy and Terms & conditions.
  These can live in the app or in a content service until they need editing
  without a release.
- **Sign-in codes and password resets**: handled by the authentication service.
- **Maps and navigation**: routes and directions come from a maps service.
  Only the result is kept on Trip.
- **Card details**: kept by the payment provider. Only a summary is kept on
  Subscription.

## Open questions

These affect the structure above and are not decided yet.

1. **In-app booking.** If the app gets booking screens, Booking gains rows from
   clients and the **source** In the app is used. If not, Booking holds only what
   staff enter.
2. **Offer claims.** If a real claim or redemption step is added, Offer claim
   becomes a real table. Until then claims are calculated.
3. **Offers and events.** Whether the offer type **Event** stays, goes, or
   creates an Event row.
4. **Public spots.** Who adds and maintains venues with no owner, presumably
   the Choices team, which would need a Choices team role.
5. **Moderation.** If the Choices team approves venues, offers or reviews before
   they go live, each needs a review status and a reviewer.
6. **Friends and invites.** Whether invited friends must have accounts, and
   whether a friends list exists (the Terms mention adding friends and a
   leaderboard, but no screen shows them).
7. **Suggested routes.** Written by the Choices team or generated.
8. **Big upcoming events.** Picked by the Choices team or calculated.
9. **Deleted accounts.** Whether a deleted client's reviews stay (without the
   name) or are removed, and how long interactions are kept for analytics.
10. **Client location.** Whether the client's last area is stored at all, or only
    used on the device.
11. **Reply permissions.** Which portal roles can reply to reviews.
12. **Categories.** The portal's "type of place" (Restaurant, Café, Lounge,
    Activity, Events) does not match the app's four categories. They need one
    shared list.
13. **Currency and market.** The app designs show US$ and Lebanese places; the
    launch is in the UAE with AED. Money fields should store their currency.
