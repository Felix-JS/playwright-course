export class RegisterPage {
    constructor(page) {
        this.page = page
        
        this.emailInput = page.getByPlaceholder('E-Mail')
        this.passwordInput = page.getByPlaceholder('Password')
        this.registerButton = page.getByRole('button', { name: 'Register' })
    }

    signUpAsNewUser = async (email, password) => {
        //type into email input
        await this.emailInput.waitFor()
        await this.emailInput.fill(email)

        //type into password input
        await this.passwordInput.waitFor()
        await this.passwordInput.fill(password)

        //click on register button
        await this.registerButton.waitFor()
        await this.registerButton.click()
    }
}