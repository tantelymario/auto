import { createConnection } from "mysql"

export class LinkedIN {
    
  
  constructor() {
    console.log(`LinkedIn Start`)
  }
  
  async meth_1(){

  }
   
}

export class Data {

  conn:any

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
  insert_data(connection:any ,table:string ,data = {}):Promise<unknown> {
      return new Promise((resolve,reject) => {
          let requete = "INSERT IGNORE INTO "+table+"  ";
          let sep = "";
          let values = "(";
          let data_x = [];
          let dx = "("
          let error = "";
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
  select_data(connection:any,query=""):Promise<unknown> {
      return new Promise((resolve,reject) => {
          if(query == ""){
              resolve(false);
          }
          else{
              connection.query(query, (error:any, results:any, fields:any) => {
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

