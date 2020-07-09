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
import java.util.Set;

public final class FindMeetingQuery {

  public final int INCLUSIVE_END_OF_DAY = TimeRange.END_OF_DAY + 1;

  /**
   * Returns the timeranges >= the proposed meeting length for which all attendees are free to
   * attend.
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    // Get all attendees invited to this new event.
    Collection<String> attendees = request.getAttendees();

    // For each attendee, get all other events they are involved with.
    HashMap<String, ArrayList<Event>> attendeesEvents = getEventsWithAttendees(events, attendees);

    ArrayList<TimeRange> compatibleRanges = new ArrayList<>();
    int lastRangeDuration = 0;

    // Start testing start times, slowly incrementing the range from a given start until it's
    // invalid.
    for (int i = TimeRange.START_OF_DAY; i <= INCLUSIVE_END_OF_DAY; i += lastRangeDuration) {

      TimeRange lastSuccessfulProposedRange = null;

      // Every iteration, we "append" 30min to the last proposed range and see if it's still valid.
      for (int j = 30; j + i <= INCLUSIVE_END_OF_DAY; j += 30) {

        // Increase the last proposedRange by 30 minutes.
        TimeRange proposedRange = TimeRange.fromStartDuration(i, j);

        // Check if the new proposedRange works for everyone.
        if (noAttendeesHaveConflictWithTime(attendees, attendeesEvents, proposedRange)) {
          lastSuccessfulProposedRange = proposedRange;
        } else {
          break;
        }
      }

      // If we managed to set lastSuccessfulProposedRange and it's at least as long as was
      // requested, then it's a timerange in which nobody has conflicts and fits the request, 
      // so we add it to our final tally.
      if (lastSuccessfulProposedRange != null
          && lastSuccessfulProposedRange.duration() >= (int) request.getDuration()) {
        compatibleRanges.add(lastSuccessfulProposedRange);
      }

      // Increment the tested startTime by the time of the last successfully proposed range (or the
      // default 30 minutes).
      lastRangeDuration =
          lastSuccessfulProposedRange != null ? lastSuccessfulProposedRange.duration() : 30;
    }

    // Return the final list of all ranges that are compatible with attendees' calendars.
    return compatibleRanges;
  }

  /** Gets all events that the given attendees are a part of. */
  public HashMap<String, ArrayList<Event>> getEventsWithAttendees(
      Collection<Event> events, Collection<String> attendees) {

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
          } else {
            ArrayList<Event> eventList = new ArrayList<>();
            eventList.add(event);
            attendeesEvents.put(attendee, eventList);
          }
        }
      }
    }

    return attendeesEvents;
  }

  /**
   * Returns true if none of the given attendees have a time conflict with the proposed time range,
   * false otherwise.
   */
  public boolean noAttendeesHaveConflictWithTime(
      Collection<String> attendees,
      HashMap<String, ArrayList<Event>> attendeesEvents,
      TimeRange proposedRange) {

    // For each attendee, retrieve all the events associated with them.
    for (String attendee : attendees) {

      if (attendeesEvents.get(attendee) != null) {
        ArrayList<Event> attendeeEvents = attendeesEvents.get(attendee);

        // If any of the attendee's prior events overlap with the proposed time range,
        // then we have an attendee with a time conflict, and we can return false.
        for (Event event : attendeeEvents) {
          if (event.getWhen().overlaps(proposedRange)) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
