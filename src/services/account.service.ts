import { apiService } from './api'
import { buildApiUrl } from '@/config'
import type { SendEmailVerificationRequest } from '@/types'

// Account API endpoints
const ACCOUNT_ENDPOINTS = {
    SEND_EMAIL_VERIFICATION: 'accounts/send-verification-email',
    CONFIRM_EMAIL: 'accounts/confirm-email',
} as const

// Account service class
class AccountService {
    /**
     * Send email verification link - returns HTTP 202 Accepted if successful
     */
    async sendVerificationEmail(
        callbackUrl: string,
        returnUrl?: string | null
    ): Promise<void> {
        const url = buildApiUrl(ACCOUNT_ENDPOINTS.SEND_EMAIL_VERIFICATION)
        const requestData: SendEmailVerificationRequest = {
            callbackUrl,
            returnUrl
        }

        // This endpoint returns HTTP 202 Accepted with no response body on success
        await apiService.post<void>(url, requestData)
    }

    /**
     * Confirm email verification with token - returns success if valid
     */
    async confirmEmailVerification(token: string): Promise<void> {
        const url = buildApiUrl(ACCOUNT_ENDPOINTS.CONFIRM_EMAIL)

        // This endpoint throws exception if token is invalid/expired
        await apiService.get<void>(url, { params: { token } })
    }
}

// Create and export the account service instance
export const accountService = new AccountService()