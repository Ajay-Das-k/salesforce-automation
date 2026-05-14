const { chromium } = require('playwright');

(async () => {

    const URL =
        'https://crmantra-e-dev-ed.develop.lightning.force.com/lightning/r/PriceAdjustmentSchedule/84Xbm000000ClmLEAS/view';

    const PRODUCT = 'Shared Cage';
    const PRODUCT_SELLING_MODEL = 'Term Based - Monthly';
    const ADJUSTMENT_TYPE = 'Percentage';
    const ADJUSTMENT_VALUE = '10';

    const EFFECTIVE_DATE = 'Jan 1, 2026';
    const EFFECTIVE_TIME = '11:45 PM';

    const maxNoOfCabinets = [
        '10',
        '50',
        '100',
        '200',
        '400',
        '600',
        '800',
        '1000'
    ];

    const drawCaps = [
        '3 kVA',
        '4 kVA',
        '5 kVA',
        '6 kVA',
        '7 kVA'
    ];

    const cbeBands = [
        '2 – 3',
        '3 – 4',
        '4 – 5',
        '5 – 6',
        '6 – 7'
    ];

    const context = await chromium.launchPersistentContext(
        './salesforce-profile',
        {
            headless: false,
            slowMo: 500
        }
    );

    const page = await context.newPage();

    page.setDefaultTimeout(60000);

    await page.goto(URL);

    console.log('\nLOGIN TO SALESFORCE');
    console.log('After login press ENTER in terminal...\n');

    process.stdin.resume();

    await new Promise(resolve => {
        process.stdin.once('data', resolve);
    });

    let count = 0;

    for (const cabinet of maxNoOfCabinets) {

        for (const drawCap of drawCaps) {

            for (const cbeBand of cbeBands) {

                count++;

                console.log(`Creating ${count}/200`);

                // CLICK NEW
                await page.locator('button:has-text("New")').nth(2).click();

                // PRODUCT
                const productInput = page.locator(
                    'input[placeholder="Search Products..."]'
                );

                await productInput.fill(PRODUCT);

                await page.waitForTimeout(1500);

                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');

                // PRODUCT SELLING MODEL
                const psmInput = page.locator(
                    'input[placeholder="Search Product Selling Models..."]'
                );

                await psmInput.fill(PRODUCT_SELLING_MODEL);

                await page.waitForTimeout(1500);

                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');

                // ADJUSTMENT TYPE
                await page.locator('select').nth(0).selectOption({
                    label: ADJUSTMENT_TYPE
                });

                // ADJUSTMENT VALUE
                const adjustmentValueInput =
                    page.locator('input[type="text"]').nth(2);

                await adjustmentValueInput.fill(ADJUSTMENT_VALUE);

                // DATE
                const dateInput =
                    page.locator('input[placeholder="Select a date"]').first();

                await dateInput.fill(EFFECTIVE_DATE);

                // TIME
                const timeInput =
                    page.locator('input[placeholder="Select a time"]').first();

                await timeInput.fill(EFFECTIVE_TIME);

                // NEXT
                await page.locator('button:has-text("Next")').click();

                await page.waitForTimeout(2000);

                // MAX NO OF CABINETS
                await page.locator('select').nth(0).selectOption({
                    label: 'Equals'
                });

                await page.locator('select').nth(1).selectOption({
                    label: cabinet
                });

                // DRAW CAP
                await page.locator('select').nth(2).selectOption({
                    label: 'Equals'
                });

                await page.locator('select').nth(3).selectOption({
                    label: drawCap
                });

                // CBE BAND
                await page.locator('select').nth(4).selectOption({
                    label: 'Equals'
                });

                await page.locator('select').nth(5).selectOption({
                    label: cbeBand
                });

                // SAVE
                await page.locator('button:has-text("Save")').click();

                await page.waitForTimeout(4000);

            }
        }
    }

    console.log('\nDONE — 200 COMBINATIONS CREATED');

})();