
import { test, expect } from '../support';
import { faker } from '@faker-js/faker';
import { executeSQL } from '../support/database';

test.beforeAll(async () => {
    await executeSQL(`DELETE FROM public.leads`)
})

test('Deve cadastrar um lead na fila de espera', async ({ page }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(message)
})

test('Não deve cadastrar quando o email já existe', async ({ page, request }) => {

  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }  
  })

  expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.popup.haveText(message)
})

test('Não deve cadastrar com e-mail incorreto', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm('Chico da Silva', 'teste.com.br')

  await page.leads.alertHaveText('Email incorreto');
})

test('Não deve cadastrar quando o nome não preenchido', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm('', 'teste@teste.com')

  await page.leads.alertHaveText('Campo obrigatório');
})

test('Não deve cadastrar quando E-mail não é preenchido', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm('Chico da Silva', '')

  await page.leads.alertHaveText('Campo obrigatório')
})

test('Não deve cadastrar quando nenhum campo é preenchido', async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadlModal()
  await page.leads.submitLeadForm('', '')

  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
})