import { Browser } from "./modules/browser";
import { Bot } from "./modules/bot";
import { Proxy} from "./modules/proxy";

const browser = new Browser();
const robot = new Bot();
const proxy = new Proxy();

let list_ip_proxy:string[];
let list_port_proxy:string[];
let list_protocol_proxy:string[];

(async () =>{
    await browser.launch();
    let page  = browser.get_current_page();
    robot.set_page(page);

    await robot.load_page("https://proxyscrape.com/free-proxy-list");
    list_ip_proxy = await robot.get_list_content("#proxytable > tr > td:nth-child(1)");
    list_port_proxy = await robot.get_list_content("#proxytable > tr > td:nth-child(2)");
    list_protocol_proxy = await robot.get_list_content("#proxytable > tr > td:nth-child(3)");
    
    let x = list_ip_proxy.length;

    for(let i = 0; i < x; i++){
        let ip = list_ip_proxy[i];
        let port = Number(list_port_proxy[i]);
        proxy.check(ip,port,'http');
        if(i > 10 ){
            break;
        }
    }
})();