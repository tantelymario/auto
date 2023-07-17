import { Data } from "./modules/data";
interface LinkedIN {
    name: string;
    age: number;
    greet:  () => Promise<void>;
}

const myObj: LinkedIN = {
    name: "John",
    age: 30,
    greet: async function(){
        const l = new Data();
        console.log(`Salut ! `);
    }
};