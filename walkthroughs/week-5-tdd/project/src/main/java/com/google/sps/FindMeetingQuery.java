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

    // Get all attendees invited to this new event.
    Collection<String> attendees = request.getAttendees();

    // For each attendee, get all other events they are involved with.
    HashMap<String, ArrayList<Event>> attendeesEvents = getEventsWithAttendees(events, attendees);
    
    int startTime = TimeRange.START_OF_DAY;
    int proposedMeetingDuration = (int) request.getDuration();
    ArrayList<TimeRange> compatibleRanges = new ArrayList<>();
    int lastRangeDuration = 30;

    // For each possible start time from SOD to (EOD-duration) in 30 minute increments,
    // find the biggest possible open ranges for all attendees.
    for (int i = startTime; i <= TimeRange.END_OF_DAY+1; i += lastRangeDuration) {

      TimeRange lastSuccessfulProposedRange = null;

      // Every iteration, we "append" 30min to the last proposed range and see if it's still valid.
      for (int j = 30; j + i <= TimeRange.END_OF_DAY+1; j += 30) {

        TimeRange proposedRange = TimeRange.fromStartDuration(i, j);
        boolean proposedRangeWorksForAll = true;

        // Check if any of the attendees have conflicts.
        for (String attendee : attendees) {
          if (attendeesEvents.get(attendee) != null) {
            ArrayList<Event> attendeeEvents = attendeesEvents.get(attendee);

            for (Event event : attendeeEvents) {
              if (event.getWhen().overlaps(proposedRange)) {
                proposedRangeWorksForAll = false;
                break;
              }
            }
          }
        }

        // If we managed to append 30min to our proposed range without overlapping anybody else's
        // events, then we can update the last 'successful' (works for everyone) range.
        if (proposedRangeWorksForAll) {
          lastSuccessfulProposedRange = proposedRange;

          // If we're gonna fail the loop conditions on our next loop, make sure to save.
          if (i + j + 30 > TimeRange.END_OF_DAY+1 && lastSuccessfulProposedRange.duration() >= proposedMeetingDuration) {
            compatibleRanges.add(lastSuccessfulProposedRange);
            lastRangeDuration = lastSuccessfulProposedRange.duration();
          }
        }
        // Else, this appending of 30min DID overlap an event, and the last successfully proposed range
        // is the maximum range, and we should use that (if it's not null, that is)
        else if (lastSuccessfulProposedRange != null && lastSuccessfulProposedRange.duration() >= proposedMeetingDuration) {
          compatibleRanges.add(lastSuccessfulProposedRange);
          lastRangeDuration = lastSuccessfulProposedRange.duration();
          break;
        }
        // Else, even our 30min slot was too long and we have to move on.
        else {
          lastRangeDuration = 30;
          break;
        }

      }
    }

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
