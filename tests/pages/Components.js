import { expect } from '@playwright/test'

export class Toast {

    constructor(page) {
        this.page = page
    }

    async haveText(messageToast) {
        const toast = this.page.locator('.toast')

        await expect(toast).toContainText(messageToast);
        await expect(toast).not.toBeVisible({ timeout: 5000 });
    }
}