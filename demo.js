var fs = require("fs"),
    moment = require("moment"),
    Promise = require("bluebird"),
    sleep = require("sleep-promise");

selenium = require('selenium-webdriver'),
    By = selenium.By,
    until = selenium.until,
    Select = selenium.Select,
    Key = selenium.Key,
    ActionSequence = selenium.ActionSequence,
    Window = selenium.Window,

    seleniumDriver = require("./seleniumDriver.js");


Promise.longStackTraces(); // nice stack traces for promises!

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function removeFiles() {
    const { stdout, stderr } = await exec('rm /tmp/demoProfile/* -r ');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}


async function init_and_print_capabilities() {
    var downloadDir = "/tmp/demo";
    var profileDir = "/tmp/demoProfile";

    await removeFiles();

    //var browserVisible = false;
    var browserVisible = true;

    //var driver = seleniumDriver.getChrome(downloadDir, profileDir, browserVisible);
    var driver = seleniumDriver.getChromium(downloadDir, profileDir, browserVisible);
    //var driver = seleniumDriver.getSauce();
    //var driver = seleniumDriver.getFirefox(downloadDir, profileDir)

    console.log("driver capabilities:");
    await driver.getCapabilities().then(console.log);

    var cookies = await driver.manage().getCookies();
    console.log("cookies: " + JSON.stringify(cookies));

    console.log("setting window size 2000 * 2200");
    await driver.manage().window().setSize(1600, 1200);


    console.log("opening new tab");
    await driver.executeScript('window.open();');

    console.log("getting window (tab) list");
    var handles = await driver.getAllWindowHandles();
    console.log("window handles: ", handles);

    console.log("switching to google window (right side)");
    await driver.switchTo().window(handles[1]);

    return driver;
}


async function browser_test(driver) {
    console.log("getting www.whatismybrowser.com");
    await driver.get("https://www.whatismybrowser.com/");
    await sleep(3000);

    console.log("taking Screenshot of whatismybrowser.com");
    await seleniumDriver.saveHtml(driver, "/tmp/whatismybrowser.com.html");
    await seleniumDriver.takeScreenshot(driver, "whatismybrowser.com");
}


async function download_test(driver) {
    var downloadURL = "https://download.samba.org/pub/rsync/rsync-patches-3.1.2.tar.gz";
    await driver.get(downloadURL); // download url (saves file..)
    console.log("File downloaded: " + downloadURL);

    await driver.get('http://static.mozilla.com/moco/en-US/pdf/mozilla_privacypolicy.pdf')
    await driver.get("http://spreadsheetpage.com/downloads/xl/worksheet%20functions.xlsx");

}

async function tab_test(driver) {
    console.log("switching to bing window (left window)");
    await driver.switchTo().window(handles[0]);
    console.log("getting bing..");
    await driver.get("http://www.bing.com");

    console.log("getting title..");
    var t = await driver.getTitle();
    console.log("title: ", t);
    console.log("taking Screenshot of bing");
    //var imageBing = await driver.takeScreenshot();
    //fs.writeFile('output/bing.png', imageBing, 'base64', function(err, msg) { if (err) console.log("Error: " + err);  });
    await saveHtml(driver, "/tmp/bing.html");
    await takeScreenshot(driver, "bing");


    console.log("switching to google window");
    driver.switchTo().window(handles[1]);
    console.log("closing google handle");
    driver.close();

    console.log("getting window list..");
    var handles = await driver.getAllWindowHandles();
    console.log("handles: ", handles);

    console.log("switching to bing window (left window)");
    await driver.switchTo().window(handles[0]);

    console.log("getting current window handle..");
    var myhandle = await driver.getWindowHandle();
    console.log("my window handle:", myhandle);
}

async function key_demo(driver) {
    //await new ActionSequence(driver).sendKeys(Key.CONTROL + "t").perform();
    //await new ActionSequence(driver).keyDown(Key.CONTROL).sendKeys("t").keyUp(Key.CONTROL).perform();
    //driver.findElement(By.css("body")).sendKeys(Key.CONTROL + "t");
    //var newTabInstance = driver.WindowHandles[driver.WindowHandles.Count-1].ToString();


    //console.log("sending CTRL + TAB (to switch the tab)");
    //await new ActionSequence(driver).keyDown(Key.CONTROL).sendKeys(Key.TAB).keyUp(Key.CONTROL).perform();
    //driver.findElement(By.css("body")).sendKeys(Key.CONTROL + "t");
}

async function find_test(driver) {
    var myElement = driver.findElement(By.css('div'));
    myElement.then(e => console.log(e));

    driver.executeScript(function() {
        return document.querySelector('div').innerHTML;
    }).then(function(innerHTML) {
        //check content here 
        console.log(innerHTML);
    });

    //console.log(myElement);
    driver.getHTML("body", false).then(function(html) {
        console.log("*** INNER HTML:");
        console.log(html);
    });
}


async function demo() {

    var driver = await init_and_print_capabilities();

    await download_test(driver);

    //await browser_test (driver);
    //await tab_test (driver);

    // await find_test (driver);

    console.log("sleeping 30 seconds");
    await sleep(30000);
    driver.quit();
}

demo();