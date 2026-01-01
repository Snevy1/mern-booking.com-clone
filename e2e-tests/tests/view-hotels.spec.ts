
import {test, expect} from "@playwright/test"
const UI_URL = "http://localhost:5173/"

test.beforeEach(async({page})=>{
    await page.goto(UI_URL);
    await page.getByRole('link', {name: "Sign In"}).click();
    await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible();
        
     await page.locator("[name=email]").fill("gh@gmail.com");
     await page.locator("[name=password]").fill("password254");
    await page.getByRole("button", {name: "Login"}).click();
     await expect(page.getByText("Sign in Successful")).toBeVisible();
});


test("should be able to view my hotels", async({page})=>{
    await page.goto(`${UI_URL}my-hotels`)

    await expect(page.getByText("Dublin Getaways")).toBeVisible();
    await expect(page.locator(':has-text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultricies sodales rhoncus. Mauris nisl sapien, interdum vitae mi et, porttitor faucibus velit.")').nth(0)).toBeVisible();
    await expect(page.getByText("Dublin,Ireland")).toBeVisible();
    await expect(page.getByText("All Inclusive")).toBeVisible();
    await expect(page.getByText("$119 per night")).toBeVisible();
    await expect(page.getByText("2 adults, children")).toBeVisible();
    await expect(page.getByText("2 Star Rating")).toBeVisible();

     await expect(page.getByRole("link", {name: "View Details"}).nth(0)).toBeVisible()
     await expect(page.getByRole("link", {name: "Add Hotel"})).toBeVisible()


})