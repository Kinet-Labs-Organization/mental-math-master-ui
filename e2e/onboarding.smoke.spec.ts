import { expect, test } from "@playwright/test";

test("onboarding happy path smoke", async ({ page }) => {
  await page.goto("/onboarding");

  // Mock the submission endpoint to ensure the test is not dependent on the backend.
  await page.route('**/api/v1/onboarding/submit', (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    });
  });

  await expect(page.getByText("Let's start with a quick surprise test")).toBeVisible();
  await page.getByPlaceholder("Enter your answer").fill("25");
  await page.getByRole("button", { name: "Submit Answer" }).click();

  await expect(page.getByText("Amazing!")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Your Path to Mastery")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
});
