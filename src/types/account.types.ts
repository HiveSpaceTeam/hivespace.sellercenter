// Account-related type definitions

/**
 * Request DTO for sending email verification
 */
export interface SendEmailVerificationRequest {
    callbackUrl: string
    returnUrl?: string | null
}