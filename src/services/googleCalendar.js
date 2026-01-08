const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

let tokenClient = null;
let gapiInitialized = false;
let gisInitialized = false;

/* ---------------- INIT ---------------- */

export const initGoogleCalendar = () => {
  return new Promise((resolve, reject) => {
    if (gapiInitialized && gisInitialized) return resolve(true);

    try {
      // Load GAPI
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInitialized = true;
        if (gapiInitialized && gisInitialized) resolve(true);
      });

      // Init GIS token client
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: () => {}, // assigned dynamically
      });

      gisInitialized = true;
      if (gapiInitialized && gisInitialized) resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

export const isCalendarReady = () =>
  gapiInitialized && gisInitialized;

/* ---------------- ADD EVENT ---------------- */

export const addEventToCalendar = async ({
  title,
  venue,
  category,
  startDate,
}) => {
  if (!isCalendarReady()) {
    throw new Error("Calendar not initialized");
  }

  return new Promise((resolve, reject) => {
    tokenClient.callback = async (resp) => {
      if (resp.error) return reject(resp);

      try {
        const endDate = new Date(
          startDate.getTime() + 2 * 60 * 60 * 1000
        );

        const event = {
          summary: title,
          location: venue,
          description: `Category: ${category}`,
          start: {
            dateTime: startDate.toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "Asia/Kolkata",
          },
        };

        const res = await gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: event,
        });

        resolve(res);
      } catch (err) {
        reject(err);
      }
    };

    const token = gapi.client.getToken();

    // ✅ Correct logic
    if (!token) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // refresh token silently
      tokenClient.requestAccessToken({ prompt: "" });
    }
  });
};
