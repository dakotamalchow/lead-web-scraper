const puppetter = require("puppeteer");
const mongoose = require("mongoose");

const Lead = require("../leads/model");

require("dotenv").config();

const wait = (delay) => {
    console.log("wait");
    return new Promise(resolve => setTimeout(resolve, delay));
}

exports.scrape = async() => {
    mongoose.connect(process.env.ATLAS_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch(error => {
        console.log("Error connecting to Mongo: " + error);
    });
    
    const zipCodes = ["60004","60015","60016","60022","60025","60029","60035","60043","60053","60062","60069","60070","60082","60089","60090","60093","60693"];
    const zillowUrl = "https://www.zillow.com/";

    // const browser = await puppetter.launch({
    //     headless: false,
    //     args: [`--window-size=1920,1080`]
    // });
    const wsChromeEndpointUrl = "ws://127.0.0.1:9222/devtools/browser/31f3af82-ad94-4264-80de-f57d6b05afb8";
    const browser = await puppetter.connect({
        browserWSEndpoint: wsChromeEndpointUrl
    })
    console.log("Browser opened");

    try {
        const page = await browser.newPage();
        await page.setViewport({ 'width': 1920, 'height': 1080 });

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
            await page.click("input[placeholder='Neighborhood/City/Zip']",{clickCount: 3});
            await page.type("input[placeholder='Neighborhood/City/Zip']",zipCode);
            await page.keyboard.press("Enter");
            await wait(1000);
            console.log(`Searched for zip code ${zipCode}`);

            let nextPage = true;
            let pageNumber = 1;
            while(nextPage) {
                try {
                    await page.waitForSelector(`table[aria-label="Professional's table"] tbody tr`);
                    const rows = await page.$$(`table[aria-label="Professional's table"] tbody tr`);
                    console.log(`Page ${pageNumber}`);

                    for(let i=1; i<=rows.length; i++) {
                        const companyNameElement = await page.$(`table[aria-label="Professional's table"] tbody tr:nth-child(${i}) td:nth-child(1) div[class*='Summary'] div:nth-child(5)`);
                        const representativeNameElement = await page.$(`table[aria-label="Professional's table"] tbody tr:nth-child(${i}) td:nth-child(1) div[class*='Summary'] a:nth-child(1)`);
                        const phoneNumberElement = await page.$(`table[aria-label="Professional's table"] tbody tr:nth-child(${i}) td:nth-child(1) div[class*='Summary'] div:nth-child(2)`);

                        let representativeName = "";
                        if(representativeNameElement) {
                            representativeName = await (await representativeNameElement.getProperty("textContent")).jsonValue();
                            if(representativeName.includes("null")) continue;
                        }

                        let companyName = "";
                        if(companyNameElement) {
                            companyName = await (await companyNameElement.getProperty("textContent")).jsonValue();
                        }

                        let phoneNumber = "";
                        if(phoneNumberElement) {
                            const phoneNumberUnformatted = await (await phoneNumberElement.getProperty("textContent")).jsonValue();
                            phoneNumber = phoneNumberUnformatted.split("phone number")[1];
                        } else {
                            continue;
                        }

                        const existingLead = await Lead.findOne({representativeName, companyName, phoneNumber});
                        if (!existingLead) {
                            const newLead = new Lead({representativeName, companyName, phoneNumber, leadType: "Property Manager", zipCodes:[zipCode]});
                            await newLead.save();
                            console.log("New lead:", newLead);
                        } else {
                            if (!existingLead.zipCodes.includes(zipCode)) {
                                existingLead.zipCodes.push(zipCode);
                                await existingLead.save();
                                console.log("Existing lead new zip code:", existingLead);
                            }
                            console.log("Existing lead:", existingLead);
                        }
                    }

                    const nextPageElement = await page.$("button[title='Next page']:not([disabled])");
                    if(nextPageElement) {
                        await page.click("button[title='Next page']:not([disabled])");
                        pageNumber++;
                        await wait(1000);
                    } else {
                        nextPage = false;
                        pageNumber = 1;
                    }
                } catch(error) {
                    nextPage = false;
                    console.log(error);
                }
            }
            await wait(1000);
        }
    } catch(error) {
        console.log(error);
    }
}

exports.scrape();