/**
 * Original Codes
 */

// 目标对象
interface Target {
    request(): void;
}
// 被适配者
class Adaptee {
    constructor() { }
    // 这是源角色，有自己的的业务逻辑
    public specificRequest(): void { }
}
// 适配器
class Adapter implements Target {
    private adaptee: Adaptee;
    constructor(adaptee: Adaptee) {
        this.adaptee = adaptee;
    }
    public request(): void {
        this.adaptee.specificRequest();
    }
}
// 使用
const target: Target = new Adapter(new Adaptee());
target.request();







/**
 * Adaptor between Tree data Structre to File
 */

import { FileOperation } from "./fileOps";
import { Tree } from "./tree";

export { TargetTree, AdapterFromTreeToFile };

interface TargetTree {
    lsTree(): string;
    writeToFile(content: string): void;
    readFromFile(): string;
    readArrFromFile(): Array<string>;
}

class AdapterFromTreeToFile implements TargetTree {
    private adaptee: FileOperation;
    constructor(adaptee: FileOperation) {
        this.adaptee = adaptee;
    }
    public lsTree(): string {
        return this.adaptee.lsTreeString();
    }
    public writeToFile(content: string) {
        this.adaptee.writeContent(content);
    }
    public readFromFile() {
        return this.adaptee.readContent();
    }
    public readArrFromFile() {
        return this.adaptee.readContentAsArray();
    }
}

// function testAdapterOne(){
//     const myTree: TargetTree = new AdapterFromTreeToFile(new FileOperation());
//     myTree.writeToFile("WTF");
// }

// testAdapterOne();
// function test(){
//     let str1:string|undefined ="个人收藏";
//     let str2:string = "个人收藏";
//     console.log(str1.indexOf("个人收藏"));
// }

// test();






/**
 * Adapter from cmd to Tree
 */
export { TargetCmd, AdapterFromCmdToTree };
interface TargetCmd {
    getFileStructure(): string;
    getData(): string;
    readBookmark(title: string): void;
    lsTree(): unknown;
    saveTree(): unknown;
    openNewFile(filePath: string): void;
    addTitle(title: string, folder?:string): void;
    addBookmark(bkName: string, bkUrl: string, folder: string): void;
    deleteTitle(title: string): void;
    deleteBookmark(bkName: string): void;
    showTree():void;
}

class AdapterFromCmdToTree implements TargetCmd {
    private adaptee: Tree;
    constructor(adaptee: Tree) {
        this.adaptee = adaptee;
        this.adaptee.loadTreeFromFile();
    }
    getFileStructure(): string {
        return this.adaptee.getFileStructure();
    }
    getData(): string {
        return this.adaptee.getData();
    }
    readBookmark(title: string): void {
        this.adaptee.readBookmark(title);
    }
    lsTree(): void {
        this.adaptee.lsTree();
    }
    saveTree(): void {
        this.adaptee.writeTreeIntoFile();
    }
    openNewFile(filePath: string): void {
        this.adaptee.loadTreeFromFile(filePath);
    }
    showTree(): void {
        this.adaptee.printTree();
    }
    addTitle(title: string, folder?: string): void {
        console.log("add Tietle exc");
        if (folder === undefined) {
            this.adaptee.addSonBranch(title);
        } else {
            console.log("add Tietle exc2");
            this.adaptee.addSonBranch(title, folder);
        }
    }
    addBookmark(bkName: string, bkUrl: string, folder: string): void {
        this.adaptee.addSonLeaf(bkName, bkUrl, folder);
    }
    deleteTitle(title: string): void {
        this.adaptee.deleteNode(title);
    }
    deleteBookmark(bkName: string): void {
        this.adaptee.deleteNode(bkName);
    }

}









