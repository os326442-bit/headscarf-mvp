const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
 const browser = await chromium.launch({headless:true});
 let count=0;
 try {
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(pathToFileURL(path.resolve(__dirname,'../preview-smoke-test.html')).href);
   await page.locator('#floatingPreviewCanvas').waitFor();
   for(const shape of ['משולש','בנדנה','לונג','סרט','קשת']){
    await page.locator('#shape').selectOption(shape);
    for(const pattern of ['single','a','b']){
     await page.locator('#pattern').selectOption(pattern);
     for(const finish of ['נקי','פרנזים','שרשרת','נזר בד']){
      await page.locator('#finish').selectOption(finish);
      await page.waitForTimeout(45);
      const result=await page.evaluate(()=>{
       const canvas=document.querySelector('#floatingPreviewCanvas');
       const rect=canvas.getBoundingClientRect();
       return {canvasWidth:canvas.width,canvasHeight:canvas.height,display:getComputedStyle(canvas.parentElement).display,oldDisplay:getComputedStyle(document.querySelector('#finalScarf')).display,viewportWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,rectWidth:rect.width};
      });
      if(shape==='קשת'){
       if(result.display!=='none'||result.oldDisplay==='none')throw Error('Bow fallback failed: '+JSON.stringify(result));
      }else{
       if(result.display==='none'||result.oldDisplay!=='none'||result.canvasWidth<=0||result.canvasHeight<=0)throw Error('Canvas visibility failed: '+JSON.stringify(result));
      }
      if(result.scrollWidth>result.viewportWidth+2)throw Error('Horizontal overflow: '+JSON.stringify(result));
      count++;
     }
    }
   }
   await page.locator('#shape').selectOption('משולש');
   const canvas=page.locator('#floatingPreviewCanvas');
   await canvas.focus();
   await page.keyboard.press('ArrowRight');
   const box=await canvas.boundingBox();
   await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
   await page.mouse.down();await page.mouse.move(box.x+box.width/2+40,box.y+box.height/2);await page.mouse.up();
   if(errors.length)throw Error('Browser exceptions: '+errors.join(' | '));
   await page.close();
  }
  console.log('PASS: '+count+' shape/pattern/finish/viewport combinations; keyboard, pointer and JS errors checked');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
