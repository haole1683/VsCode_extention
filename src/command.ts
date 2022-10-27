/**
 * https://juejin.cn/post/7032303198333632543
 * https://blog.csdn.net/fanyun_01/article/details/51836174
 */

export { CommandPool };
import { FactoryProducer} from "./Factory";
import { Bookmark, Catagory } from "./node";
import { BookmarkTree } from "./tree";

//调用者
class Invoker {
    redoStack: Array<Command>;
    undoStack: Array<Command>;

    constructor() {
        this.redoStack = [];
        this.undoStack = [];
    }

    public call(cmd: Command): void {
        cmd.execute();
        if(cmd.ifUndo()){
            this.undoStack.push(cmd);
        }
    }

    public undo(): void {
        if (this.undoStack.length === 0) {
            return;
        } else {
            let theLastCmd = this.undoStack.pop();
            if (theLastCmd === undefined || !theLastCmd?.ifUndo()) {
                return;
            }
            theLastCmd.undo();
            this.redoStack.push(theLastCmd);
        }
    }

    public redo(): void {
        if (this.redoStack.length === 0) {
            return;
        } else {
            let theLastCmd = this.redoStack.pop();
            if (theLastCmd === undefined) {
                return;
            }
            theLastCmd.execute();
        }
    }
}



//抽象命令
interface Command {
    execute(): void;
    undo(): void;
    ifUndo(): boolean;
}

//具体命令
class ConcreteCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }

    public execute() {
        this.receiver.action();
    }
}
class AddTitleCommand implements Command {
    constructor(private receiver: Receiver, private args: string) {
        this.receiver = receiver;
        this.args = args;
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.deleteTitle(this.args);
    }
    public execute() {
        // Check logic
        // Perform delete logic

        // log logic
        if (this.args.includes("at")) {
            let devided = this.args.split("at");
            let name = devided[0];
            let folder = devided[1];
            this.receiver.addTitle(name, folder);
        } else {
            this.receiver.addTitle(this.args);
        }
    }
}
class DeleteTitleCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
        this.title = title;
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class AddBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private args: string) {
        this.receiver = receiver;
        this.args = args;
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.deleteBookmark(this.args);
    }
    public execute() {
        this.receiver.addBookmark(this.args);
    }
}
class DeleteBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.deleteBookmark(this.title);
    }
}
class OpenCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.open(this.title);
    }
}
class BookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class EditCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class SaveCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.save();
    }
}
class ShowTreeCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.showTree();
    }
}
class LsTreeCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.lsTree();
    }
}
class ReadBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
        this.receiver.readBookmark(this.title);
    }
}


//接收者
class Receiver {
    private myBkTree:BookmarkTree;
    constructor() {
        let bkTreeFactoryProduct = new FactoryProducer().getBookmarkFactory();
        this.myBkTree = bkTreeFactoryProduct.getTree();
    };

    public action() {
    }

    /**
     * The Cmds receiver receives
     */
    public addTitle(title: string, father?: string) {
        this.myBkTree.addNode(new Catagory(title),father);
    }

    public deleteTitle(title: string) {
        this.myBkTree.deleteNode(new Catagory(title));
    }

    public addBookmark(args: string) {
        let devide = args.split("$");
        let folder: string = devide[1];
        let bmkPart: string = devide[0];
        let bmkArr: Array<string> = bmkPart.split('@');
        let url: string = bmkArr[1];
        let bkName: string = bmkArr[0];
        this.myBkTree.addNode(new Bookmark(bkName, url), folder);
    }

    public deleteBookmark(args: string) {
        this.myBkTree.deleteNode(new Catagory(args));
    }

    public open(filePath: string) {
        console.log("Path is", filePath);
        this.myBkTree.read(filePath);
    }

    public save() {
        this.myBkTree.save();
    }

    public showTree() {
        this.myBkTree.printTree();
    }

    public lsTree() {
        // this.myBkTree.lsTree();
    }

    public readBookmark(title: string) {
        // this.myBkTree.readBookmark(title);
    }

    public getData(): string {
        return this.myBkTree.getFileFormatContent();
    }

    public getFileStructure(): string {
        // return this.myCmd.getFileStructure();
        return "";
    }
}

class CommandPool {
    private receiver: Receiver;
    private invoker: Invoker;
    constructor() {
        this.receiver = new Receiver();
        this.invoker = new Invoker();
    };

    public getReceiver():Receiver{
        return this.receiver;
    }
    public getInvoker():Invoker{
        return this.invoker;
    }
    public sendCommand(thecmd: string, args: string): void {

        // 创建具体命令对象cmd并设定它的接受者
        let cmd: Command = new ConcreteCommand(this.receiver);
        switch (thecmd) {
            case "addTitle":
                cmd = new AddTitleCommand(this.receiver, args);
                break;
            case "deleteTitle":
                cmd = new DeleteTitleCommand(this.receiver, args);
                break;
            case "addBookmark":
                cmd = new AddBookmarkCommand(this.receiver, args);
                break;
            case "deleteBookmark":
                cmd = new DeleteBookmarkCommand(this.receiver, args);
                break;
            case "open":
                cmd = new OpenCommand(this.receiver, args);
                break;
            case "bookmark":
                break;
            case "edit":
                break;
            case "save":
                cmd = new SaveCommand(this.receiver);
                break;
            case "undo":
                this.invoker.undo();
                return;
            case "redo":
                this.invoker.redo();
                return;
            case "showTree":
                cmd = new ShowTreeCommand(this.receiver, args);
                break;
            case "lsTree":
                cmd = new LsTreeCommand(this.receiver);
                break;
            case "readBookmark":
                cmd = new ReadBookmarkCommand(this.receiver, args);
                break;
            default:
                cmd = new ConcreteCommand(this.receiver);
                break;
        }

        this.invoker.call(cmd);
    };

    public getData(): string {
        return this.receiver.getData();
    }
    public getFileStructure(): string {
        return this.receiver.getFileStructure();
    }

}



function testCommand(){
    let cmp:CommandPool = new CommandPool();
    console.log("*********************************");
    cmp.sendCommand("addTitle","嗷嗷");
    cmp.sendCommand("showTree","null");
    cmp.sendCommand("undo","null");
    cmp.sendCommand("showTree","null");
    cmp.sendCommand("redo","null");
    cmp.sendCommand("showTree","null");
    cmp.sendCommand("deleteTitle","嗷嗷");
    cmp.sendCommand("showTree","null");
    cmp.sendCommand("addBookmark","百度@www.baidu.com$面向对象");
    cmp.sendCommand("showTree","null");
    cmp.sendCommand("deleteBookmark","百度");
    cmp.sendCommand("showTree","null");
    // cmp.sendCommand("open","C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\2.bmk");
    // cmp.sendCommand("showTree","null");
    // cmp.sendCommand("addTitle","嗷嗷");
    // cmp.sendCommand("showTree","null");
    // cmp.sendCommand("save","null");
    // cmp.sendCommand("showTree","null");
}
testCommand();