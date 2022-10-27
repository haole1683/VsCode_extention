import assert = require("assert");
import { AdapterFromTreeToFile,TargetTree } from "./adapter";
import { FileOperation } from "./fileOps";
import { MyTreeData } from "./myTreeData";
import { Node,Catagory,Bookmark,Folder,File } from "./node";
export { Tree, BookmarkTree, FileTree };

interface Tree{
    addNode(node:Node,father?:string):void;
    deleteNode(node:Node):void;
    read(path:string):void;
    save():void;
    getIterator():Iterable<Node>;
    clear():void;
}

class BookmarkTree implements Tree{
    private root:Node;
    private path:string;

    constructor(){
        this.root = new Catagory("base");
        this.path = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\1.bmk";
    }
    // 树基本属性get set
    public getRoot():Node{
        return this.root;
    }
    public setRoot(root:Node){
        this.root = root;
    }
    public getPath():string{
        return this.path;
    }
    public setPath(path:string):void{
        this.path = path;
    }

    // 结点基本处理
    /**
     * 找到关键字为keyword的结点
     * @param {string} keyword: 关键字keyword
     * @return 关键字结点的数组
     */
    public findNode(keyword: string): Array<Node> {
        let res:Array<Node> = [];
        let myQueue: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if(curNode !== undefined){
                let curName = curNode.getName();
                if (curName === keyword) {
                    res.push(curNode);
                }
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return res;
    }

    /**
     * 找到关键字结点父亲
     * Tip：可能有多个相同名字的结点，因此返回的是Array<Node>，如果只想获取一个结点，直接索引[0]即可
     * @param keyword 结点关键字
     * @returns 该节点父亲
     */
    public findFatherNode(keyword: string): Array<Node> {
        let myQueue: Array<Node> = [];
        let fahterArr: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            
            if(curNode !== undefined){
                curNode.getChildren().forEach(function (son) {
                if(son !== undefined){
                        if (son.getName() === keyword&&curNode !== undefined) {
                            fahterArr.push(curNode);
                        }
                    }
                });
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return fahterArr;
    }

    /**
     * 向树中添加结点
     * @param node 要添加的结点
     * @param fatherName 可选参数，默认添加到根结点下，否则为指定父亲名字下
     */
    public addNode(node: Node, fatherName?: string): void {
        if(fatherName === undefined){
            this.root.addChild(node);
        }else{
            let father:Node = this.findNode(fatherName)[0];
            father.addChild(node);
        }
    }

    /**
     * 删除树中与node关键字相同的结点
     * @param node 将要删除的结点
     */
    public deleteNode(node: Node): void {
        let fathersNode:Array<Node> = this.findFatherNode(node.getName());
        fathersNode.forEach(function(fatherNode){
            fatherNode.deleteChild(node);
        });
    }


    // 字符串基本处理
    /**
     * 获取k个#的字符串
     * @param num 几个'#'
     * @returns 返回对应字符串
     */
    private getStrOfNSharp(num: number): string {
        let str: string = "";
        while (num--) {
            str = str + "#";
        }
        return str;
    }

    /**
     * 字符串有前几个#
     * @param str 输入字符串
     * @returns 数字
     */ 
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


    // 获取树格式化字符串
    /**递归辅助函数 */
    private getArrayOfTreeWIthRecrusion(curNode: Node, curDepth: number, myNodearr: Array<Node>, myStrArr: Array<string>, myDepthArr: Array<number>): void {
        if (curNode !== null) {
            if (curNode instanceof Catagory) {
                myNodearr.push(curNode);
                myStrArr.push(curNode.getName());
                myDepthArr.push(curDepth);
            } else {
                myNodearr.push(curNode);
                myStrArr.push(curNode.getName() + "|" + curNode.getStr());
                myDepthArr.push(-1); // 代表是书签
            }
            let sonArray:Array<Node> = curNode.getChildren();
            sonArray = sonArray.sort(function(a:Node,b:Node):number{
                if((a instanceof Bookmark && b instanceof Bookmark)||(a instanceof Catagory && b instanceof Catagory)){
                    return 0;
                }else{
                    if(a instanceof Bookmark){
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
    /**获取整棵树各节点数据 */
    private getArrayOfTree(): { nodeArr: Array<Node>, strArr: Array<string>, depthArr: Array<number> } {
        // 获取对应存储bmk每行数据
        let myNodeArr: Array<Node> = [];
        let myStrArr: Array<string> = [];
        let myDepthArr: Array<number> = [];
        this.getArrayOfTreeWIthRecrusion(this.root, 1, myNodeArr, myStrArr, myDepthArr);
        return { nodeArr: myNodeArr, strArr: myStrArr, depthArr: myDepthArr };
    }
    /**
     * 格式化读取树
     * @returns 读取树字符串
     */
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
    /**
     * 打印树结构，用于调试
     */
    public printTree():void{
        let str:string = this.getFileFormatContent();
        console.log(str);
    }

    
    // 文件导入以及写出
    /**
     * 从path路径中读取bmk文件，并在内存中生成树
     * @param path bmk文件路径
     */
    public read(path: string): void {
        let myTree: TargetTree;
        this.clear();
        if (path === undefined) {
            this.path = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\1.bmk";
            myTree = new AdapterFromTreeToFile(new FileOperation(this.path));;
        } else {
            console.log("You are loading from " + path);
            this.path = path;
            myTree = new AdapterFromTreeToFile(new FileOperation(this.path));
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
                let fatherNode = this.findNode(lastKeyWord)[0];
                fatherNode.addChild(new Bookmark(bkName, bkUrl));
            } else { // 目录
                let folderName: string = str.split(" ")[1];
                let fatherNode = this.findNode(fatherKey)[0];
                fatherNode.addChild(new Catagory(folderName));
                if (level >= record.length) {
                    record.push(folderName);
                } else {
                    record[level - 1] = folderName;
                }
                lastKeyWord = folderName;
            }
        });
    }
    /**
     * 将内存中树存储path中
     */
    public save(): void {
        const myTree: TargetTree = new AdapterFromTreeToFile(new FileOperation(this.path));
        let str: string = this.getFileFormatContent();
        myTree.writeToFile(str);
    }
    public getIterator(): Iterable<Node> {
        throw new Error("Method not implemented.");
    }

    /**
     * 清除内存中树
     */
    public clear(): void {
        this.root.setChildren(new Array<Node>);
    }
}


class FileTree implements Tree{
    private children:Array<Node>;

    constructor(){
        this.children = Array<Node>();
    }
    public addNode(node: Node, father?: string | undefined): void {
        throw new Error("Method not implemented.");
    }
    public deleteNode(node: Node): void {
        throw new Error("Method not implemented.");
    }
    public read(path: string): void {
        throw new Error("Method not implemented.");
    }
    public save(): void {
        throw new Error("Method not implemented.");
    }
    public getIterator(): Iterable<Node> {
        throw new Error("Method not implemented.");
    }
    public clear(): void {
        throw new Error("Method not implemented.");
    }
    
}

function testTree(){
    let myTree:BookmarkTree = new BookmarkTree();
    myTree.read("files\1.bmk");
    myTree.printTree();
}
testTree();