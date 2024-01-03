import { expect } from "@playwright/test"
import { paymentDetails } from "../data/paymentDetailsData"

export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]').locator('[data-qa="discount-code"]')
        this.discountField = page.locator('[data-qa="discount-code-input"]')
        this.discountSubmitButton = page.getByRole('button', { name: 'Submit discount' })
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountActivatedMessage = page.locator('[data-qa="discount-active-message"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.cardOwnerField = page.locator('[data-qa="credit-card-owner"]')
        this.cardNumberField = page.locator('[data-qa="credit-card-number"]')
        this.validUntilField = page.locator('[data-qa="valid-until"]')
        this.cardCVCField = page.locator('[data-qa="credit-card-cvc"]')
        this.payButton = page.locator('[data-qa="pay-button"]')
    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountField.waitFor()

        //Option 1 for laggy inputs: using .fill() with await expect()
        await this.discountField.fill(code)
        await expect(this.discountField).toHaveValue(code)

        //Option 2 for laggy inputs: slow typing
        // await this.discountField.focus()
        // await this.page.keyboard.type(code, {delay: 1000})
        // await this.page.pause()
        // expect(await this.discountField.inputValue()).toBe(code)

        await this.discountSubmitButton.waitFor()

        await expect(this.discountActivatedMessage).not.toBeVisible()
        //Or
        expect(await this.discountActivatedMessage.isVisible()).toBe(false)

        await this.discountSubmitButton.click()
        await this.discountActivatedMessage.waitFor()

        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText()
        const totalValueOnlyStringNumber = totalValueText.replace("$", "")
        const totalValueNumber = parseInt(totalValueOnlyStringNumber, 10)

        await this.discountedValue.waitFor()
        const discountValueText = await this.discountedValue.innerText()
        const discountValueOnlyStringNumber = discountValueText.replace("$", "")
        const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)
        await expect(totalValueNumber).toBeGreaterThan(discountValueNumber)
    }

    fillPaymentDetails = async (paymentDetailsData) => {
        await this.cardOwnerField.waitFor()
        await this.cardOwnerField.fill(paymentDetails.creditCardOwner)
        await this.cardNumberField.waitFor()
        await this.cardNumberField.fill(paymentDetails.creditCardNumber)
        await this.validUntilField.waitFor()
        await this.validUntilField.fill(paymentDetails.validUntil)
        await this.cardCVCField.waitFor()
        await this.cardCVCField.fill(paymentDetails.creditCardCVC)
        await this.payButton.waitFor()
    }

    completePayment = async () => {
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}