import { expect } from '@playwright/test';

export class LandingPage {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000');
    }

    async openLeadlModal() {
        //outra estrategia utiliza "/" como sendo contains sem precisar pegar o texto todo
        await this.page.getByRole('button', { name: /Aperte o play/ }).click();

        //espero que o titulo do elemento "modal" tenha o texto "Fila de espera"
        await expect(
            this.page.getByTestId('modal').getByRole('heading')
        ).toHaveText('Fila de espera');

    }

    async submitLeadForm(name, email) {
        await this.page.locator('#name').fill(name);
        await this.page.locator('#email').fill(email);

        await this.page.getByTestId('modal')
            .getByText('Quero entrar na fila!').click();

        //meio de buscar um elemento cuja seja um toast que some rapido 
        // const content = await page.content()
        // console.log(content)

    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target);
    }

}