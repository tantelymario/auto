import { LinkedIN, Data } from "./modules/scrap-m";

const linkedin = new LinkedIN();
const data     = new Data();

(async () => {
    let conn = await data.connection();
   
    let query = `SELECT * FROM linkedin_data LIMIT 10`;
    let res   = await data.select_data(conn,query);

    console.log(res);
    return 0;
})();
