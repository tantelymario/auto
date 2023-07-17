import { Robot } from "./modules/scrap-m";

const robot    = new Robot();
const selector = {
    "recherche":"#search",
    "attribute":"src"
};


(async () => {

    await robot.launch();
    await robot.new_page("https://www.pornpics.com/");
    
    await robot.search("Evelyn fierce",selector["recherche"]);

    /** We list all li */
    let card = await robot.get_list_attribute('#tiles > li > a','href');
    for(let i = 0;i < card.length; i++){
        await robot.new_page(card[i]);
        let card_mini = await robot.get_list_attribute('#tiles > li > a > img','src');
        for(let j=0; j< card_mini.length; j++){
            card_mini[i] = card_mini[i].replace('460/','1280/');
            await robot.download(card_mini[j],'data/');
            await robot.sleep(3000);
        }
        robot.close_current_page();
    }

    


})();

