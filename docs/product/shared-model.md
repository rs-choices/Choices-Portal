# How the two sides connect

Clients and business owners use different products, but they work on the same
records. This document lists those records, the states they move through, and
what an action on one side causes on the other. It is the starting point for a
database schema.

## Shared records

| Record | Created by | Shown in the client app | Managed in the portal |
|---|---|---|---|
| Venue | Owner during onboarding, or the Choices team for public spots | Venue page, category lists, search, swipe deck | Venue profile |
| Branch | Owner (Enterprise) | "Choose a branch" on the venue page | Settings → Locations |
| Offer | Owner | Popular Offers, venue page, "Remind me" | Offers & Events |
| Event | Owner | Events category, calendar, big upcoming events | Offers & Events |
| Review | Client, rating a venue or a trip stop | "What people say" | Customers → Reviews, with one owner reply |
| Interaction | Client: view, swipe (right, left, maybe), save, remind, calendar add, WhatsApp tap, trip inclusion | — | Analytics, Customers |
| Booking | Owner (walk-ins) — see open questions | — | Bookings |
| Plan | Owner | Growth and up: priority placement | Billing & plan |

Client-only records, which venues never see individually: the client's
preferences, trips, liked and saved lists, and Energy map.

## Status lifecycles

### Offer

```
draft ──publish──▶ scheduled ──start time──▶ active ⇄ paused
                                                │
                              end date or ended early
                                                ▼
                                             expired
```

- Publishing with a start time already passed skips **scheduled** and goes
  straight to **active**.
- Only **active** offers appear in the app. **Paused** offers are hidden until
  resumed.
- Starter venues can have at most 10 active offers at once.
- Duplicating any offer, or running an expired one again, creates a new
  **draft**.

### Event

**scheduled → live** (on the event date) **→ past**. Events marked "Booking
required" show the number of spots left.

### Booking (portal only for now)

**requested → confirmed → checked in**, or **cancelled**, or **no-show** when a
confirmed booking is never checked in. Walk-ins are recorded straight as
checked in.

## What each side causes on the other

### Owner actions

| The owner… | …and in the app |
|---|---|
| Publishes an offer | It appears in Popular Offers and on the venue page |
| Pauses or ends an offer | It disappears from the app |
| Lets an offer run near its end | Clients who pressed "Remind me" are notified |
| Posts an event | It appears in Events and on the calendar; "spots left" shows if booking is required |
| Edits tags, category, price range or hours | The venue matches different preferences and filters |
| Reorders photos | The first photo becomes the cover everywhere |
| Replies to a review | The reviewer is notified and the reply shows under the review |
| Upgrades to Growth | The venue ranks higher in search and appears more often in Swipe picks |

### Client actions

| The client… | …and in the portal |
|---|---|
| Opens the venue page | A view is counted |
| Swipes right, left or maybe | The swipe is counted in Analytics |
| Saves or likes the venue | It is counted, and the client appears in Customers |
| Presses "Remind me about this offer" | It is counted against that offer |
| Adds the venue to the calendar | It is counted |
| Taps **Chat on WhatsApp** | An inquiry is counted; the conversation itself happens in WhatsApp |
| Adds the venue to a planned trip | A trip inclusion is counted |
| Rates a trip stop or the venue | It appears as a review the owner can reply to |

## Terms that need a definition

The portal design counts **offer claims** and **conversion**, but the client
app has no "claim" action. Until one exists, this is the working definition:

- **Claim**: a client pressed "Remind me about this offer" or tapped **Chat on
  WhatsApp** from an offer.
- **Conversion**: claims divided by listing views, for the same period.

## Open questions

These are recorded, not decided.

1. **In-app booking.** The portal has a Bookings section; the client app sends
   reservations to WhatsApp. Whether and when to add booking screens to the
   app is undecided.
2. **Revenue model.** Venue subscriptions are the assumption. Commission, ads or
   paid placement are not ruled in or out.
3. **Public spots.** Parks, hikes and beaches have no owner. Who adds and
   maintains them, presumably the Choices team, is undecided.
4. **Moderation.** Whether the Choices team approves venues, offers and reviews
   before they go live is undecided.
5. **Offer claims.** Whether to add a real claim or redemption step, which would
   replace the working definition above.
