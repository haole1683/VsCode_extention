import * as  fs from "fs";
import * as path from "path";

export {FileOperation};

// About file operations
// https://blog.csdn.net/m0_46612221/article/details/122870551?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-122870551-blog-103111639.pc_relevant_3mothn_strategy_recovery&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-122870551-blog-103111639.pc_relevant_3mothn_strategy_recovery&utm_relevant_index=1

class FileOperation{
    totalPath: string;
    constructor(filePath:string){
        this.totalPath = filePath;
        this.checkFileExist();
    };
    filePath = "./files";
    fileName = "tmp.bmk";
    
    lsTreeGetPathAndName(path:string):Array<string>{
        let filePath:string = path;
        let devidedStr:Array<string> = filePath.split("\\");
        let fileName:string = devidedStr[devidedStr.length-1];
        let fileDir = filePath.substring(0,filePath.length-fileName.length-1);
        return [fileDir,fileName];
    }
    lsTreeHelper(filePath:string,level:number,printString:Array<string>):void{
        if(fs.existsSync(filePath)){
            let fArr = this.lsTreeGetPathAndName(filePath);
            let fPath = fArr[0];
            let fName = fArr[1];
            if(level === 0){
                printString.push(filePath);
            }else{
                let strPrint:string="";
                for(let i=0;i<level;i++){
                    strPrint += " ";
                }
                printString.push(strPrint +"├" + fName);
            }
            if(fs.statSync(filePath).isDirectory()){
                let sonFile = fs.readdirSync(filePath);
                for(let i =0;i<sonFile.length;i++){
                    let newPath = path.join(filePath,sonFile[i]);
                    this.lsTreeHelper(newPath,level+1,printString);
                }
            }
        }
    }
    lsTreeString() :string{
        let printString:Array<string> = [];
        let fileDir:string = this.lsTreeGetPathAndName(this.totalPath)[0];
        this.lsTreeHelper(fileDir,0,printString);
        let retStr:string = "";
        printString.forEach(function(str){
            retStr += (str+"\n");
        });
        return retStr;
    }
    createFile():void{
        // API
        fs.writeFile(this.totalPath, '# 个人收藏', (error) => {
            // 创建失败
            if(error){
                console.log(`创建失败：${error}`);
            }
            // 创建成功
            console.log(`创建文件成功！`);
        });
    }
    checkFileExist():void{
        if(fs.existsSync(this.totalPath)){
            return;
        }
        this.createFile();
    }

    readContent():string{
        this.checkFileExist();
        return fs.readFileSync(this.totalPath, "utf-8");
    }
    readContentAsArray():Array<string>{
        this.checkFileExist();
        let content:string = this.readContent();
        let lines:Array<string> = content.split('\n');
        for(let i = 0;i<lines.length;i++){
            lines[i] = lines[i].replace("\r","");
        }
        return lines;
    }

    // write into file   Mode:Override
    writeContent(str:string):void{
        this.checkFileExist();
        fs.writeFileSync(this.totalPath, str);
    };
    writeContentAsArray(strs:Array<string>):void{
        this.checkFileExist();
        let path:string = this.totalPath;
        let content:string = "";
        strs.forEach(function(item){
            content += (item + "\n");
        });
        this.writeContent(content);
    };

    // write into file  Mode:Append
    writeContentAppend(str:string):void{
        this.checkFileExist();
        console.log("test execution");
        // fs.appendFile(this.totalPath, str, 'utf-8', function(err){
        //     if(err){
        //         console.log("Fail");
        //         throw new Error("追加数据失败");
        //     }else{
        //         console.log("追加数据成功");
        //     }
        // });
        fs.appendFileSync(this.totalPath, str+"\n");
    }

    // Clean the content of the file
    cleanContent():void{
        this.writeContent("");
        return;
    }

    // delete the selected row with keyword
    deleteKeyLine(keyword:string):void{
        let strArr:Array<string> = this.readContentAsArray();
        let i:number =-1;
        for(i=0;i < strArr.length;i++){
            let eachStr:string = strArr[i];
            if(eachStr.indexOf(keyword) !== -1){
                break;
            }
        }
        if(i === -1){
            return;
        }
        // delete the row
        strArr.splice(i,1);
        // TODO Complate
    }
    // delete file
    deleteFile():void{
        this.checkFileExist();
        fs.rmdirSync(this.totalPath);
    }
}


// function test(){
//     let myops = new FileOperation;
//     let mystr:string = "asdfjsafsao";
//     myops.writeContent(mystr);
    
//     let readStr:string = myops.readContent();
//     myops.writeContentAppend("\nhello");
//     console.log(readStr);
// }

// test();


// const dirPath = path.resolve("files","tmp.bmk");
// console.log(dirPath);
