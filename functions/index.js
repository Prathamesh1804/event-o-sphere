const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { google } = require("googleapis");
const admin = require("firebase-admin");

admin.initializeApp();

// Configuration
const CALENDAR_ID = "primary"; 
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

/**
 * Callable function to add an event to Google Calendar
 */
exports.addCalendarEvent = onCall(async (request) => {
  // 1. Auth check: Only admins can call this
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in.");
  }
  
  const isAdmin = request.auth.token.admin === true || 
                  request.auth.token.email === "prathameshjawale1804@gmail.com";
                  
  if (!isAdmin) {
    throw new HttpsError("permission-denied", "Only admins can add events.");
  }

  const { title, venue, category, startDate } = request.data;
  
  if (!title || !startDate) {
    throw new HttpsError("invalid-argument", "Missing event details.");
  }

  try {
    // 2. Initialize Google Auth with Service Account
    // This looks for service-account.json in the functions/ folder.
    // Ensure you have added this file to your project and enabled the Calendar API.
    const auth = new google.auth.GoogleAuth({
      keyFile: "service-account.json", 
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    // 3. Prepare the event
    const start = new Date(startDate);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const event = {
      summary: title,
      location: venue,
      description: `Category: ${category}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    // 4. Insert the event
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: event,
    });

    return { success: true, eventId: response.data.id };
  } catch (error) {
    console.error("Error adding event to calendar:", error);
    throw new HttpsError("internal", "Failed to add event to Google Calendar.", error.message);
  }
});
