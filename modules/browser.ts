import puppeteer  from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

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
            args: ['--no-sandbox','--disable-web-security','--disable-features=IsolateOrigins',`--proxy-server=51.254.121.123:8088`]
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
    public async new_page(url:string = "www.google.com"):Promise<any> {
        let page = await this.browser.newPage();
        this.page.push(page);
        let index_page = this.page.length - 1;
        this.current_page = this.page[index_page];
        return new Promise(async (resolve, reject) => {
            try{
                await this.current_page.goto(url);
                console.log(`Success creating page : ${url}`)
            }catch(Error){
                console.log(`Failed creating page : ${url}`)
            }
            resolve(0)
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