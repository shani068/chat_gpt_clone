// Better Auth client. Same-origin: /api/auth/* is rewritten to the backend,
// so no baseURL is needed and session cookies stay httpOnly and first-party.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

/** Maps Better Auth / OAuth error codes to copy a user can act on. */
export function authErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  switch (code.toLowerCase()) {
    case "access_denied":
      return "Google sign-in was cancelled.";
    case "account_not_linked":
      return "An account with this email already exists. Sign in with your password instead.";
    case "state_mismatch":
    case "state_not_found":
    case "please_restart_the_process":
      return "Your sign-in session expired. Please try again.";
    case "invalid_code":
    case "no_code":
    case "oauth_code_verification_failed":
    case "unable_to_get_user_info":
    case "email_not_found":
      return "Google could not confirm your identity. Please try again.";
    case "unable_to_create_user":
    case "unable_to_create_session":
    case "failed_to_create_user":
    case "failed_to_create_session":
      return "We could not finish signing you in. Please try again.";
    case "provider_not_found":
    case "invalid_callback_request":
      return "Google sign-in is not available right now.";
    case "invalid_email_or_password":
      return "Incorrect email or password.";
    case "user_already_exists":
    case "user_already_exists_use_another_email":
      return "An account with this email already exists.";
    default:
      return "Something went wrong while signing you in. Please try again.";
  }
}
