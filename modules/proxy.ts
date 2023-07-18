import axios from 'axios';


export class Proxy {
    private ip:string
    private port:number
    private prot:string

    constructor(){
      this.ip = ""
      this.port = 0
      this.prot = "" 
    }

    public check(ip:string, port:number, prot:string): Promise<boolean>{
      this.ip = ip
      this.port = port
      this.prot = prot
      
      return new Promise(async(resolve)=>{
        const axiosInstance = axios.create({
          proxy: {
            host: this.ip,
            port: this.port,
          }
        });
        try {
          const response = await axiosInstance.get("http://monip.org/");
          resolve(true);
          // Handle the response data
        } catch (error) {
          resolve(false);
          // Handle the error
        }
      });
    }
}