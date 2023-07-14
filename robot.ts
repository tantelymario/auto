import { LinkedIN, Data, Robot } from "./modules/scrap-m";

const linkedin = new LinkedIN();
const data     = new Data();
const robot    = new Robot();
const selector = {
    "recherche":"#search",
    "attribute":"src"
};


(async () => {
    //await data.connection();

    await robot.launch();
    await robot.new_page("https://wallpaperaccess.com/karina-aespa");
    
    await robot.search("Evelyn fierce",selector["recherche"]);
    //await robot.wait('#tiles > li > a > img.ll-loaded',true);

    let att = await robot.get_list_attribute('img[data-slug="karina-aespa"]',"src");
    /*for(let i = 0; i<att.length; i++){
        await robot.download('att[i],'data\/');
    }*/
    console.log(att);

})();
