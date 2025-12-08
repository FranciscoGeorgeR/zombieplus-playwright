import { expect, test } from '../support';

import data from '../support/fixtures/tvshows.json' assert { type: 'json' };

import { executeSQL } from '../support/database';

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM public.tvshows`)
})

test('Deve ser possível cadastrar uma nova série', async ({ page }) => {
    const serie = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(serie)
    await page.popup.haveText(`A série '${serie.title}' foi adicionada ao catálogo.`)

})

test('Deve poder remover uma série cadastrada', async ({ page, request }) => {
    const serie = data.to_remove
    await request.api.postSerie(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.remove(serie.title)
    await page.popup.haveText('Série removida com sucesso.')


})

test('Não permitir o cadastro de séries com títulos já existentes.', async ({ page, request }) => {
    const serie = data.duplicate

    await request.api.postSerie(serie)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(serie)
    await page.popup.haveText(`O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

})

test('Garantir que séries não sejam cadastradas sem os campos obrigatórios preenchidos', async ({ page }) => {

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')

    await page.tvshows.Series()
    await page.tvshows.goForm()
    await page.tvshows.submit()

    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'

    ])

})

test('Deve realizar buscar pelo termo Zumbi', async({ page, request }) => {
    const series = data.search

    series.data.forEach(async(m)=> {
        await request.api.postSerie(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search(series.input)

    await page.tvshows.tableHave(series.outputs)

})
