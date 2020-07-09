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

    // Edge cases:
    // meeting duration of 0

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
      if (attendeesEvents.get(attendee) != null) {
        for (Event aevents : attendeesEvents.get(attendee)) {
          System.out.print(aevents.getTitle());
          System.out.print(" happening at ");
          System.out.print(aevents.getWhen().start()/60.0);
          System.out.print(" - ");
          System.out.println(aevents.getWhen().end()/60.0);
        }
      }
      else {
        System.out.print("none");
      }
      System.out.print(", ");
    }
    System.out.println("");

    int startTime = TimeRange.START_OF_DAY;
    int proposedMeetingDuration = (int) request.getDuration();
    ArrayList<TimeRange> compatibleRanges = new ArrayList<>();
    int lastRangeDuration = 30;

    // For each possible start time from SOD to (EOD-duration) in 30 minute increments,
    // find the biggest possible open ranges for all attendees.
    for (int i = startTime; i <= TimeRange.END_OF_DAY+1; i += lastRangeDuration) {
      System.out.println("We are trying starttime: " + i/60.0 + " (i = " + i + ")");

      TimeRange lastSuccessfulProposedRange = null;

      // Every iteration, we "append" 30min to the last proposed range and see if it's still valid.
      for (int j = 30; j + i <= TimeRange.END_OF_DAY+1; j += 30) {

        TimeRange proposedRange = TimeRange.fromStartDuration(i, j);
        boolean proposedRangeWorksForAll = true;

        System.out.println("We add 30 min to start time to get proposed range: " + proposedRange.start()/60.0 + " - " + proposedRange.end()/60.0 + " (j = " + j + ")");

        // Check if any of the attendees have conflicts.
        for (String attendee : attendees) {
          if (attendeesEvents.get(attendee) != null) {
            ArrayList<Event> attendeeEvents = attendeesEvents.get(attendee);

            for (Event event : attendeeEvents) {
              if (event.getWhen().overlaps(proposedRange)) {
                proposedRangeWorksForAll = false;
                System.out.println("That time didn't work.");
                break;
              }
            }
          }
        }

        // If we managed to append 30min to our proposed range without overlapping anybody else's
        // events, then we can update the last 'successful' (works for everyone) range.
        if (proposedRangeWorksForAll) {
          System.out.println("That time worked for everyone!");
          lastSuccessfulProposedRange = proposedRange;

          // If we're gonna fail the loop conditions on our next loop, make sure to save.
          if (i + j + 30 > TimeRange.END_OF_DAY+1 && lastSuccessfulProposedRange.duration() >= proposedMeetingDuration) {
            System.out.println("This was our last loop.");
            compatibleRanges.add(lastSuccessfulProposedRange);
            lastRangeDuration = lastSuccessfulProposedRange.duration();
          }
        }
        // Else, this appending of 30min DID overlap an event, and the last successfully proposed range
        // is the maximum range, and we should use that (if it's not null, that is)
        else if (lastSuccessfulProposedRange != null && lastSuccessfulProposedRange.duration() >= proposedMeetingDuration) {
          System.out.println("We had a last successful time, so we'll use that. It was: " + lastSuccessfulProposedRange.start()/60.0 + " - " + lastSuccessfulProposedRange.end()/60.0);
          compatibleRanges.add(lastSuccessfulProposedRange);
          lastRangeDuration = lastSuccessfulProposedRange.duration();
          break;
        }
        // Else, even our 30min slot was too long and we have to move on.
        else {
          System.out.println("We didn't have a last successful time, so we move on.");
          lastRangeDuration = 30;
          break;
        }

        System.out.println("CHECK: j = " + (j+30) + ", i = " + i + ", i + j = " + (i + j+30) + ", EOD = " + (TimeRange.END_OF_DAY+1));
      }

      // We update the next start time by the duration of the last range we picked (or by the default, 30 minutes);
      System.out.println("Alright, moving on to next start time.");
      System.out.println("We are adding the last successfully proposed range, " + lastRangeDuration + " to our start time.");
    }

    System.out.print("We get ranges: \n");
    for (TimeRange range : compatibleRanges) {
      System.out.print(range.start()/60.0);
      System.out.print(" - ");
      System.out.println(range.end()/60.0);
    }
    System.out.println("\n----------");

    return compatibleRanges;
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
