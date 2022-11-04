import * as  fs from "fs";
import * as  path from "path";
import { FileOperation } from "./fileOps";
import { Node, Catagory, Bookmark, Folder, File } from "./node";
import { TreeIterator } from "./Iterator";
import { TreePrinter } from "./treePrinter";
export { Tree, BookmarkTree, FileTree };

interface Tree {
    getRoot(): Node;
    addNode(node: Node, father?: string): void;
    deleteNode(node: Node): void;
    read(path: string): void;
    save(): void;
    getIterator(method: string): TreeIterator;
    clear(): void;
}

class BookmarkTree implements Tree {
    private root: Node;
    private path: string;
    private bookmarkMap: Map<string, number>;
    constructor() {
        this.root = new Catagory("个人收藏");
        this.bookmarkMap = new Map<string, number>;
        const dirPath = path.resolve(__dirname, '../files/1.bmk');
        this.path = dirPath;
        console.log(this.path);
        this.read(this.path);
    };

    // 树基本属性get set
    public getRoot(): Node {
        return this.root;
    }
    public setRoot(root: Node) {
        this.root = root;
    }
    public getPath(): string {
        return this.path;
    }
    public setPath(path: string): void {
        this.path = path;
    }

    // 结点基本处理
    /**
     * 找到关键字为keyword的结点
     * @param {string} keyword: 关键字keyword
     * @return 关键字结点的数组
     */
    public findNode(keyword: string): Array<Node> {
        let res: Array<Node> = [];
        let treeLevelIterator = new TreeIterator(this.root, "level");
        while (treeLevelIterator.hasNext()) {
            let tmpNode = treeLevelIterator.next()[0];
            if (tmpNode.getName() === keyword) {
                res.push(tmpNode);
            }
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
        // let myQueue: Array<Node> = [];
        let fahterArr: Array<Node> = [];
        // myQueue.push(this.root);
        let treeLevelIterator = new TreeIterator(this.root, "level");
        while (treeLevelIterator.hasNext()) {
            let tmpNode = treeLevelIterator.next()[0];
            if (tmpNode !== undefined) {
                tmpNode.getChildren().forEach(function (son) {
                    if (son !== undefined) {
                        if (son.getName() === keyword && tmpNode !== undefined) {
                            fahterArr.push(tmpNode);
                        }
                    }
                });
            }
        }
        return fahterArr;
    }
    /**
     * 获取爹名
     * @param keyword 儿子名
     * @returns 爹名
     */
    public getFatherNodeKeyWord(keyword: string): string {
        let father = this.findFatherNode(keyword)[0];
        return father.getName();
    }
    /**
     * 返回书签对应url
     * @param keyword 书签名
     * @returns 书签url
     */
    public getBKUrl(keyword: string) {
        let node = this.findNode(keyword)[0];
        return node.getStr();
    }
    /**
     * 向树中添加结点
     * @param node 要添加的结点
     * @param fatherName 可选参数，默认添加到根结点下，否则为指定父亲名字下
     */
    public addNode(node: Node, fatherName?: string): void {
        if (fatherName === undefined) {
            this.root.addChild(node);
        } else {
            let father: Node = this.findNode(fatherName)[0];
            father.addChild(node);
        }
    }
    /**
     * 删除树中与node关键字相同的结点
     * @param node 将要删除的结点
     */
    public deleteNode(node: Node): void {
        let fathersNode: Array<Node> = this.findFatherNode(node.getName());
        fathersNode.forEach(function (fatherNode) {
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

    //获取待保存内容
    public getSaveContent(): string {
        let retStr: string = "";
        let treePreIterator = new TreeIterator(this.root, "pre");
        while (treePreIterator.hasNext()) {
            let tmpArr = treePreIterator.next();
            let tmpNode = tmpArr[0];
            let tmpDepth: number = tmpArr[1];

            if (tmpNode instanceof Catagory) {
                retStr += this.getStrOfNSharp(tmpDepth) + " ";
                retStr += (tmpNode.getStr() + "\n");
            } else {
                retStr += (tmpNode.getStr() + "\n");
            }
        }
        return retStr;
    }

    /**
     * 打印树结构，用于调试
     */
    public printTree(): void {
        let treePrinter = new TreePrinter(this);
        treePrinter.printTree();
    }
    public getPrintTreeStr(): string {
        let treePrinter = new TreePrinter(this);
        treePrinter.printTree();
        return treePrinter.getPrintTreeStr();
    }

    // Bookmark读取
    /**
     * 读取bk，将其读取次数+1
     * @param title bookmark名称
     */
    public readBookmark(title: string) {
        let node = this.findNode(title)[0];
        if (node instanceof Bookmark) {
            node.addReadNum();
        }
    }

    // 文件导入以及写出
    /**
     * 从path路径中读取bmk文件，并在内存中生成树
     * @param path bmk文件路径
     */
    public read(path: string): void {
        // let myTree: TargetTree;
        let fileOperation: FileOperation;
        this.clear();
        if (path === undefined) {
            this.path = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\1.bmk";
            fileOperation = new FileOperation(this.path);
        } else {
            console.log("You are loading from " + path);
            this.path = path;
            fileOperation = new FileOperation(this.path);
        }

        let strArr: Array<string> = fileOperation.readContentAsArray();
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
                fatherNode?.addChild(new Catagory(folderName));
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
        let fileOperation = new FileOperation(this.path);
        let str: string = this.getSaveContent();
        fileOperation.writeContent(str);
    }

    // 迭代器
    public getIterator(method: string): TreeIterator {
        if (method === "level") { return new TreeIterator(this.root, "level"); }
        else { return new TreeIterator(this.root, "pre"); }
    }

    /**
     * 清除内存中树
     */
    public clear(): void {
        this.root.setChildren(new Array<Node>);
    }
}



class FileTree implements Tree {
    private root: Node;
    private path: string;
    constructor(path?: string) {
        this.root = new Folder("base");
        if (path === undefined) {
            this.path = "C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files";
            // this.path = "/Users/leizhe/code/lab/VsCode_extention/files";
        } else {
            this.path = path;
        }

        this.read(this.path);
    }

    // 基本get set属性处理
    public getRoot(): Node {
        return this.root;
    }
    public setRoot(node: Folder) {
        this.root = node;
    }
    public getPath(): string {
        return this.path;
    }
    public setPath(path: string) {
        this.path = path;
    }

    // 结点基本处理
    /**
     * 找到关键字为keyword的结点
     * @param {string} keyword: 关键字keyword
     * @return 关键字结点的数组
     */
    public findNode(keyword: string): Array<Node> {
        let res: Array<Node> = [];
        let treeLevelIterator = new TreeIterator(this.root, "level");
        while (treeLevelIterator.hasNext()) {
            let tmpNode = treeLevelIterator.next()[0];
            if (tmpNode.getName() === keyword) {
                res.push(tmpNode);
            }
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
        let fahterArr: Array<Node> = [];
        let treeLevelIterator = new TreeIterator(this.root, "level");
        while (treeLevelIterator.hasNext()) {
            let tmpNode = treeLevelIterator.next()[0];
            if (tmpNode !== undefined) {
                tmpNode.getChildren().forEach(function (son) {
                    if (son !== undefined) {
                        if (son.getName() === keyword && tmpNode !== undefined) {
                            fahterArr.push(tmpNode);
                        }
                    }
                });
            }
        }
        return fahterArr;
    }

    /**
     * 向树中添加结点
     * @param node 要添加的结点
     * @param fatherName 可选参数，默认添加到根结点下，否则为指定父亲名字下
     */
    public addNode(node: Node, fatherName?: string): void {
        if (fatherName === undefined) {
            this.root.addChild(node);
        } else {
            let father: Node = this.findNode(fatherName)[0];
            father.addChild(node);
        }
    }

    /**
     * 删除树中与node关键字相同的结点
     * @param node 将要删除的结点
     */
    public deleteNode(node: Node): void {
        let fathersNode: Array<Node> = this.findFatherNode(node.getName());
        fathersNode.forEach(function (fatherNode) {
            fatherNode.deleteChild(node);
        });
    }


    // 文件目录读取相关
    /**
     * 
     * @param path 文件（目录）路径（最后以文件（目录）名字结尾，如C:\\Desktop\\1.bmk或者C:\\Desktop\\myFolder)
     * @returns 返回 Array<string>  arr[0]为文件路径(C:\\Desktop) arr[1]为文件名(目录名)(1.bmk myFolder)
     */
    private getPathAndName(path: string): Array<string> {
        let filePath: string = path;
        let devidedStr: Array<string> = filePath.split("\\");
        // let devidedStr: Array<string> = filePath.split("/");
        let fileName: string = devidedStr[devidedStr.length - 1];
        let fileDir = filePath.substring(0, filePath.length - fileName.length - 1);
        return [fileDir, fileName];
    }
    private readHelper(father: Node, fpath: string): void {
        if (fs.existsSync(fpath)) {
            if (fs.statSync(fpath).isDirectory()) {//是目录
                let newFolder = new Folder(this.getPathAndName(fpath)[1]);
                father.addChild(newFolder);
                let son = fs.readdirSync(fpath);
                for (let i = 0; i < son.length; i++) {
                    let newPath = path.join(fpath, son[i]);
                    this.readHelper(newFolder, newPath);
                }
            } else {// 是文件
                father.addChild(new File(this.getPathAndName(fpath)[1]));
            }
        }
    }

    /**
     * 根据当前path，读取path下文件结构到当前树中
     */
    public read(path: string): void {
        this.path = path;
        this.readHelper(this.root, this.path);
    }
    /**
     * 无用，不考虑更改文件目录
     */
    public save(): void {
        return;
    }


    // 文件目录显示输出相关
    private lsTreeHelper(node: Node, level: number, printString: Array<string>): void {
        let fName = node.getName();
        if (level === 0) {
            printString.push(fName);
        } else {
            let strPrint: string = "";
            for (let i = 0; i < level; i++) {
                strPrint += " ";
            }
            printString.push(strPrint + "├" + fName);
        }
        let nodeArr: Array<Node> = node.getChildren();
        for (let i = 0; i < nodeArr.length; i++) {
            this.lsTreeHelper(nodeArr[i], level + 1, printString);
        }
    }

    // }
    /**
     * 获取打印字符串
     * @returns 字符串
     */
    public lsTreeString(): string {
        let printString: Array<string> = [];
        this.lsTreeHelper(this.root, 0, printString);
        let retStr: string = "";
        printString.forEach(function (str) {
            retStr += (str + "\n");
        });
        return retStr;
    }
    /**
     * console.log 输出打印，用于调试
     */
    public printlsTree(): void {
        let treePrinter = new TreePrinter(this);
        treePrinter.printTree();
    }

    public getPrintlsTree(): string {
        let treePrinter = new TreePrinter(this);
        return treePrinter.getPrintTreeStr();
    }

    public getIterator(method: string): TreeIterator {
        if (method === "level") { return new TreeIterator(this.root, "level"); }
        else { return new TreeIterator(this.root, "pre"); }
    }

    /**
     * 清除内存中树
     */
    public clear(): void {
        this.root.setChildren(new Array<Node>);
    }
}