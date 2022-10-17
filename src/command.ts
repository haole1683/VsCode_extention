/**
 * https://juejin.cn/post/7032303198333632543
 * https://blog.csdn.net/fanyun_01/article/details/51836174
 */

export { CommandPool };
import { TargetCmd, AdapterFromCmdToTree } from "./adapter";
import { Tree } from "./tree";


//调用者
class Invoker {
    constructor(private command: Command) {
        this.command = command;
    }

    public setCommand(command: Command) {
        this.command = command;
    }

    public call() {
        console.log("调用者执行命令command...");
        this.command.execute();
    }
}

//抽象命令
interface Command {
    execute(): void;
}

//具体命令
class ConcreteCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }

    public execute() {
        this.receiver.action();
    }
}
class AddTitleCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
        this.title = title;
    }
    public execute() {
        // Check logic
        // Perform delete logic

        // log logic
        console.log("Add execute");
        if (this.title.includes("at")) {
            let devided = this.title.split("at");
            let name = devided[0];
            let folder = devided[1];
            this.receiver.addTitle(name, folder);
        } else {
            this.receiver.addTitle(this.title);
        }
    }
}
class DeleteTitleCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class AddBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.addBookmark(this.title);
    }
}
class DeleteBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.deleteBookmark(this.title);
    }
}
class OpenCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.open(this.title);
    }
}
class BookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class EditCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}
class SaveCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.save();
    }
}
class ShowTreeCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.showTree();
    }
}
class LsTreeCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.lsTree();
    }
}
class ReadBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    public execute() {
        this.receiver.readBookmark(this.title);
    }
}


//接收者
class Receiver {
    constructor() {
        console.log("new Receiver constructed");
    };
    myCmd: TargetCmd = new AdapterFromCmdToTree(new Tree());
    public action() {
        console.log("接收者的action()方法被调用...");
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
        console.log("接收者的addTitle()方法被调用...");
        this.myCmd.addTitle(title, folder);
    }

    public deleteTitle(title: string) {
        console.log("接收者的deleteTitle()方法被调用...");
        this.myCmd.deleteTitle(title);
    }

    public addBookmark(args: string) {
        console.log("addBookmark方法被调用");
        let devide = args.split("at");
        let folder: string = devide[1];
        let bmkPart: string = devide[0];
        let bmkArr: Array<string> = bmkPart.split('@');
        let url: string = bmkArr[1];
        let bkName: string = bmkArr[0];
        this.myCmd.addBookmark(bkName, url, folder);
    }

    public deleteBookmark(args: string) {
        console.log("deleteBookmark方法被调用");
        this.myCmd.deleteBookmark(args);
    }

    public open(filePath: string) {
        console.log("open()方法被调用...");
        console.log("Path is", filePath);
        this.myCmd.openNewFile(filePath);
    }

    public save() {
        console.log("save()方法被调用...");
        this.myCmd.saveTree();
    }

    public showTree() {
        console.log("showTree()方法被调用...");
        this.myCmd.showTree();
    }

    public lsTree() {
        console.log("lsTree()方法被调用...");
        this.myCmd.lsTree();
    }

    public readBookmark(title: string) {
        console.log("readBookmark()方法被调用...");
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
    
    receiver: Receiver;
    redoStack: Array<string> = [];
    undoStack: Array<string> = [];
    constructor() {
        console.log("new CmdPool constructed");
        this.receiver = new Receiver();
        this.redoStack = new Array<string>;
        this.undoStack = new Array<string>;
    };

    public getData(): string {
        return this.receiver.getData();
    }
    public getFileStructure(): string{
        return this.receiver.getFileStructure();
    }
    public sendCommand(thecmd: string, args: string): void {

        console.log("\n\n\n\n\n\n");
        // 创建具体命令对象cmd并设定它的接受者
        let cmd: Command = new ConcreteCommand(this.receiver);
        switch (thecmd) {
            case "addTitle":
                cmd = new AddTitleCommand(this.receiver, args);
                this.undoStack.push(thecmd + "|" + args); 
                break;
            case "deleteTitle":
                cmd = new DeleteTitleCommand(this.receiver, args);
                this.undoStack.push(thecmd + "|" + args); 
                break;
            case "addBookmark":
                cmd = new AddBookmarkCommand(this.receiver, args);
                this.undoStack.push(thecmd + "|" + args); 
                break;
            case "deleteBookmark":
                cmd = new DeleteBookmarkCommand(this.receiver, args);
                this.undoStack.push(thecmd + "|" + args); 
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
                this.undo();
                return;
            case "redo":
                this.redo();
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
        if (this.redoStack.length === 0) {
            this.redoStack = [];
        }

        // 请求绑定命令
        const ir = new Invoker(cmd);
        console.log("客户访问调用者的call()方法...");
        ir.call();
        console.log(this.undoStack);
        console.log(this.redoStack);
    };

    undo(): void {
        if (this.undoStack.length === 0) {
            return;
        } else {
            let theLastCmd = this.undoStack.pop();
            if (theLastCmd === undefined) {
                return;
            }
            let thelastcmd = theLastCmd.split("|")[0];
            let args = theLastCmd.split("|")[1];
            let cmd:Command;
            switch (thelastcmd) {
                case "addTitle":
                    cmd = new DeleteTitleCommand(this.receiver, args);
                    break;
                case "deleteTitle":
                    cmd = new AddTitleCommand(this.receiver, args);
                    break;
                case "addBookmark":
                    args = args.split("@")[0];
                    cmd = new DeleteBookmarkCommand(this.receiver, args);
                    break;
                case "deleteBookmark":
                    cmd = new AddBookmarkCommand(this.receiver, args);
                    break;
                default:
                    cmd = new ConcreteCommand(this.receiver);
                    break;
            }
            const ir = new Invoker(cmd);
            ir.call();

            this.redoStack.push(theLastCmd);
        }
    }

    redo(): void {
        if (this.redoStack.length === 0) {
            return;
        } else {
            let theLastCmd = this.redoStack.pop();
            if (theLastCmd === undefined) {
                return;
            }
            let thecmd = theLastCmd.split("|")[0];
            let args = theLastCmd.split("|")[1];
            let cmd:Command;
            switch (thecmd) {
                case "addTitle":
                    cmd = new AddTitleCommand(this.receiver, args);
                    break;
                case "deleteTitle":
                    cmd = new DeleteTitleCommand(this.receiver, args);
                    break;
                default:
                    cmd = new ConcreteCommand(this.receiver);
                    break;
            }
            const ir = new Invoker(cmd);
            ir.call();
        }
    }
}

