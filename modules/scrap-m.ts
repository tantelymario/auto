import { createConnection } from "mysql"
import puppeteer  from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

export class LinkedIN {
    
  
  constructor() {
    console.log(`LinkedIn Start`)
  }
  
  async meth_1(){

  }
   
}

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

export class Robot {
    private page: any[] = [];
    private current_page: any;
    private browser:any;

    constructor(){
        console.log(`Robot created`);
    }

    public launch(navigator:string = "", datadir:string = ""):Promise<number> {
        puppeteer.use(StealthPlugin());
        let config = {
            executablePath: "",
            userDataDir: "",
            headless: false,
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
                resolve(-1)
            }
            
        })
    }

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
