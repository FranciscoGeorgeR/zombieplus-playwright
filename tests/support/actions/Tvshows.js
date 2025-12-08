import { expect } from '@playwright/test'

export class Tvshows {

    constructor(page) {
        this.page = page
    }

    async Series() {
        await this.page.locator('a[href="/admin/tvshows"]').click()
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(series) {

        await this.Series()

        await this.goForm()

        await this.page.getByLabel('Titulo da série').fill(series.title)
        await this.page.getByLabel('Sinopse').fill(series.overview)

        await this.page.locator('#select_company_id .react-select__indicator')
            .click()

        // const html = await this.page.content()
        // console.log(html)     utilizar quando nao consegue inspencionar uma lista flutuante

        await this.page.locator('.react-select__option').filter({ hasText: series.company }).click()

        await this.page.locator('#select_year .react-select__indicator')
            .click()

        // const html = await this.page.content()
        // console.log(html)    

        await this.page.locator('.react-select__option').filter({ hasText: series.release_year }).click()

        await this.page.locator('input[name=cover]').setInputFiles('tests/support/fixtures' + series.cover)

        if (series.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.page.getByLabel('Temporadas').fill(series.season)

        await this.submit()

    }

    async search(target) {
        await this.Series()
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {

        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target);
    }

    async remove(title) {

        await this.Series()

        await this.page.getByRole('row', { name: title }).getByRole('button').click()

        await this.page.click('.confirm-removal')
    }
}