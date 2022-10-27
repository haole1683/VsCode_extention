import { AdapterFromTreeToFile,TargetTree } from "./adapter";
import { FileOperation } from "./fileOps";
import { Node,Catagory,Bookmark,Folder,File } from "./node";

interface Tree{
    addNode(node:Node,father?:string):void;
    deleteNode(node:Node):void;
    read(path:string):void;
    save():void;
    getIterator():Iterable<Node>;
    clear():void;
}

class FileTree implements Tree{
    private root:Node;
    private path:string;

    constructor(){
        this.root = new Catagory("base");
        this.path = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\1.bmk";
    }

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
                let curName = curNode?.getName();
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
     * Tip：可能有多个相同名字的结点，因此返回的是Array<Node>
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

    public save(): void {
        throw new Error("Method not implemented.");
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


class BookmarkTree implements Tree{
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