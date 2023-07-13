import { LinkedIN, Data, Robot } from "./modules/scrap-m";

const linkedin = new LinkedIN();
const data     = new Data();
const robot    = new Robot();
const selector = {
    "recherche":"#search"
};

(async () => {
    //await data.connection();

    await robot.launch();
    await robot.new_page("https://www.pornpics.com/");
    
    await robot.search("Evelyn fierce",selector["recherche"]);

})();
