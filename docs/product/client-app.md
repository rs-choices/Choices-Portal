# Client app

The Choices mobile app is for people deciding what to do with their free time.
This document describes the app exactly as the Figma design shows it. Screen
numbers refer to pages of the Figma export (`Choices.pdf`). Ideas that go beyond
the design are in [suggestions.md](suggestions.md), not here.

The app has five tabs: **Home**, **Explore**, **Plan** (the centre button),
**My Trips** and **Profile** (screen 23).

## Features

| # | Feature | What the client does | Screens | Link to the portal |
|---|---|---|---|---|
| 1 | Welcome slides | Swipes through four intro slides | 1–5 | — |
| 2 | Sign up and log in | Signs up with a phone number and SMS code, email, Apple or Google; adds name and birth date; accepts the terms (18+) | 6–13 | — |
| 3 | Preference quiz | Picks food, activities, spending range, distance, dietary needs and interests | 14–19 | Matched against venue tags and categories |
| 4 | Permissions | Turns on daily reminders and location | 20–22 | — |
| 5 | Home | Searches by mood; browses popular offers, categories, Plan My Day, Swipe Today's Picks and Explore Today's Places | 24–30 | Offers and venues come from the portal |
| 6 | Search and filters | Searches; sorts by recommended, discount or rating; filters by distance, day or night, price, cuisine, availability and difficulty | 31–34 | Filter values come from venue profiles |
| 7 | Categories | Browses Food & Beverage, Activities, Events and Leisure and their sub-types | 35–36, 40–44, 49 | Venue category |
| 8 | Venue page | Sees match score, tags, map, branches, hours, live offer, reviews; sets a reminder, adds to calendar, chats on WhatsApp; rejects, saves or likes | 37–39, 42, 45, 48, 54, 122 | Profile, branches, offers, reviews; every action feeds portal analytics |
| 9 | Swipe Today's Picks | Swipes a card deck: right to like, left to reject, middle to keep as "maybe" | 50–53 | Swipe counts; Growth plan placement |
| 10 | Liked and saved places | Keeps lists of liked and saved places by category | 55, 65–66 | Saves appear in portal Customers and Analytics |
| 11 | Plan My Day | Sets up a trip and collects one place per slot by swiping or from saved places | 81–104 | Trip inclusions counted in the portal |
| 12 | Route | Gets a generated route with map, time, distance and stops; adds it to the calendar, invites friends, starts navigation | 97–100, 107–111 | — |
| 13 | My Trips and calendar | Sees upcoming, in-progress and past trips and a calendar of Choices events and personal plans; shares trips | 81, 105–106, 110, 118–121 | Events come from the portal |
| 14 | Ratings | Rates each stop of a trip, the whole trip, and Choices itself | 112–117 | Stop ratings appear as portal reviews |
| 15 | Notifications | Gets alerts about new places, trends and a weekly vibe recap | 67–69 | Offer and event alerts come from portal content |
| 16 | Profile and Energy map | Sees vibe statistics, "This week in vibes", saved places and recent activity | 56–57 | — |
| 17 | Settings | Edits profile, changes phone number, updates preferences, gets help, reads FAQs and legal pages, turns notifications off, deactivates the account, logs out | 58–64, 70–80 | Help messages go to the Choices team |

## Feature details

### 1. Welcome slides

Four slides introduce the app: "Your next adventure starts here" (activities
and experiences), "Find your perfect table" (food and drinks), "Never miss a
moment" (events and nightlife) and "Ready to make your choice?". Each slide has
**Continue** and **Skip**; the last one has **Get Started**.

### 2. Sign up and log in

The client enters a phone number with a country code, then a four-digit code
sent by SMS, which can be resent after a two-minute countdown. Email, Apple and
Google sign-in are alternatives. The app then asks for an email address (for
account recovery, skippable), first and last name, and birth date. The client
must tick **I agree** to the Terms of Use and Privacy Notice, confirming they are
at least 18, before **Next** is enabled.

### 3. Preference quiz

A short series of choices tunes recommendations from the start:

- **What do you like to eat?** Cuisine tiles such as Italian, Fast Food, Asian,
  Burgers, Lebanese and French.
- **What gets you moving?** Activity tiles such as Hiking & Nature, Sports &
  Fitness, Swimming & Beach, Rock Climbing, Cycling and Spa & Wellness.
- **What's your usual spending range?** Per outing, per person: Budget-friendly,
  Mid-range, Premium or No limits.
- **How far will you go?** Nearby, Short drive or Anywhere.
- **Anything else we should know?** Dietary restrictions (Halal, Vegan,
  Vegetarian, Gluten-free, Dairy-free, none), event interests and activity
  interests.

Every step can be skipped. The last step ends with **Finish & Explore** and a
"Ready to start the journey?" screen.

### 4. Permissions

Two steps ask for notification permission ("Enable daily reminders") and
location ("Enable location"). Both can be declined with **No thanks**.

### 5. Home

The top bar shows the client's area and a notification bell. Below it:

- A **"What are you in the mood for?"** search bar with a filter button.
- **Popular Offer**: a large card for a live deal, for example "The Rooftop Bar,
  30% off all drinks today, until 11 PM, 0.5 mi".
- **All Categories**: Food & Beverage, Events, Activities and Leisure, each with
  a count of places.
- **Plan My Day**: the entry to the trip planner.
- **Swipe Today's Picks**: the entry to the swipe deck.
- **Explore Today's Places**: a grid of nearby places to browse.

### 6. Search and filters

Search opens with **Featured** places, **Recent searches** and **Popular offers**.
The filter sheet has:

- **Sort by**: Recommended, Discount (offers of 50% and above) or Rating.
- **Filter by**: distance range, mood (All, Day, Night), price range ($, $$,
  $$$), availability (Free entry, Booking available), difficulty (Easy, Medium,
  Hard) and cuisine.

List pages also sort by Distance, Top rated and New, and events can be narrowed
to Today, Tomorrow, This week, Weekend or This month.

### 7. Categories

**All Categories** lists Food & Beverage, Activities, Events and Leisure. Each
category page has its own search, a Swipe Today's Picks banner, sub-type tiles
(for example Night, Day, Art and Comedy for events; Hiking, Spa, Beach and Games
for activities), featured places and popular offers.

### 8. Venue page

The venue page is where a client decides. It shows:

- Photos with a Day/Night or Indoor/Outdoor switch.
- "Matched 5+ preferences", the venue name, category, price, star rating and
  tags such as Open now, Family friendly, Delivers, Outdoor seating and
  Trending now.
- **Location & distance** with a map, and **Choose a branch** when the venue has
  several locations.
- **Hours** for today and the week, and **Date** for events.
- A live offer with **Remind me about this offer**, or **Add to calendar**.
- **What people say**: recent reviews.
- **Chat on WhatsApp — Make an inquiry or reservation**. This is the only way to
  reserve: the conversation happens in WhatsApp, outside Choices.
- Three actions at the bottom: reject, save and like.

Events also show the price, "Booking required" and "4 spots left".

### 9. Swipe Today's Picks

A full-screen deck of places. Each card shows the name, type, location,
distance, duration and tags. Swiping right likes the place, left rejects it,
and the middle button keeps it as a "maybe". The deck can be switched between
Day and Night and between Indoor and Outdoor, and a counter shows how many
places have been liked.

### 10. Liked and saved places

**Liked** lists every place the client swiped right on. **Saved Places** groups
saved places by category (F&B, Activities, Leisure, Events) with a count each.

### 11. Plan My Day

The planner builds a day out in three stages:

1. **Trip setup**: date, half day (up to 5 hours) or full day (5+ hours), start
   and end time, who with (Family, Friends, Partner, Alone) and how many
   people, budget per person, starting point, and where to end: a chosen
   destination, **Surprise me**, or **I have an event** (type, location and
   time). The app can also offer **Suggested routes** based on the client's
   interests, each with a match percentage.
2. **Build your day**: the client picks the kinds of stops they want
   (breakfast, beach, hiking, sunset drinks…), orders them, sets a time for
   each and can add custom slots.
3. **Your journey**: for each slot, the client collects places, either by
   swiping (with a short tutorial on right, left and maybe) or by choosing
   from saved places, then picks one per slot. **Generate journey** builds the
   route.

### 12. Route

After "Creating your route", the app shows the itinerary: a map with numbered
stops, total time, distance and number of stops, and each stop with its place
and time. The client can add the trip to the calendar, invite friends, edit the
trip, share it, start navigation or delete it.

### 13. My Trips and calendar

**My Trips** has Upcoming and Past tabs. Trips show a status (Upcoming, In
progress with a progress bar, Completed), date, duration and stops. Completed
trips can be shared or rated. A calendar view shows Choices events and the
client's personal plans by day, with **Big upcoming events** listed below.

### 14. Ratings

After a trip, "How was your experience?" asks for stars and a message for each
stop in turn, then for the trip overall ("Rate Choices Trip advisor"). A summary
screen shows the ratings given.

### 15. Notifications

Notifications are grouped into Today and Previous. Examples: "Live music starts
tonight in Mar Mikhael", "A new Italian place matches your taste", "Sunset spots
are trending near you" and "Your weekly vibe recap is ready". Tapping one opens
the related place or event.

### 16. Profile and Energy map

The profile shows the client's photo, name, bio and counts, and an **Energy
map**: a breakdown of what the client's activity leans toward (for example
Nightlife 43%, Cafés 25%), with a sentence such as "Your vibe lately leans
toward spontaneous city nights". **This week in vibes** lists matching places,
followed by saved places and recent activity. New clients see empty states
that invite them to start exploring.

### 17. Settings

**Settings & Activity** includes:

- **Profile details**: name, email, birth date, phone number (changing it needs
  a verification code) and bio.
- **Preferences**: food and drinks, activities, spending range and discovery
  radius, the same choices as the quiz.
- **Saved places**, **About Choices**, **Help** (a message form with type of
  inquiry, plus phone, email and WhatsApp), **FAQs**, **Privacy policy** and
  **Terms & conditions**.
- A notifications switch, **Deactivate account** (confirmed with an emailed
  code) and **Log out**.

## Not in the design

- **In-app booking.** Reservations happen in WhatsApp. See the open questions in
  [shared-model.md](shared-model.md).
- **Arabic.** The app designs are English only.
