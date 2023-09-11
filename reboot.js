import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

import { executablePath } from "puppeteer";

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
    defaultViewport: null,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();
  let login = "http://192.168.0.1/login.html";
  const home = "http://192.168.0.1/main.html";

  async function BackLogin() {
    await page.goto(login, { waitUntil: "domcontentloaded" });
    console.log(login);

    const type = "alltimelow";
    await page.focus("#login-password");
    await page.$x(`//*[@id='login-password']`);
    await page.keyboard.type(type, { delay: 100 });
    console.log("Typing...");

    const [button] = await page.$$(".btn");
    if (button) {
      await button.hover();
      await button.click();
      console.log("Hit Enter");
    }
  }

  if (page.url() != home) {
    BackLogin();
  }

  await page.waitForSelector(".status-wrap", { visible: true });
  await delay(1);
  console.log("Redirect to", page.url());

  await page.waitForSelector("#statusWan1Ip", { visible: true });
  const ip = await page.$eval("#statusWan1Ip", (e) => e.innerHTML);
  const split = ip.split(".");

  checkIp();

  let clientCount = await page.$eval("#clientNum", (e) => e.innerText);

  async function checkIp() {
    if (split[1] > 130) {
      console.log("Your IP Address : ", ip);
    } else if (split[1] < 130) {
      console.log(
        `Oops, your second octet of IP Address [${ip}] less than 130, router restarting...`
      );
      RebootRouter();
      //   RebootRouter();
    } else if (ip == 0) {
      console.log("Null ip");
      RebootRouter();
    }
  }

  async function RebootRouter() {
    const [setting] = await page.$x("//a[contains(., 'System Settings')]");
    if (setting) {
      await setting.click();
      console.log("System Setting Clicked");
      // await page.screenshot({ path: "test7.jpg", fullPage: true });
    }

    await page.waitForSelector("#sys_reboot .function-title");
    const [reboot] = await page.$$("#sys_reboot .function-title");
    if (reboot) {
      await reboot.click();
      console.log("Reboot and Reset");
    }

    // await page.waitForNavigation({ timeout: 0 });
    const hidden = await page.waitForSelector("div.main-dailog > iframe");
    const frame = await hidden.contentFrame();
    await delay(1);

    await frame.waitForSelector("input#sys_reboot");
    await frame.$("input#sys_reboot");

    let value = await frame.$eval(".btn-group input", (e) => e.value);
    if (value == "Reboot") {
      await delay(1);
      await frame.$eval(".btn-group input", (e) => e.click());
      console.log("Restart Router...");
      await delay(5);
    }

    //   await page.waitForSelector("#loading_div", {
    //     hidden: true,
    //   });
    //   await page.$("#loading_div");

    // await page.waitForSelector("#load_text");
    // const loading = await page.$eval("#load_text", (e) => e.textContent);
    //   }

    //   let counter = 1;
    //   let waitLoading = setInterval(function () {
    //     console.log(`${counter}%`);
    //     counter++;
    //     if (counter > 100) {
    //       console.log("Done");
    //       clearInterval(waitLoading);
    //     }
    //   }, 600);

    //   await page.screenshot({ path: "test7.jpg", fullPage: true });

    await browser.close();
  }
}

async function delay(seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
}

run();
