import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

/**
 * Log a custom event to Firebase Analytics
 * @param eventName - The name of the event
 * @param eventParams - Optional parameters for the event
 */
export async function logAnalyticsEvent(
  eventName: string,
  eventParams?: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
}

/**
 * Log a page view event
 * @param pageTitle - The title of the page
 * @param pagePath - The path of the page
 */
export async function logPageView(pageTitle: string, pagePath: string): Promise<void> {
  await logAnalyticsEvent('page_view', {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: window.location.href,
  });
}

/**
 * Set the user ID for analytics
 * @param userId - The unique user identifier
 */
export async function setAnalyticsUserId(userId: string | null): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics && userId) {
      setUserId(analytics, userId);
    }
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
}

/**
 * Set user properties for analytics
 * @param properties - User properties to set
 */
export async function setAnalyticsUserProperties(
  properties: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      setUserProperties(analytics, properties);
    }
  } catch (error) {
    console.error('Error setting user properties:', error);
  }
}

/**
 * Log a sign-up event
 * @param method - The sign-up method (e.g., 'google', 'apple', 'email')
 */
export async function logSignUpEvent(method: string): Promise<void> {
  await logAnalyticsEvent('sign_up', { method });
}

/**
 * Log a login event
 * @param method - The login method (e.g., 'google', 'apple', 'email')
 */
export async function logLoginEvent(method: string): Promise<void> {
  await logAnalyticsEvent('login', { method });
}

/**
 * Log a broker connection event
 * @param brokerName - The name of the broker being connected
 */
export async function logBrokerConnectionEvent(brokerName: string): Promise<void> {
  await logAnalyticsEvent('connect_broker', { broker_name: brokerName });
}

/**
 * Log a search event
 * @param searchTerm - The search term used
 */
export async function logSearchEvent(searchTerm: string): Promise<void> {
  await logAnalyticsEvent('search', { search_term: searchTerm });
}

/**
 * Log a button click event
 * @param buttonName - The name or ID of the button clicked
 * @param location - Optional location context
 */
export async function logButtonClick(buttonName: string, location?: string): Promise<void> {
  await logAnalyticsEvent('button_click', {
    button_name: buttonName,
    ...(location && { location }),
  });
}

/**
 * Log a modal open event
 * @param modalName - The name of the modal
 */
export async function logModalOpen(modalName: string): Promise<void> {
  await logAnalyticsEvent('modal_open', { modal_name: modalName });
}

/**
 * Log a modal close event
 * @param modalName - The name of the modal
 */
export async function logModalClose(modalName: string): Promise<void> {
  await logAnalyticsEvent('modal_close', { modal_name: modalName });
}

/**
 * Log an error event
 * @param errorMessage - The error message
 * @param errorContext - Optional context about where the error occurred
 */
export async function logErrorEvent(errorMessage: string, errorContext?: string): Promise<void> {
  await logAnalyticsEvent('error', {
    error_message: errorMessage,
    ...(errorContext && { error_context: errorContext }),
  });
}



