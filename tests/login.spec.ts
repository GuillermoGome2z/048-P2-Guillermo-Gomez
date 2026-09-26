import { test, expect } from '@playwright/test';

test('01 - Login correcto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Make Appointment' }).click();

  await page.locator('#txt-username').fill('John Doe');
  await page.locator('#txt-password').fill('ThisIsNotAPassword');
  await page.locator('#btn-login').click();

  await expect(page).toHaveURL(/#appointment/);
  await expect(page.getByRole('heading', { name: 'Make Appointment' })).toBeVisible();
});

test('02 - Login incorrecto parametrizado con for...of', async ({ page }) => {
  const credencialesInvalidas = [
    { usuario: 'wrong_user', password: 'wrong_password' },
    { usuario: 'John Doe', password: 'wrong_password' },
    { usuario: '', password: '' },
  ];

  for (const credenciales of credencialesInvalidas) {
    await page.goto('/profile.php#login');
    await page.locator('#txt-username').fill(credenciales.usuario);
    await page.locator('#txt-password').fill(credenciales.password);
    await page.locator('#btn-login').click();

    await expect(
      page.getByText('Login failed! Please ensure the username and password are valid.')
    ).toBeVisible();
  }
});

test('03 - Mostrar formulario de login', async ({ page }) => {
  await page.goto('/profile.php#login');

  await expect(page.locator('#txt-username')).toBeVisible();
  await expect(page.locator('#txt-password')).toBeVisible();
  await expect(page.locator('#btn-login')).toBeVisible();
});

test('04 - Crear una cita', async ({ page }) => {
  await page.goto('/profile.php#login');
  await page.locator('#txt-username').fill('John Doe');
  await page.locator('#txt-password').fill('ThisIsNotAPassword');
  await page.locator('#btn-login').click();

  await page.locator('#combo_facility').selectOption('Hongkong CURA Healthcare Center');
  await page.locator('#chk_hospotal_readmission').check();
  await page.locator('input[name="programs"][value="Medicaid"]').check();
  await page.locator('#txt_visit_date').click();
  await page.locator('.datepicker-days td.day:not(.old):not(.new)').filter({ hasText: '30' }).click();
  await page.locator('#txt_comment').fill('Cita de prueba automatizada');
  await page.locator('#btn-book-appointment').click();

  await expect(page.getByRole('heading', { name: 'Appointment Confirmation' })).toBeVisible();
});