import { LinkedIN, Data, Robot } from "./modules/scrap-m";

const linkedin = new LinkedIN();
const data     = new Data();
const robot    = new Robot();
const selector = {
    "Region":"td:nth-child(1)",
    "Capital":"td:nth-child(2)",
    "Lycee":"td:nth-child(3)",
    "Matricule":"td:nth-child(4)",
    "Date":"td:nth-child(5)"};

(async () => {
    await data.connection();
    await robot.launch();
    await robot.new_page("https://www.education.gov.mg/educatif/analamanga/");
    let paps = await robot.get_list_content('#content > div > div > div > div > div > table > tbody > tr',"text",selector);
    console.log(paps);

    //let conn = await robot.get_content('#user-agent-result');
    //console.log(conn);
   

})();
