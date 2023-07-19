import fs from 'fs';

export class CSV {
    path:string;
    action:string;
    separator:string;
    encoding:string;

    /**
     * 
     * @param path File path
     * @param action read / write / append
     * @param separator ; or , or | .....
     * @param encoding UTF-8
     */
    constructor(path:string,action:string,separator:string = ",",encoding:string = 'utf-8'){
        this.path = path;
        this.action = action;
        this.separator = separator;
        this.encoding = encoding;
    }

    /**
     * 
     * @returns Tableau qui contient tous les liste du fichier csv
     */
    public get():any{
        const fileContent = fs.readFileSync(this.path, 'utf-8');
        const lines = fileContent.split('\n');

        const dataArray: any[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line !== '') {
            const data:string[] = line.split(';');
            let x:string[] = [];
            for(let y of data){
                if(y !== undefined){
                    y.trim();
                }
                x.push(y);
            }
            dataArray.push(x);
            }
        }

        return dataArray;
    }
}