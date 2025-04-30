/**
 * Centralized response types for admin route actions
 * Used across various admin routes and components
 */

// Common response type for admin actions
export type AdminActionResponse =
  | { success: true; message?: string; url?: string; key?: string } // Success (with optional message, url for uploads)
  | { success: false; error: string } // Error with message
  | { error: string }; // For unauthorized access, etc
