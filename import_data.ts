import { Data } from './modules/data';
import { CSV } from './modules/csv';

const data = new Data();
const csv = new CSV('export.csv','read',';');


const data_export = csv.get();

const insert = async (tab_data:any) => {
    await data.connection();
    //await data.insert_data('societe',tab_data);
}


let i = 0;
for(let x of data_export){
    let data:any = {};
    let nom_commercial = x[1];
    let raison_sociale = x[2];
    if(nom_commercial != ""){
        data['nom_societe'] = x[1];
    }else{
        data['nom_societe'] = x[2];
    }
    data['adresse'] = x[3];
    data['code_postal'] = x[4];
    data['ville'] = x[5];
    data["siret"] = x[6];
    data["libeffectif"] = x[7];
    data["naf"] = x[8];

    //insert(data);
    console.log(data);
    break;
}