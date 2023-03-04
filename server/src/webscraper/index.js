const axios = require("axios");
const puppetter = require("puppeteer");

exports.scrape = async() => {
    const zipCodes = ["80226"];
    const zillowUrl = "https://www.zillow.com/";

    // const browser = await puppetter.launch({
    //     headless: false,
    //     args: [`--window-size=1920,1080`]
    // });
    const wsChromeEndpointUrl = "";
    const browser = await puppetter.connect({
        browserWSEndpoint: wsChromeEndpointUrl
    })
    console.log("Browser opened");

    try {
        const page = await browser.newPage();
        // await page.setViewport({ 'width': 1920, 'height': 1080 });

        await page.goto(zillowUrl);
        console.log(`Navigated to ${zillowUrl}`);

        // const rect = await page.$eval('#px-captcha', el => {
        //     const {x, y} = el.getBoundingClientRect();
        //     return {x, y};
        // });
        // const offset = {x: 50, y: 50};
        // await page.mouse.click(rect.x - offset.x, rect.y - offset.y, {
        //     delay: 1000
        // });
        // await page.mouse.click(rect.x + offset.x, rect.y + offset.y, {
        //     delay: 10000
        // });

        await page.waitForSelector("a[data-za-action='Agent finder']");
        await page.click("a[data-za-action='Agent finder']");
        console.log("Clicked on 'Agent finder' tab");

        await page.waitForSelector("ul[aria-label='Professional leaderboards links'] li:nth-child(3) a");
        await page.click("ul[aria-label='Professional leaderboards links'] li:nth-child(3) a");
        console.log("Clicked on 'Property Managers' tab");

        for(const zipCode of zipCodes) {
            await page.waitForSelector("input[placeholder='Neighborhood/City/Zip']");
            await page.type("input[placeholder='Neighborhood/City/Zip']",zipCode);
            await page.keyboard.press("Enter");
            console.log(`Searched for zip code ${zipCode}`);
        }
    } catch(error) {
        console.log(error);
    }
}