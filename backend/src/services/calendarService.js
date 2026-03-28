import { google } from "googleapis";
//Google client
const getClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
};
//Calender
export const getAuthUrl = (userId) => {
  const client = getClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    state: userId,
    prompt: "consent",
  });
};

export const getTokens = async (code) => {
  const client = getClient();
  const { tokens } = await client.getToken(code);
  return tokens;
};
//Create calendar events
export const createCalendarEvent = async (userTokens, appointment) => {
  const client = getClient();
  client.setCredentials(userTokens);
  const calendar = google.calendar({ version: "v3", auth: client });

  const event = {
    summary: `Meeting with ${appointment.guestName}`,
    description: appointment.notes || "Scheduled via SchedulePro",
    start: {
      dateTime: appointment.startTime,
      timeZone: appointment.guestTimeZone || "UTC",
    },
    end: {
      dateTime: appointment.endTime,
      timeZone: appointment.guestTimeZone || "UTC",
    },
    attendees: [{ email: appointment.guestEmail }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    return response.data.id;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return null;
  }
};
//Delete calendar event
export const deleteCalendarEvent = async (userTokens, eventId) => {
  const client = getClient();
  client.setCredentials(userTokens);
  const calendar = google.calendar({ version: "v3", auth: client });

  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
    });
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
  }
};
