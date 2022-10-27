/**
 * https://juejin.cn/post/7032303198333632543
 * https://blog.csdn.net/fanyun_01/article/details/51836174
 */

export { CommandPool };
import { TargetCmd, AdapterFromCmdToTree } from "./adapter";
import { Tree } from "./tree";


//调用者
class Invoker {
    redoStack: Array<Command>;
    undoStack: Array<Command>;
    
    constructor() {
        this.redoStack = [];
        this.undoStack = [];
    }

    public call(cmd:Command):void {
        cmd.execute();
    }

    public undo(): void {
        if (this.undoStack.length === 0) {
            return;
        } else {
            let theLastCmd = this.undoStack.pop();
            if (theLastCmd === undefined||!theLastCmd?.ifUndo()) {
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
    undo():void;
    ifUndo():boolean;
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
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
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
    constructor() {
    };
    myCmd: TargetCmd = new AdapterFromCmdToTree(new Tree());
    public action() {
    }

    public init() {
        /**
         * 初始化操作：
         *  1.清空文件数据
         *  2.添加个人收藏首行
         */
        // this.cleanData();
        // this.fops.writeContent("# 个人收藏\n## 收藏夹1\n[elearning](https://elearning.fudan.edu.cn/courses)\n");
    }

    private getKeyIndex(strs: Array<string>, keyword: string): number {
        // 返回strs中 有keyword的索引
        let i: number = 0;
        for (i = 0; i < strs.length; i++) {
            if (strs[i].indexOf(keyword) !== -1) {
                return i;
            }
        }
        return -1;
    };

    private getKeySIndex(strs: Array<string>, keyword: string): Array<number> {
        // 返回strs中 有多个keyword的索引
        let i: number = 0;
        let keyArr: Array<number> = [];
        for (i = 0; i < strs.length; i++) {
            if (strs[i].indexOf(keyword) !== -1) {
                keyArr.push(i);
            }
        }
        return keyArr;
    };

    /**
     * The Cmds receiver receives
     */
    public addTitle(title: string, folder?: string) {
        this.myCmd.addTitle(title, folder);
    }

    public deleteTitle(title: string) {
        this.myCmd.deleteTitle(title);
    }

    public addBookmark(args: string) {
        let devide = args.split("at");
        let folder: string = devide[1];
        let bmkPart: string = devide[0];
        let bmkArr: Array<string> = bmkPart.split('@');
        let url: string = bmkArr[1];
        let bkName: string = bmkArr[0];
        this.myCmd.addBookmark(bkName, url, folder);
    }

    public deleteBookmark(args: string) {

        this.myCmd.deleteBookmark(args);
    }

    public open(filePath: string) {
        console.log("Path is", filePath);
        this.myCmd.openNewFile(filePath);
    }

    public save() {
        this.myCmd.saveTree();
    }

    public showTree() {
        this.myCmd.showTree();
    }

    public lsTree() {
        this.myCmd.lsTree();
    }

    public readBookmark(title: string) {
        this.myCmd.readBookmark(title);
    }

    public getData(): string {
        return this.myCmd.getData();
    }

    public getFileStructure(): string {
        return this.myCmd.getFileStructure();
    }
}

class CommandPool {
    private receiver: Receiver;
    private invoker: Invoker;
    constructor() {
        this.receiver = new Receiver();
        this.invoker = new Invoker();
    };

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
                cmd = new ReadBookmarkCommand(this.receiver,args);
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
    public getFileStructure(): string{
        return this.receiver.getFileStructure();
    }
    
}