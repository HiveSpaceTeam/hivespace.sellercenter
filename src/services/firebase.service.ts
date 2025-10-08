import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import type { ConfirmationResult } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCSKp6_RxHDx8uNrnuM4uEzl3kRM6MxAws",
  authDomain: "hivespace-f3b3e.firebaseapp.com",
  projectId: "hivespace-f3b3e",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Phone OTP Service
class PhoneOTPService {
  private recaptchaVerifier: RecaptchaVerifier | null = null
  private confirmationResult: ConfirmationResult | null = null

  // Initialize reCAPTCHA verifier
  initRecaptcha(containerId: string): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear()
    }

    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved - will be handled in sendOTP
      },
      'expired-callback': () => {
        throw new Error('reCAPTCHA expired. Please try again.')
      }
    })
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized')
      }

      if (!phoneNumber) {
        throw new Error('Please enter a valid phone number')
      }

      // Format phone number to include country code
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

      this.confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, this.recaptchaVerifier)

      return {
        success: true,
        message: `Verification code sent to ${formattedPhone}`
      }
    } catch (error: unknown) {
      console.error('Error sending OTP:', error)

      // Clear reCAPTCHA on error
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear()
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code'
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  // Verify OTP code
  async verifyOTP(code: string): Promise<{ success: boolean; message: string; idToken?: string }> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request a new code.')
      }

      if (!code || code.length !== 6) {
        throw new Error('Please enter a valid 6-digit code')
      }

      const result = await this.confirmationResult.confirm(code)
      const idToken = await result.user.getIdToken()

      return {
        success: true,
        message: 'Phone number verified successfully',
        idToken
      }
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error)

      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code'
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  // Send ID token to backend for verification
  async verifyWithBackend(idToken: string): Promise<{ success: boolean; message: string; user?: Record<string, unknown> }> {
    try {
      const response = await fetch('/api/auth/verify-firebase-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          deviceId: 'web-client',
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error(`Backend authentication failed: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        success: true,
        message: 'Authentication successful',
        user: result.user
      }
    } catch (error: unknown) {
      console.error('Backend verification failed:', error)

      const errorMessage = error instanceof Error ? error.message : 'Backend authentication failed'
      return {
        success: false,
        message: errorMessage
      }
    }
  }

  // Clean up
  cleanup(): void {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear()
      this.recaptchaVerifier = null
    }
    this.confirmationResult = null
  }
}

export const phoneOTPService = new PhoneOTPService()
