import { Bot} from "./modules/bot";
import { Browser} from "./modules/browser";

const browser = new Browser();
const robot    = new Bot();

const selector = {
    "recherche":"#search",
    "attribute":"src"
};


(async () => {

    await browser.launch();
    
    // scraping code goe here
    let page = browser.get_current_page();

    robot.set_page(page);
    await robot.load_page("https://www.google.com/");
    await robot.search("Porn pics","textarea#APjFqb");
    await robot.click('#rso > div:nth-child(1) > div > div > div > div > div > div > div.yuRUbf > a')
    
    await robot.search("Evelyn fierce",'#search');

    /** We list all li */
    let card = await robot.get_list_attribute('#tiles > li > a','href');
    for(let i = 0;i < card.length; i++){
        await browser.new_page(card[i]);
        let card_mini = await robot.get_list_attribute('#tiles > li > a > img','src');
        for(let j=0; j< card_mini.length; j++){
            let url_max = card_mini[j].replace('460/','1280/');
            await robot.download(url_max,'data/');
            await robot.sleep(3000);
        }
        browser.close_current_page();
    }
})();

