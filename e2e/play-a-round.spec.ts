import { test, expect } from '@playwright/test';

test.describe('Mental Math Master - Gameplay', () => {
  test('a user can start a game and answer one question correctly', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      (window as any).__E2E_MOCK_AUTHENTICATED_USER__ = {
        token: 'fake-token',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      };
    });

    await page.route('**/user/basicReport', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          data: { gamesPlayed: 0, accuracy: 0, streak: 0, score: 0 },
        }),
      });
    });

    await page.route('**/game/gameLevels/**', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          data: [
            {
              id: '1',
              name: 'Addition & Subtraction L1',
              digitCount: 1,
              operations: 'ADDSUB',
              numberCount: 2,
              type: 'flash',
              icon: '1',
            },
          ],
        }),
      });
    });

    await page.route('**/game/fetchGame', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          data: [
            { value: 10, operation: 'add' },
            { value: 5, operation: 'add' },
          ],
        }),
      });
    });

    await page.route('**/game/saveGame', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          status: 'success',
          data: {},
        }),
      });
    });

    await page.goto('/login');
    await page.getByRole('button', { name: /google/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('[data-testid="game-card"]').first()).toBeVisible();

    // 2. The user starts a new game by clicking on the first game card
    await page.locator('[data-testid="game-card"]').first().click();

    // 3. The user is on the game page and starts the flash game
    await expect(page).toHaveURL(/\/flashgame/);
    await expect(page.getByRole('button', { name: /start training/i })).toBeVisible();
    await page.getByRole('button', { name: /start training/i }).click();

    // 4. The game shows the input form after the numbers play
    await expect(page.getByPlaceholder('Enter result')).toBeVisible();
    await page.getByPlaceholder('Enter result').fill('15');

    // 5. The user validates their answer
    await page.getByRole('button', { name: /validate/i }).click();

    // 6. The user sees a success confirmation
    await expect(page.locator('text=Success!')).toBeVisible();
  });
});