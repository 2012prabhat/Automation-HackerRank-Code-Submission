const puppeteer = require("puppeteer");
const { answers } = require("./codes");
const emailPassObj = require("./secrets");

(async function(){
    try {
        let browserInstance = await puppeteer.launch({headless:false,
            defaultViewport : null,
            args:["--start-maximized","--disable-notification"],
        })
        let newTab = await browserInstance.newPage();
        await newTab.goto("https://www.hackerrank.com/auth/login");
        await newTab.type("input[id='input-1']",emailPassObj.email,{delay:50});
        await newTab.type("input[id='input-2']",emailPassObj.password,{delay:50});
        await newTab.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        
        await waitAndClick(".track-card a[data-attr2='algorithms']", newTab);
        await waitAndClick("input[value='warmup']", newTab);
        await newTab.waitFor(4000);
        const questionArr = await newTab.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{ delay: 100 });
        console.log(questionArr.length);
        let questionWillSolved=await questionSolver(newTab,questionArr[0],answers[0]);
        console.log("Question is Solved");

        
    } catch (error) {
      console.log(error);
    }

})();


async function questionSolver(currentPage,question,answer){
    await question.click();
    let waitForEditorToBeInFocus = await waitAndClick(".monaco-editor.no-user-select.vs", currentPage);
    await waitAndClick(".checkbox-input", currentPage);
    await currentPage.waitForSelector("textarea.custominput", { visible: true });
    await currentPage.type("textarea.custominput", answer, { delay: 10 });
    await  currentPage.keyboard.down("Control");
    await currentPage.keyboard.press("A", { delay: 100 });
    await  currentPage.keyboard.press("X", { delay: 100 });
    await currentPage.keyboard.up("Control");
    await  waitAndClick(".monaco-editor.no-user-select.vs", currentPage);
    await currentPage.keyboard.down("Control");
    await currentPage.keyboard.press("A", { delay: 100 });
    await currentPage.keyboard.press("V", { delay: 100 });
    await currentPage.keyboard.up("Control");
    await currentPage.click(".hr-monaco__run-code", { delay: 50 });
}
        

async function waitAndClick(selector, currentPage){
    await currentPage.waitForSelector(selector);
    return currentPage.click(selector);
}