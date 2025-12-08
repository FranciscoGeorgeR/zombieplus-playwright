import { test as base, expect } from '@playwright/test';

import { Login } from './actions/Login.js'
import { Popup } from './actions/Components.js'
import { Movies } from './actions/Movies.js'
import { Leads } from './actions/Leads.js'
import { Tvshows } from './actions/tvshows.js';

import { Api } from './api'

const test = base.extend({
    page: async ({ page }, use) => {

        const context = page

        context['leads'] = new Leads(page)
        context['login'] = new Login(page)
        context['movies'] = new Movies(page)
        context['popup'] = new Popup(page)
        context['tvshows'] = new Tvshows(page)

        await use(context)
    },
    request: async ({ request }, use) => {
        const context = request
        context['api'] = new Api(request)

        await context['api'].setToken()

        await use(context)

    }
})

export { test, expect }