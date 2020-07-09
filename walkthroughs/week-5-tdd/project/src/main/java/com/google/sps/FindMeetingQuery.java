// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
 
public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    // Idea:
    // 1) get all attendees
    // 2) get all events associated with those attendees
    // 2.5) set start_time = 8am, x = request.duration
    // 3) for each attendee, check if they have x minutes free from start_time
    //      if any of them don't, then incrememnt start_time by granularity and try again
    //      all attendees have x minutes free, then add that time to the return.

    // Get all attendees invited to this new event.
    Collection<String> attendees = request.getAttendees();

    // For each attendee, get all other events they are involved with.
    HashMap<String, ArrayList<Event>> attendeesEvents = getEventsWithAttendees(events, attendees);
    
    System.out.print("Given attendees: ");
    for (String attendee : attendees) {
      System.out.print(attendee);
      System.out.print(" with events: ");
      for (Event aevents : attendeesEvents.get(attendee)) {
        System.out.print(aevents.getTitle());
        System.out.print(" happening at ");
        System.out.print(aevents.getWhen().start()/60.0);
        System.out.print(" - ");
        System.out.println(aevents.getWhen().end()/60.0);
      }
      System.out.print(", ");
    }
    System.out.println("");

    int startTime = TimeRange.getTimeInMinutes(8, 0);
    int proposedMeetingDuration = (int) request.getDuration();

    ArrayList<TimeRange> compatibleRanges = new ArrayList<>();

    // For each possible start time from 8:00am - (9:00pm-duration) in 30 minute increments,
    // check if that range works with each attendee invited to the new event.
    for (int i = startTime; i < TimeRange.getTimeInMinutes(21, 0) - proposedMeetingDuration; i += 30) {
      
      TimeRange proposedRange = TimeRange.fromStartDuration(i, proposedMeetingDuration);
      boolean proposedRangeWorks = true;

      for (String attendee : attendees) {
        ArrayList<Event> attendeeEvents = attendeesEvents.get(attendee);

        for (Event event : attendeeEvents) {
          if (event.getWhen().overlaps(proposedRange)) {
            proposedRangeWorks = false;
            break;
          }
        }
      }

      if (proposedRangeWorks) {
        compatibleRanges.add(proposedRange);
      }
    }

    System.out.print("We get ranges: \n");
    for (TimeRange range : compatibleRanges) {
      System.out.print(range.start()/60.0);
      System.out.print(" - ");
      System.out.println(range.end()/60.0);
    }
    System.out.println("\n----------");

    return new ArrayList<TimeRange>();
  }

  /** Gets all events that the given attendees are a part of. */
  public HashMap<String, ArrayList<Event>> getEventsWithAttendees(Collection<Event> events, Collection<String> attendees) {

    HashMap<String, ArrayList<Event>> attendeesEvents = new HashMap<>();

    // For each event that we have, get all of its attendees.
    for (Event event : events) {
      Set<String> attendeesForThisEvent = event.getAttendees();
      
      // For each attendee in this event, check if any of our attendees are present.
      for (String attendee : attendeesForThisEvent) {

        // If they are, then we want to add that event to our HashMap.
        if (attendees.contains(attendee)) {
          if (attendeesEvents.containsKey(attendee)) {
            attendeesEvents.get(attendee).add(event);
          }
          else {
            ArrayList<Event> eventList = new ArrayList<>();
            eventList.add(event);
            attendeesEvents.put(attendee, eventList);
          }
        }
      }
    }

    return attendeesEvents;
  }
}
