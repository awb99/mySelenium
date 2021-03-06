const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const { Builder, By, Key, until, error } = require('selenium-webdriver');

const width = 640;
const height = 480;

let driver = new Builder()
    //.forBrowser('firefox')
    .forBrowser('chrome')
    .setChromeOptions(
        new chrome.Options()
        //.headless()
        .windowSize({ width, height }))
    .setFirefoxOptions(
        new firefox.Options()
        .headless()
        .windowSize({ width, height }))
    .build();


async function demo() {
    try {

        driver.manage().window().setPosition(1000, 0);

        await driver.get('http://www.google.com/ncr');
        await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
        await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        var t = await driver.getTitle();
        console.log(t);


        var alert = await getAlert(driver);
        if (alert != undefined) {
            console.log("accepting alert..")
            await alert().accept();
            //alert().dismiss(); //cancel button on alert dialog.
        } else {
            console.log("no alert present.")
        }

        //driver.quit();
    } catch (e) {
        //await driver.quit();
        throw e;
    }
}

async function getAlert(driver) {
    try {
        var alert = await driver.switchTo().alert();
        return alert;
    } catch (e) {
        if (e instanceof error.NoSuchAlertError) {
            return undefined;
        } else {
            throw e;
        }
    }
}



demo();