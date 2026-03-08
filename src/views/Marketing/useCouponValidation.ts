import type { Ref } from 'vue'
import { CouponType, DiscountType, RewardType } from '@/types'

export interface CouponFormData {
    type: CouponType
    name: string
    prefix: string
    code: string
    startDate: string
    endDate: string
    allowEarlySave: boolean
    earlySaveDate: string
    rewardType: RewardType
    discountType: DiscountType
    discountAmount: string
    hasMaxDiscount: boolean
    maxDiscountAmount: string
    minOrderValue: string
    totalUsages: string
    maxUsagesPerBuyer: string
    displaySettings: boolean
    currency: string
    applicableProductsType: CouponType
    initialEarlySavePassed: boolean
}

export interface CouponFormErrors {
    common: string[]
    name: string
    code: string
    startDateTime: string
    endDateTime: string
    discountAmount: string
    maxDiscountAmount: string
    minOrderAmount: string
    maxUsageCount: string
    maxUsagePerUser: string
    earlySaveDateTime: string
}

export function useCouponValidation(
    form: Ref<CouponFormData>,
    errors: CouponFormErrors,
    t: (key: string, values?: Record<string, string | number | boolean>) => string,
    isEditMode?: Ref<boolean>,
    initialStartDate?: Ref<string>
) {
    /** Returns true only when value is a finite number greater than zero. */
    const isPositiveFinite = (value: number): boolean => Number.isFinite(value) && value > 0
    /** Name: Required, max 100 chars */
    const validateName = (): boolean => {
        const name = form.value.name.trim()
        if (!name) {
            errors.name = t('coupon.detail.validation.nameRequired')
            return false
        }
        if (name.length > 100) {
            errors.name = t('coupon.detail.validation.nameTooLong')
            return false
        }
        errors.name = ''
        return true
    }

    /** Code: Required, alphanumeric only, max 5 chars (suffix) */
    const validateCode = (): boolean => {
        const code = form.value.code.trim()
        if (!code) {
            errors.code = t('coupon.detail.validation.codeRequired')
            return false
        }
        if (!/^[A-Za-z0-9]+$/.test(code)) {
            errors.code = t('coupon.detail.validation.codeAlphanumeric')
            return false
        }
        if (code.length > 5) {
            errors.code = t('coupon.detail.validation.codeTooLong')
            return false
        }
        errors.code = ''
        return true
    }

    /** StartDate: Required, must be in the future unless editing and the date is unchanged */
    const validateStartDateTime = (): boolean => {
        if (!form.value.startDate) {
            errors.startDateTime = t('coupon.detail.validation.startDateRequired')
            return false
        }

        // Skip the future check only when editing AND the user has not changed the start date
        const dateUnchanged = isEditMode?.value && form.value.startDate === initialStartDate?.value
        if (!dateUnchanged) {
            const isFuture = new Date(form.value.startDate) > new Date()
            if (!isFuture) {
                errors.startDateTime = t('coupon.detail.validation.startDateFuture')
                return false
            }
        }

        errors.startDateTime = ''
        return true
    }

    /** EndDate: Required, must be after StartDate */
    const validateEndDateTime = (): boolean => {
        if (!form.value.endDate) {
            errors.endDateTime = t('coupon.detail.validation.endDateRequired')
            return false
        }
        if (new Date(form.value.endDate) <= new Date(form.value.startDate)) {
            errors.endDateTime = t('coupon.detail.validation.endDateAfterStart')
            return false
        }
        errors.endDateTime = ''
        return true
    }

    /** EarlySaveDate: Must be before startDateTime (can be in the past) */
    const validateEarlySaveDateTime = (): boolean => {
        if (!form.value.allowEarlySave || !form.value.earlySaveDate) {
            errors.earlySaveDateTime = ''
            return true
        }

        const earlyDate = new Date(form.value.earlySaveDate)
        const startDate = new Date(form.value.startDate)

        if (earlyDate >= startDate) {
            errors.earlySaveDateTime = t('coupon.detail.validation.earlySaveBeforeStart')
            return false
        }

        errors.earlySaveDateTime = ''

        return true
    }

    /**
     * DiscountAmount / DiscountPercentage:
     * - Fixed: amount > 0
     * - Percentage: required, 1–100
     */
    const validateDiscountAmount = (): boolean => {
        const value = Number(form.value.discountAmount)
        if (form.value.discountType === DiscountType.FixedAmount) {
            if (!form.value.discountAmount || !isPositiveFinite(value)) {
                errors.discountAmount = t('coupon.detail.validation.discountAmountRequired')
                return false
            }
        } else {
            if (!form.value.discountAmount) {
                errors.discountAmount = t('coupon.detail.validation.discountPercentageRequired')
                return false
            }
            if (!isPositiveFinite(value) || value > 100) {
                errors.discountAmount = t('coupon.detail.validation.discountPercentageRange')
                return false
            }
        }
        errors.discountAmount = ''
        return true
    }

    /**
     * MaxDiscountAmount:
     * Only required when discountType is Percentage AND hasMaxDiscount is true.
     */
    const validateMaxDiscountAmount = (): boolean => {
        if (form.value.discountType === DiscountType.Percentage && form.value.hasMaxDiscount) {
            const value = Number(form.value.maxDiscountAmount)
            if (!form.value.maxDiscountAmount || !isPositiveFinite(value)) {
                errors.maxDiscountAmount = t('coupon.detail.validation.maxDiscountAmountRequired')
                return false
            }
        }
        errors.maxDiscountAmount = ''
        return true
    }

    /** MinOrderAmount: GreaterThan(0) */
    const validateMinOrderAmount = (): boolean => {
        const value = Number(form.value.minOrderValue)
        if (!form.value.minOrderValue || !isPositiveFinite(value)) {
            errors.minOrderAmount = t('coupon.detail.validation.minOrderValueRequired')
            return false
        }

        if (form.value.discountType === DiscountType.Percentage && form.value.hasMaxDiscount) {
            const maxDiscount = Number(form.value.maxDiscountAmount) || 0
            const percentage = Number(form.value.discountAmount) || 0

            if (maxDiscount > 0 && percentage > 0 && value > 0) {
                if (maxDiscount < (value * percentage) / 100) {
                    const currencySymbol = form.value.currency || '₫'
                    const formatCurrency = (amt: number) => `${currencySymbol}${amt.toLocaleString('vi-VN')}`

                    const suggestedMinOrder = formatCurrency(Math.floor((maxDiscount * 100) / percentage))
                    const suggestedPercentage = Math.floor((maxDiscount / value) * 100)
                    const suggestedMaxDiscount = formatCurrency((value * percentage) / 100)

                    errors.minOrderAmount = t('coupon.detail.validation.maxDiscountAmountTooSmall', {
                        suggestedMinOrder,
                        suggestedPercentage,
                        suggestedMaxDiscount
                    })
                    return false
                }
            }
        }

        errors.minOrderAmount = ''
        return true
    }

    /** MaxUsageCount: GreaterThan(0) */
    const validateMaxUsageCount = (): boolean => {
        const value = Number(form.value.totalUsages)
        if (!form.value.totalUsages || !isPositiveFinite(value)) {
            errors.maxUsageCount = t('coupon.detail.validation.totalUsagesRequired')
            return false
        }
        errors.maxUsageCount = ''
        return true
    }

    /** MaxUsagePerUser: GreaterThan(0) */
    const validateMaxUsagePerUser = (): boolean => {
        const value = Number(form.value.maxUsagesPerBuyer)
        if (!form.value.maxUsagesPerBuyer || !isPositiveFinite(value)) {
            errors.maxUsagePerUser = t('coupon.detail.validation.maxUsagesPerBuyerRequired')
            return false
        }
        errors.maxUsagePerUser = ''
        return true
    }

    /** Run all validators, collect results. Returns true only when all pass. */
    const validateAllFields = (): boolean => {
        // Clear common errors first
        errors.common = []

        const results = [
            validateName(),
            validateCode(),
            validateStartDateTime(),
            validateEndDateTime(),
            validateEarlySaveDateTime(),
            validateDiscountAmount(),
            validateMaxDiscountAmount(),
            validateMinOrderAmount(),
            validateMaxUsageCount(),
            validateMaxUsagePerUser(),
        ]
        return results.every(Boolean)
    }

    return {
        validateName,
        validateCode,
        validateStartDateTime,
        validateEndDateTime,
        validateEarlySaveDateTime,
        validateDiscountAmount,
        validateMaxDiscountAmount,
        validateMinOrderAmount,
        validateMaxUsageCount,
        validateMaxUsagePerUser,
        validateAllFields,
    }
}
