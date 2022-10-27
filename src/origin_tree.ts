import { assert } from "console";
import { TargetTree, AdapterFromTreeToFile } from "./adapter";
import { FileOperation } from "./fileOps";

export { Tree };

enum NodeType {
    leaf,
    branch
}

class Node {
    private name: string; // 目录（书签）名称额
    private type: NodeType;  // 类型
    private sons: Array<Node>;   // 儿子结点
    private content: string; // 结点内容（书签url）
    constructor(name: string, type: NodeType = NodeType.branch, content: string = "") {
        this.name = name;
        this.type = type;
        this.sons = [];
        this.content = content;
    };

    public getSons() {
        return this.sons;
    }

    public addSons(son: Node) {
        this.sons.push(son);
    }

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getType() {
        return this.type;
    }

    public setType(type: NodeType) {
        this.type = type;
    }

    public getContent() {
        return this.content;
    }

    public setContent(content: string) {
        this.content = content;
    }

    public deleteSon(name: string) {
        let i = -1;
        for (i = 0; i < this.sons.length; i++) {
            if (this.sons[i].getName() === name) {
                break;
            }
        }
        if (i === -1) {
            return;
        }
        this.sons.splice(i, 1);

    }

}

class Tree {
    root: Node;
    corFilePath: string;
    bookmarkMap: Map<string,number>;
    constructor() {
        this.root = new Node("个人收藏");
        this.corFilePath = "";
        this.bookmarkMap = new Map<string,number>;
    }
    public getData(): string {
        return this.getPrintContent();
    }
    public getFileStructure(): string {
        return this.getFileStructureData();
    }
    public readBookmark(title:string) {
        // ToDO
        // open the corspoding website

        let num = this.bookmarkMap.get(title);
        if(num === undefined){
            this.bookmarkMap.set(title,1);
        }else{
            this.bookmarkMap.set(title,num+1);
        }
    }

    public lsTree() {
        const myTree: TargetTree = new AdapterFromTreeToFile(new FileOperation(this.corFilePath));
        myTree.lsTree();
    }
    private findNode(keyword: string): Node | undefined {
        let myQueue: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            let curName = curNode?.getName();
            if (curName === keyword) {
                return curNode;
            }
            curNode?.getSons().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return undefined;
    }

    private findIfSonWithKey(father: Node, keyword: string): boolean {
        // 判断儿子中是否有keyword关键字
        return false;
    }

    private findFatherNode(keyword: string): Array<Node> {
        // 找到爹
        let myQueue: Array<Node> = [];
        let fahterArr: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            console.log(curNode);
            let flag = false;
            curNode?.getSons().forEach(function (son) {
                if (son.getName() === keyword) {
                    flag = true;
                }
            });
            if (flag) {
                if(curNode !== undefined){
                    fahterArr.push(curNode);
                }
            }
            curNode?.getSons().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return fahterArr;
    }

    public addSonBranch(sonName: string, fatherName?: string): void {
        // 添加儿子目录
        let fatherNode: Node;
        if (fatherName === undefined) {
            // 直接在二级目录
            console.log("here");
            fatherNode = this.root;
        } else {
            // 多级目录下
            let findNode = this.findNode(fatherName);
            if (findNode === undefined) {
                throw Error("Wrong");
            } else {
                fatherNode = findNode;
            }
        }

        let sonNode: Node = new Node(sonName, NodeType.branch);
        fatherNode.addSons(sonNode);
        // this.printTreeFileFormat();
    }

    public addSonLeaf(bkName: string, url: string, fatherName: string): void {
        let fatherNode = this.findNode(fatherName);
        if (fatherNode === undefined) {
            throw Error("Wrong");
        }
        let sonNode: Node = new Node(bkName, NodeType.leaf, url);
        fatherNode.addSons(sonNode);
    }

    public deleteNode(keyword: string) {
        let fathersNode:Array<Node> = this.findFatherNode(keyword);
        fathersNode.forEach(function(fatherNode){
            fatherNode.deleteSon(keyword);
        });
    }

    private getArrayOfTreeWIthRecrusion(curNode: Node, curDepth: number, myNodearr: Array<Node>, myStrArr: Array<string>, myDepthArr: Array<number>): void {
        if (curNode !== null) {
            if (curNode.getType() === NodeType.branch) {
                myNodearr.push(curNode);
                myStrArr.push(curNode.getName());
                myDepthArr.push(curDepth);
            } else {
                myNodearr.push(curNode);
                myStrArr.push(curNode.getName() + "|" + curNode.getContent());
                myDepthArr.push(-1); // 代表是书签
            }
            let sonArray:Array<Node> = curNode.getSons();
            sonArray = sonArray.sort(function(a:Node,b:Node):number{
                if(a.getType() === b.getType()){
                    return 0;
                }else{
                    if(a.getType() === NodeType.leaf){
                        return -1;
                    }else{
                        return 1;
                    }
                }
            });
            sonArray.forEach((son) => {
                this.getArrayOfTreeWIthRecrusion(son, curDepth + 1, myNodearr, myStrArr, myDepthArr);
            });
        }
    }
    public getArrayOfTree(): { nodeArr: Array<Node>, strArr: Array<string>, depthArr: Array<number> } {
        // 获取对应存储bmk每行数据
        let myNodeArr: Array<Node> = [];
        let myStrArr: Array<string> = [];
        let myDepthArr: Array<number> = [];
        this.getArrayOfTreeWIthRecrusion(this.root, 1, myNodeArr, myStrArr, myDepthArr);
        return { nodeArr: myNodeArr, strArr: myStrArr, depthArr: myDepthArr };
    }

    // 获取k个#的字符串
    private getStrOfNSharp(num: number): string {
        let str: string = "";
        while (num--) {
            str = str + "#";
        }
        return str;
    }
    // 字符串有前几个#
    private getNSharpOfStr(str: string): number {
        let i: number = 0;
        for (i = 0; i < str.length; i++) {
            if (str[i] === '#') {
            } else {
                break;
            }
        }
        return i;
    }

    public getFileFormatContent(): string {
        // 获取 bmk文件存储格式字符串
        let depth = 1;

        let allArr: { nodeArr: Array<Node>, strArr: Array<string>, depthArr: Array<number> } = this.getArrayOfTree();
        let myNodeArr: Array<Node> = allArr.nodeArr;
        let myStrArr: Array<string> = allArr.strArr;
        let myDepthArr: Array<number> = allArr.depthArr;
        let myPrintArray: Array<string> = [];
        assert(myStrArr.length === myStrArr.length);

        for (let i = 0; i < myStrArr.length; i++) {
            if (myDepthArr[i] === -1) {
                // 叶结点  书签结点
                let devidedStr = myStrArr[i].split("|");
                let bkName = devidedStr[0];
                let bkUrl = devidedStr[1];
                myPrintArray.push(`[${bkName}](${bkUrl})`);
            } else {
                let depth = myDepthArr[i];
                let strSharp = this.getStrOfNSharp(depth);
                myPrintArray.push(`${strSharp} ${myStrArr[i]}`);
            }
        }
        let retStr: string = "";
        myPrintArray.forEach(function (str) {
            retStr += (str + "\n");
        });
        return retStr;
    }
    public getFileFormatContent2(): string {
        // 获取 bmk文件存储格式字符串  带有书签信息！！！
        let depth = 1;

        let allArr: { nodeArr: Array<Node>, strArr: Array<string>, depthArr: Array<number> } = this.getArrayOfTree();
        let myNodeArr: Array<Node> = allArr.nodeArr;
        let myStrArr: Array<string> = allArr.strArr;
        let myDepthArr: Array<number> = allArr.depthArr;
        let myPrintArray: Array<string> = [];
        assert(myStrArr.length === myStrArr.length);

        for (let i = 0; i < myStrArr.length; i++) {
            if (myDepthArr[i] === -1) {
                // 叶结点  书签结点
                let devidedStr = myStrArr[i].split("|");
                let bkName = devidedStr[0];
                let bkUrl = devidedStr[1];
                let num = this.bookmarkMap.get(bkName);
                if(num === undefined){
                    myPrintArray.push(`[${bkName}](${bkUrl})`);
                }else{
                    myPrintArray.push(`[*${bkName}[${num}]](${bkUrl})`);
                }
                
            } else {
                let depth = myDepthArr[i];
                let strSharp = this.getStrOfNSharp(depth);
                myPrintArray.push(`${strSharp} ${myStrArr[i]}`);
            }
        }
        let retStr: string = "";
        myPrintArray.forEach(function (str) {
            retStr += (str + "\n");
        });
        return retStr;
    }
    public getTreeFormatContent(): string {
        return "";
    }

    public printTreeFileFormat(): void {
        let str: string = this.getFileFormatContent();
        console.log(str);
    }
    public printTreeTreeFormat(): void {

    }
    public printOriginInfo():void {
        console.log(this.root);
    }
    public printTree():void{
        let str:string = this.getFileFormatContent2();
        console.log(str);
    }
    public getPrintContent():string{
        let dataStr = this.getFileFormatContent2();
        return dataStr;
    }
    public getFileStructureData():string{
        const myTree: TargetTree = new AdapterFromTreeToFile(new FileOperation(this.corFilePath));
        return myTree.lsTree();
    }

    public generateTreeFromArray(): void {

    }

    private cleanTree(): void {
        this.root = new Node("个人收藏");
    }

    public writeTreeIntoFile(): void {
        const myTree: TargetTree = new AdapterFromTreeToFile(new FileOperation(this.corFilePath));
        let str: string = this.getFileFormatContent();
        myTree.writeToFile(str);
    }

    public loadTreeFromFile(filePath?: string): void {
        let myTree: TargetTree;
        this.cleanTree();
        if (filePath === undefined) {
            this.corFilePath = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\1.bmk";
            myTree = new AdapterFromTreeToFile(new FileOperation(this.corFilePath));;
        } else {
            console.log("You are loading from " + filePath);
            myTree = new AdapterFromTreeToFile(new FileOperation(filePath));
            this.corFilePath = filePath;
        }

        let strArr: Array<string> = myTree.readArrFromFile();
        let lastKeyWord: string = strArr[0].split(" ")[1];
        strArr.shift(); // 移除个人收藏第一行
        let record: Array<string> = [];
        record.push(lastKeyWord);

        strArr.forEach((str: string) => {
            if (str.length === 0) {
                return;
            }
            let level: number = this.getNSharpOfStr(str);
            let fatherKey: string = record[level - 2];
            if (level === 0) { // 书签
                let devidedStr: Array<string> = str.split("](");
                let bkName: string = devidedStr[0].substring(1);
                let bkUrl: string = devidedStr[1].substring(0, devidedStr[1].length - 1);
                let fatherNode = this.findNode(lastKeyWord);
                fatherNode?.addSons(new Node(bkName, NodeType.leaf, bkUrl));
            } else { // 目录
                let folderName: string = str.split(" ")[1];
                let fatherNode = this.findNode(fatherKey);
                fatherNode?.addSons(new Node(folderName, NodeType.branch));
                if (level >= record.length) {
                    record.push(folderName);
                } else {
                    record[level - 1] = folderName;
                }
                lastKeyWord = folderName;
            }
        });

    }
}

function testTree() {
    // let myTree: Tree = new Tree();
    // myTree.addSonBranch("傻逼1");
    // myTree.addSonBranch("傻逼2");
    // myTree.addSonBranch("傻逼3");
    // myTree.addSonLeaf("百度", "www.baidu.com", "傻逼3");
    // myTree.addSonBranch("傻逼4");
    // myTree.addSonBranch("傻逼5");
    // myTree.writeTreeIntoFile();

    // let myTree: Tree = new Tree();
    // // console.log("⼈" ==="人")
    // myTree.loadTreeFromFile();
    // myTree.printTreeFileFormat();
}

// testTree();
