import { createConnection } from "mysql"
import { Touchscreen } from "puppeteer-core"
import puppeteer  from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import fs from 'fs'
import { resolveModuleName } from "typescript"


export class Data {

  private conn:any

  constructor(){
    console.log(`Creation ok`)
  }


  connection () {
    return  new Promise((resolve, reject) => {
        const connection = createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'scraping',
            charset: 'utf8mb4'
        });
        connection.connect((err:any) => {
            if (err) {
                resolve(false);
                console.log(err);
            }
            else{
                console.log(`Succes connection!`)
            }
          });
        resolve(connection);
    })
  }
  insert_data(connection:any ,table:string ,data:any = {}):Promise<unknown> {
      return new Promise((resolve,reject) => {
          let requete = "INSERT IGNORE INTO "+table+"  ";
          let sep:string = "";
          let values:string = "(";
          let data_x:any = [];
          let dx:string = "("
          let error:string = "";
          for (const key in data) {
              if (Object.hasOwnProperty.call(data, key)) {
                  values  += sep + key;
                  dx += sep+ "?";
                  data_x.push(data[key]);
                  sep = ","; 
              }
          }
          values += ")";
          dx += ")";
          requete += values + " VALUES " + dx;
          connection.query(requete,data_x, (err:any, results:any) => {
          if (err) {
              error =  err;
              console.log("Erreur SQL : " + error);
          }
          else{
              console.log(" Query : "+requete+" OK ");
          }
          });
          resolve(error);
      })
  }
  query(query=""):Promise<unknown> {
      return new Promise((resolve,reject) => {
          if(query == ""){
              resolve(false);
          }
          else{
              this.conn.query(query, (error:any, results:any, fields:any) => {
                  if (error) {
                      resolve(error["sqlMessage"]);
                  }
                  else{
                      console.log("Query ok");
                      let res = JSON.stringify(results);

                      resolve(JSON.parse(res));
                  }
              });
          }
      })
  }
  clean_key(str = ""){
      str = str.trim();
      str = str.replace(/[^a-zA-Z0-9]+/g, '');
      str = str.replace(/\s+/g,'');
      str = str.toLocaleLowerCase();

      return str;
  }
}

export class Browser {
    private page:any[] = []
    private current_page:any
    private browser:any
    constructor(){

    }

    public launch(navigator:string = "", datadir:string = ""):Promise<number> {
        puppeteer.use(StealthPlugin());
        let config = {
            executablePath: "",
            userDataDir: "",
            headless: false,
            timeout:120000,
            args: ['--no-sandbox','--disable-web-security','--disable-features=IsolateOrigins']
        };
        navigator = navigator.trim();
        datadir   = datadir.trim();

        return new Promise (async (resolve, reject) => {
            if(navigator != ""){
                config.executablePath = navigator;
    
            }
            if(datadir != ""){
                config.userDataDir = datadir;
            }
            try{
                this.browser = await puppeteer.launch(config);
                // Open a new page
                const pages = await this.browser.pages();
                this.current_page = pages[0];
                console.log(`Browser launched successfully !`);
                resolve(0);
            }catch(Error){
                console.log(`Error while trying to launch browser : ${Error}`);
                reject(-1)
            }
        })
       
    }
    close():Promise<string>{
        return new Promise(async (resolve, reject) => {
            await this.browser.close();
            resolve(`Browser closed sucessfully`)
        })
    }

    public get_current_page(): any{
        return this.current_page;
    }
    public async new_page(url:string = "www.google.com"):Promise<number> {
        let page = await this.browser.newPage();
        this.page.push(page);
        let index_page = this.page.length - 1;
        this.current_page = this.page[index_page];
        return new Promise(async (resolve, reject) => {
            try{
                await this.current_page.goto(url);
                console.log(`Success creating page : ${url}`)
                resolve(0)
            }catch(Error){
                console.log(`Failed creating page : ${url}`)
                reject(-1)
            }
            
        })
    }

    /**
     * 
     * @param page Numéro de la tabulation, example ouvrir Tab 3
     * @description To change tabulation on the navigator
     * @returns 
     */
    public change_page(page:number = 0):Promise<number> {
        this.current_page = this.page[page];
        return new Promise(async (resolve, reject)=>{
            try{
                await this.current_page.bringToFront();
                resolve(0);
            }catch(Error){
                console.log(`Error changing page:${Error}`);
                reject(-1);
            }
        })

    }

    public close_current_page():void {
        try{
            this.current_page.close();
        }catch(Error){
            console.log(`Error while trying to close current page ${Error}`);
        }
    }

    public close_page(page:number = 0):void {
        try{
            this.current_page = this.page[page];
        }catch(Error){
            console.log(`Error while trying to close page: ${Error}`)
        }
    }
    
}
export class Robot {
    private page: any[] = [];
    private current_page: any;
    private browser:any;
    private resultat:any;
    private attribute:string = '';

    constructor(page:any){
        this.current_page = page
        console.log(page)
        this.page.push(page)
        console.log(`Robot created`);
    }

    
    public scroll(selector:string): Promise<any>{
        return new Promise( async (resolve, reject) => {
            const elementHandle = await this.current_page.$(selector);
            if (elementHandle) {
                console.log(`Debut scroll`);
                await this.current_page.evaluate((element:any) => {
                element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
                }, elementHandle);
                console.log(`Fin scroll`);
                await this.sleep(3000);
            }
            resolve(0);
        });
    }
    /**
     * @param waitfor : Selector to wait in array string []
     * @param all : all = true to wait for all selector, false if at least one of the selector appears
     * @param timeout : timeout to wait selector
     */
    public wait(waitfor:any ,all:boolean ,timeout:number = 5000): Promise<number> {
        return new Promise(async (resolve, reject)=>{
            let selector:any = [];
            for(let x in waitfor){
                selector.push(this.current_page.waitForSelector(x))
            }
            try{
                if(all){
                    console.log('Ici');
                    await Promise.race([Promise.all(selector), this.timeout(timeout,`Timeout reached for waiting selector: ${waitfor}`)]);
                    console.log('Fin');
                }else{
                    selector.push(this.timeout(timeout,`Timeout reached for waiting selector: ${waitfor}`));
                    await Promise.race(selector);
                }
                
            }catch(Error){
                console.log(`Error while waiting for selector : ${selector}`);
                reject(-1);
            }
            resolve(0);
        })
    }

    /** on aimerait experimenter pour 3 / 4 personne un système prédictif 
     *  Si on fait une system, qu'est e qu'il faut faire et  
     * Un Devis pour su systeme prédictif 
    */
    public load_page(url:string = "", waitfor:string[] = [], all:boolean = true):Promise<number>{
        return new Promise(async (resolve) => {
            if(url == ""){
                console.log(`Inserer l'url`);
                resolve(-1);
            }
            try{
                //this.current_page.setDefaultTimeout(200000);
                await this.current_page.goto(url);
                console.log(`Success loading page ${url}`);
                resolve(0);
            }catch(Error){
                console.log(`Error while trying to load page : ${Error}`);
                resolve(-1);
            }
            if(waitfor != null){
                await this.wait(waitfor,all);
            }
            
        })
    }
    public get_content(selector:string,type:string = "text"): Promise<any>{
        return new Promise(async (resolve, reject)=> {
            let res = [];
            let u:any;
            try{
                switch(type){
                    case "text":
                        u = await this.current_page.$eval(selector, (elx:any) => elx.textContent); 
                    break;
                    case "href":
                        u = await this.current_page.$eval(selector, (elx:any) => elx.href); 
                    break;
                }
                res.push(u);
            }catch(Error){
                console.log(`Error while trying to get text : ${selector}`);
                reject(res);
            }


            resolve(res);
        })
    }
    public get_list_content(selector:string,type:string = "Text" ,secondary_selector:any = null): Promise<any>{
        return new Promise(async (resolve, reject) => {
            this.resultat = [];
            let li_cartouche:any;
            try{
                if(secondary_selector == null){  
                    this.resultat = await this.current_page.$$eval(selector, (elements:any) =>
                        elements.map((element:any) => element.textContent)
                    );
                }else{
                    li_cartouche = await this.current_page.$$(selector);
                    for(const li of li_cartouche) {
                        let txt:any;
                        let i:number = 0;
                        let x:any = {};
                        for(const key in secondary_selector){
                            try{
                                await this.scroll(secondary_selector[key]);
                                txt =  await li.$eval(secondary_selector[key], (elx:any) => elx.textContent);
                                x[key] = txt;
                            }catch(Error){
                                console.log(`Error finding element ${secondary_selector[key]}`);
                            }
                                    
                        }
                        this.resultat.push(x);
                        i++;
                    }
                }

            }catch(Error){
                console.log(`Error while trying to get Text ${Error}`);
                reject(-1);
            }
            resolve(this.resultat);
        })
    }

    public get_attribute(selector:string, attribute:any): Promise<any>{
        return new Promise(async (resolve, reject) => {
            let value  = "";
            try{
                console.log("Attr : "+attribute)
                this.attribute = attribute;
                value = await this.current_page.$eval(selector, (elx:any) => elx.getAttribute(this.attribute));
            }catch(Error){
                console.log(`Failed to get attribute : ${Error}`);
                reject(value);
            }
            resolve(value);
        });
    }

    public get_list_attribute(selector:string,attribute:string ,secondary_selector:any = null): Promise<any>{
        return new Promise(async (resolve, reject) => {
            this.resultat = [];
            let li_cartouche:any;
            try{
                if(secondary_selector == null){  
                    this.resultat = await this.current_page.$$eval(selector, (elements:any,attrname:string) =>
                        elements.map((element:any) => element.getAttribute(attrname)), attribute
                    );
                }else{
                    li_cartouche = await this.current_page.$$(selector);
                    for(const li of li_cartouche) {
                        let txt:any;
                        let i:number = 0;
                        let x:any = {};
                        for(const key in secondary_selector){
                            try{
                                const elementHandle = await this.current_page.$(secondary_selector[key]);
                                if (elementHandle) {
                                  await elementHandle.scrollIntoViewIfNeeded();
                                }
                                txt =  await li.$eval(secondary_selector[key], (elx:any) => elx.getAttribute(this.attribute));
                                x[key] = txt;
                            }catch(Error){
                                console.log(`Error finding element ${secondary_selector[key]}`);
                            }
                                    
                        }
                        this.resultat.push(x);
                        i++;
                    }
                }

            }catch(Error){
                console.log(`Error while trying to get Text ${Error}`);
                reject(-1);
            }
            resolve(this.resultat);
        })
    }
    public get_element(selector:string):Promise<any>{
        return new Promise(async (resolve, reject) =>{
            const liElements = await this.current_page.$$('li');
            resolve(liElements)
        });
    }
    public click(selector:string):Promise<number>{
        return new Promise(async (resolve, reject) =>{
            try{
                await this.current_page.click(selector);
                resolve(0);
            }catch(Error){
                console.log(`Error on click ${Error}`);
                reject(-1);
            }
        })
    }

    //Find keyword
    async search(keyword:string, selector:string): Promise<void>{
        try{
        await this.current_page.focus(selector)
        // Simulate Ctrl+A (select all) using the keyboard
        await this.current_page.keyboard.down('Control');
        await this.current_page.keyboard.press('KeyA');
        await this.current_page.keyboard.up('Control');

        // Simulate Delete key press to remove the selected text
        await this.current_page.keyboard.press('Delete');
        await this.current_page.type(selector,keyword)
        await this.current_page.keyboard.press('Enter')
        await this.current_page.waitForNavigation({waitUntil: 'networkidle0'});
        }catch(Error){
        console.log(`Error : ${Error}`)
        }
    }

    public back():Promise<number>{
        return new Promise(async (resolve, reject) =>{
            await  this.current_page.goBack();
            resolve(0);
        });
    }
    public download(url:string, to:string): Promise<number>{
        return new Promise(async (resolve, reject) =>{
             try{   
                let page = await this.browser.newPage();
                let ccc = url.split('/');
                let name = ccc[ccc.length -1];

                const img_buffer = await page.goto(url);
                await fs.promises.writeFile(to+name, await img_buffer.buffer());
                await page.close();
                
                resolve(0);
            }catch(Error){
                console.log(`Error while tryng to downloed ${url} et ${Error}`);
                resolve(-1);
            }
        })
    }
    async  loading_wait():Promise<void>{
        console.log('eeeee');
        await this.current_page.waitForNavigation({waitUntil: 'networkidle0'});
        console.log('ddd');
    }
    private  timeout(ms: number, txt:string = 'Promise timed out'): Promise<never> {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error(txt)), ms);
        });
    }
    public sleep(ms:number): Promise<any>{
        return new Promise(async (resolve, reject) => {
            const t = setTimeout(() => {
                resolve(0);
            },ms);
            
        })
    }

}

