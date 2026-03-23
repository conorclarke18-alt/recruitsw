"use client";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { PublicClientApplication, InteractionRequiredAuthError, AccountInfo } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";

// ─── CONFIGURATION ──────────────────────────────────────────
// After registering the app in Azure AD, paste your Client ID here:
const AZURE_CLIENT_ID = "YOUR_CLIENT_ID_HERE"; // Replace after app registration

const msalConfig = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: typeof window !== "undefined" ? window.location.origin + "/recruitsw" : "http://localhost:3000",
  },
  cache: {
    cacheLocation: "localStorage" as const,
  },
};

const loginScopes = {
  scopes: ["User.Read", "Calendars.ReadWrite", "Mail.Send", "Mail.Read"],
};

let msalInstance: PublicClientApplication | null = null;

function getMsalInstance() {
  if (!msalInstance && typeof window !== "undefined" && AZURE_CLIENT_ID !== "YOUR_CLIENT_ID_HERE") {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
}

// ─── CONTEXT ────────────────────────────────────────────────
interface MicrosoftAuthContextType {
  isConfigured: boolean;
  isAuthenticated: boolean;
  account: AccountInfo | null;
  userName: string | null;
  userEmail: string | null;
  login: () => Promise<void>;
  logout: () => void;
  getCalendarEvents: (startDate: string, endDate: string) => Promise<CalendarEvent[]>;
  getFreeBusySlots: (startDate: string, endDate: string) => Promise<FreeBusySlot[]>;
  sendEmail: (to: string, subject: string, htmlBody: string) => Promise<boolean>;
  isLoading: boolean;
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: string;
  end: string;
  isAllDay: boolean;
  isBusy: boolean;
}

export interface FreeBusySlot {
  date: string;
  startTime: string;
  endTime: string;
  status: "free" | "busy" | "tentative";
}

const MicrosoftAuthContext = createContext<MicrosoftAuthContextType>({
  isConfigured: false,
  isAuthenticated: false,
  account: null,
  userName: null,
  userEmail: null,
  login: async () => {},
  logout: () => {},
  getCalendarEvents: async () => [],
  getFreeBusySlots: async () => [],
  sendEmail: async () => false,
  isLoading: false,
});

export function useMicrosoft() {
  return useContext(MicrosoftAuthContext);
}

// ─── PROVIDER ───────────────────────────────────────────────
export function MicrosoftAuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isConfigured = AZURE_CLIENT_ID !== "YOUR_CLIENT_ID_HERE";

  // Check for existing session on mount
  useEffect(() => {
    if (!isConfigured) return;
    const msal = getMsalInstance();
    if (!msal) return;

    msal.initialize().then(() => {
      const accounts = msal.getAllAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });
  }, [isConfigured]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const msal = getMsalInstance();
    if (!msal || !account) return null;

    try {
      const response = await msal.acquireTokenSilent({ ...loginScopes, account });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msal.acquireTokenPopup(loginScopes);
        return response.accessToken;
      }
      return null;
    }
  }, [account]);

  const getGraphClient = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return null;
    return Client.init({
      authProvider: (done) => done(null, token),
    });
  }, [getAccessToken]);

  const login = useCallback(async () => {
    const msal = getMsalInstance();
    if (!msal) return;

    setIsLoading(true);
    try {
      await msal.initialize();
      const response = await msal.loginPopup(loginScopes);
      setAccount(response.account);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    const msal = getMsalInstance();
    if (!msal) return;
    msal.logoutPopup();
    setAccount(null);
  }, []);

  // ─── Calendar ───────────────────────────────────────────────
  const getCalendarEvents = useCallback(async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    const client = await getGraphClient();
    if (!client) return [];

    try {
      const response = await client
        .api("/me/calendarview")
        .query({
          startDateTime: `${startDate}T00:00:00`,
          endDateTime: `${endDate}T23:59:59`,
        })
        .select("subject,start,end,isAllDay,showAs")
        .orderby("start/dateTime")
        .top(50)
        .get();

      return (response.value || []).map((event: Record<string, unknown>) => ({
        id: event.id as string,
        subject: event.subject as string,
        start: (event.start as Record<string, string>).dateTime,
        end: (event.end as Record<string, string>).dateTime,
        isAllDay: event.isAllDay as boolean,
        isBusy: (event.showAs as string) !== "free",
      }));
    } catch (error) {
      console.error("Failed to fetch calendar:", error);
      return [];
    }
  }, [getGraphClient]);

  const getFreeBusySlots = useCallback(async (startDate: string, endDate: string): Promise<FreeBusySlot[]> => {
    const events = await getCalendarEvents(startDate, endDate);
    const slots: FreeBusySlot[] = [];

    // Generate hourly slots for each weekday and mark as free/busy
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip weekends
      const dateStr = d.toISOString().split("T")[0];

      for (let hour = 9; hour <= 16; hour++) {
        const slotStart = `${String(hour).padStart(2, "0")}:00`;
        const slotEnd = `${String(hour + 1).padStart(2, "0")}:00`;
        const slotStartFull = `${dateStr}T${slotStart}:00`;
        const slotEndFull = `${dateStr}T${slotEnd}:00`;

        const isBusy = events.some((event) => {
          const eventStart = new Date(event.start).getTime();
          const eventEnd = new Date(event.end).getTime();
          const checkStart = new Date(slotStartFull).getTime();
          const checkEnd = new Date(slotEndFull).getTime();
          return eventStart < checkEnd && eventEnd > checkStart && event.isBusy;
        });

        slots.push({ date: dateStr, startTime: slotStart, endTime: slotEnd, status: isBusy ? "busy" : "free" });
      }
    }

    return slots;
  }, [getCalendarEvents]);

  // ─── Email ──────────────────────────────────────────────────
  const sendEmail = useCallback(async (to: string, subject: string, htmlBody: string): Promise<boolean> => {
    const client = await getGraphClient();
    if (!client) return false;

    try {
      await client.api("/me/sendMail").post({
        message: {
          subject,
          body: { contentType: "HTML", content: htmlBody },
          toRecipients: [{ emailAddress: { address: to } }],
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  }, [getGraphClient]);

  return (
    <MicrosoftAuthContext.Provider
      value={{
        isConfigured,
        isAuthenticated: !!account,
        account,
        userName: account?.name || null,
        userEmail: account?.username || null,
        login,
        logout,
        getCalendarEvents,
        getFreeBusySlots,
        sendEmail,
        isLoading,
      }}
    >
      {children}
    </MicrosoftAuthContext.Provider>
  );
}
