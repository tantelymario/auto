import { createConnection } from "mysql"

export class Data {

  private conn:any

  constructor(){
    console.log(`Creation ok`)
  }


  connection () : Promise<boolean>{
    return  new Promise((resolve, reject) => {
        const connection =  createConnection({
            host: '192.168.5.46',
            user: 'externe',
            password: 'externe1',
            database: 'scraping',
            charset: 'utf8mb4'
        });
        connection.connect((err:any) => {
            if (err) {
                console.log(`Erreur de connection au base de donné : ${err}`);
            }
            else{
                this.conn = connection;
                console.log(`Succes connection!`);
                resolve(true);
            }
          });
        
    })
  }
  public insert_data(table:string ,data:any = {}):Promise<any> {
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
          this.conn.query(requete,data_x, (err:any, results:any) => {
          if (err) {
              error =  err;
              console.log("Erreur SQL : " + error);
              process.exit(-1);
          }
          else{
              console.log(" Query : "+requete+" OK ");
          }
          });
          resolve(error);
      })
  }
  public query(query=""):Promise<unknown> {
      return new Promise((resolve,reject) => {
          if(query == ""){
              resolve(false);
          }
          else{
              this.conn.query(query, (error:any, results:any, fields:any) => {
                  if (error) {
                      resolve(error["sqlMessage"]);
                      process.exit(-1);
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


