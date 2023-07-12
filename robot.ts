import { LinkedIN, Data, Robot } from "./modules/scrap-m";

const linkedin = new LinkedIN();
const data     = new Data();
const robot    = new Robot();

(async () => {
    await data.connection();
    await robot.launch();
    await robot.new_page("https://bot.sannysoft.com");
    await robot.new_page("https://www.google.com");
    robot.change_page(0);

})();
