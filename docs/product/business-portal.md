# Business portal

The Choices Business Portal is a web app for venue owners and their teams. It is
where a venue controls what clients see about it in the Choices app, and where it
sees what Choices brings in return. The portal's screens are implemented in this
repository; this document describes what each part does and the rules behind it.

Every portal feature connects to something clients see or do in the app. That
connection is what a venue pays for.

## Features

| # | Feature | What the owner does | What clients see | Plan |
|---|---|---|---|---|
| 1 | Onboarding | Sets up the venue in three steps: profile, hours and photos, first offer | The venue appears in Explore | All |
| 2 | Venue profile | Edits name, category, description, price level, tags, photos, hours, location and WhatsApp number | Venue page, the filters it matches, the match score | All |
| 3 | Branches | Manages several locations from one account | "Choose a branch" | Enterprise |
| 4 | Offers | Creates, schedules, pauses, ends and duplicates deals, with a live phone preview | Popular Offers, the offer on the venue page, "Remind me" | Starter: 10 active; Growth and up: unlimited |
| 5 | Events | Lists events with date, price, "Booking required" and spots left | Events category, calendar, big upcoming events | All |
| 6 | Dashboard | Checks today's numbers, live offers, upcoming bookings and a setup checklist | — | All |
| 7 | Analytics | Sees views, swipes, saves, reminders, calendar adds, WhatsApp taps, trip inclusions, busiest hours and view sources | — | Growth and up |
| 8 | Reviews | Reads ratings, including trip-stop ratings, and replies | "What people say" | All |
| 9 | Customers | Sees people who saved, rated, liked or planned a trip with the venue | — | All |
| 10 | Bookings | Confirms and checks in reservations | Not in the client app yet (open question) | All |
| 11 | Notifications | Gets alerts for new bookings, new reviews, offers ending and a weekly summary | — | All |
| 12 | Team | Invites managers and staff; each role sees different parts | — | All |
| 13 | Billing and plan | Changes plan, sees invoices, updates the card | Growth: priority placement in search and Swipe picks | All |
| 14 | Help and support | Reads FAQs, contacts support, replays the portal tour | — | All |

## Layout

The portal has a sidebar with the nine sections (Dashboard, Offers & Events,
Bookings, Customers, Analytics, Venue profile, Billing & plan, Settings, Help &
support), the venue's name, area and plan, and the account menu. Each page has a
title, search, the notification bell and one main action in the top right, for
example **New offer** on the dashboard and Offers page, or **Save changes** on
the profile. On narrow screens the sidebar becomes a slide-out menu.

## Feature details

### 1. Onboarding

A new venue signs up from **List your venue** on the sign-in page and goes
through three steps:

1. **Create your profile**: venue name, type of place (Restaurant, Café,
   Lounge, Activity, Events), area and a short description.
2. **Add hours & photos**: opening and closing time, and at least three photos.
   The first photo is the cover.
3. **Post your first offer**: title and type (Discount, Set menu, Happy hour,
   Event), with a live preview of the offer card.

**Finish and go live** opens the dashboard and starts a five-step portal tour.
**Skip for now** goes straight to the dashboard. Owners who skip see a
"Get the most out of Choices" checklist on the dashboard (complete your profile,
add photos, post your first offer) until all three are done.

### 2. Venue profile

The owner edits everything the venue page in the app shows: name, category,
description, price range (Under AED 50, AED 50–150, AED 150+ per person), tags
(Family friendly, Outdoor seating, Free Wi-Fi, Laptop friendly, Pet friendly,
Vegan options, Valet parking, Sea view…), photos in order, opening hours per day,
address and contact details, including the WhatsApp number clients use to
reserve.

A phone mock-up, "How customers see you", updates as the owner edits, so they
can see the listing as a client would.

**Rules**

- Tags, category, price range and hours decide which client filters and
  preferences the venue matches. Changing them changes who sees the venue.
- The first photo is the cover on every card in the app.

### 3. Branches

Enterprise venues manage several locations from one account. The account menu
and Settings list the locations, and switching location changes which branch
the portal is showing. In the app, the venue page lists the branches with their
distance, so the client can pick the nearest.

Starter and Growth venues see an invitation to move to Enterprise instead.

### 4. Offers

Offers are the main way a venue gets noticed. The Offers page has four tabs:
**Active** (including paused offers), **Scheduled**, **Drafts** and **Expired**,
each with a count. Each offer row shows the photo, title, status, deal, type,
time window and dates, views and claims, and actions.

**Creating an offer.** The new offer form asks for type (Discount, Set menu,
Happy hour, Event), title, deal or price, number of redemptions available,
description, photo, and start and end date and time. A phone preview shows the
offer as it will appear in the app. The owner can **Save as draft** or **Publish
offer**.

**Rules**

- An offer needs a title before it can be saved.
- On publish, an offer whose start date is in the future becomes **Scheduled**;
  otherwise it becomes **Active** at once and appears in the app.
- An active offer can be **paused** (hidden from the app until resumed) or
  **ended early** (moved to Expired). Offers also expire on their end date.
- Any offer can be **duplicated** to a new draft; expired offers can be **run
  again** the same way.
- **Starter** venues can have at most **10 active offers**. Trying to create
  another shows a prompt to upgrade to Growth.
- The app has no "claim" button yet. Until it does, a **claim** means a
  client pressed "Remind me" or tapped **Chat on WhatsApp** from the offer; see
  [shared-model.md](shared-model.md#terms-that-need-a-definition).

### 5. Events

Events are listed alongside offers under **Offers & Events** with the type
**Event**. An event has a date and time, a price or "Free entry", and can be
marked **Booking required** with a number of spots. In the app, events appear
in the Events category, on the calendar and in "Big upcoming events", and the
spots left are shown on the card.

### 6. Dashboard

The dashboard greets the owner and shows how the venue is doing for **Today**,
**7 days** or **30 days**:

- Four headline numbers: listing views, offer claims, bookings and conversion,
  each compared with the previous period.
- A chart of views and bookings over the period.
- **Live now**: active offers with the time left and progress.
- **Coming up today**: today's upcoming bookings with Confirm and Check-in
  buttons.
- The setup checklist, until it is complete.

### 7. Analytics

Analytics explains how people find the venue and what makes them come in:

- A chart of views, claims and bookings over time.
- **Best-performing offers**, ranked by claims with conversion rate.
- **Where views come from**: search, recommendations, shared by friends, the
  venue's profile link.
- **Busiest days and hours**: a heat map by day and hour.

The numbers are built from what clients do in the app: viewing the venue page,
swiping right, left or maybe, saving, pressing "Remind me", adding to calendar,
tapping **Chat on WhatsApp** and adding the venue to a planned trip.

**Rules**

- Analytics is part of the **Growth** plan. Starter venues see the page blurred
  with an invitation to upgrade.
- Owners and managers can see analytics; staff cannot.

### 8. Reviews

The Customers page lists reviews with the client's name, star rating, date and
text, the venue's average rating and the number of ratings. The owner can post
one reply per review, which the client is notified about. Ratings clients give a
stop at the end of a planned trip count as reviews of that venue.

### 9. Customers

A list of people who have engaged with the venue, with filters for **All**,
**New**, **Returning** and **Most active**. Each row shows visits, last visit,
offers claimed and bookings. Selecting someone shows their history with the
venue: visits, offers claimed, places saved and trips planned.

Because reservations happen in WhatsApp, this list is built from app signals
(saves, likes, ratings, trip inclusions, WhatsApp taps) as well as bookings.

### 10. Bookings

Bookings shows the day's reservations as a **List** or a weekly **Calendar**:
time, customer and phone number, party size, the offer used and status. A
banner counts bookings waiting to be confirmed.

**Statuses and actions**

- **Needs confirming** → the owner **confirms**, and the customer is notified.
- **Confirmed** → the owner **checks in** the customer when they arrive, which
  also counts any offer as redeemed.
- A requested or confirmed booking can be **cancelled**.
- Bookings not checked in end as **No-show**.

The header action **Add walk-in** records a customer who arrived without
booking.

The client app has no booking screens yet: clients reserve through WhatsApp.
This section is kept as designed and depends on the open question in
[shared-model.md](shared-model.md).

### 11. Notifications

The bell lists new booking requests, offers about to end, new reviews and
upcoming payments. In Settings, the owner switches each type on or off: new
booking, offer expiring (one hour before), new review and a weekly summary
email on Sunday mornings.

### 12. Team

The owner invites colleagues by email as **Manager** or **Staff**. Invited people
show "Invite sent" until they accept.

| Role | Can do |
|---|---|
| Owner | Everything, including billing and the team |
| Manager | Edit offers and events, see analytics |
| Staff | Manage bookings and check customers in, see live offers |

Settings also holds the owner's account details, password, portal language
(English or Arabic) and time zone.

### 13. Billing and plan

Billing shows the current plan and next payment (plus 5% VAT), the payment
card, the three plans and past invoices as PDFs.

| | Starter | Growth | Enterprise |
|---|---|---|---|
| Price | AED 299 / month | AED 799 / month | Custom |
| Active offers | Up to 10 | Unlimited | Unlimited |
| Dashboard | ✓ | ✓ | ✓ |
| Analytics | — | ✓ | ✓ |
| Priority placement in search and Swipe picks | — | ✓ | ✓ |
| Support | Basic, one working day | Priority, within 2 hours | Dedicated account manager |
| Multiple locations | — | — | ✓ |
| API access | — | — | ✓ |

**Rules**

- Billing is monthly with no contract. Cancelling keeps the listing live until
  the end of the billing month.
- Switching between Starter and Growth applies from the same day. Enterprise
  starts with a call from the sales team.
- Prices are provisional; see [README.md](README.md).

### 14. Help and support

Common questions, support contact details (Sunday to Thursday, 9 AM to 9 PM),
**Send a message**, a guide to writing offers that get claimed, and **Replay
portal tour**.

## Sign in and account access

The portal has sign-in, forgot-password and reset-password pages. A reset link
expires after 30 minutes, and a new password needs at least eight characters and
a number. Until authentication is built, the portal opens signed in.
