export { CommandPool };
import { FactoryProducer } from "./Factory";
import { Bookmark, Catagory, Node } from "./node";
import { BookmarkTree, FileTree } from "./tree";

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
        if (cmd.ifUndo()) {
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

//命令接口
interface Command {
    execute(): void;
    undo(): void;
    ifUndo(): boolean;
}

//空命令
class EmptyCommand implements Command {
    constructor() {
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }
    public execute() {
    }
}

//添加书签目录命令
class AddTitleCommand implements Command {
    private name: string;
    constructor(private receiver: Receiver, private args: string) {
        this.receiver = receiver;
        this.args = args;
        this.name = args;
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.deleteTitle(this.name);
    }
    public execute() {
        if (this.args.includes("at")) {
            let devided = this.args.split("at");
            this.name = devided[0];
            let folder = devided[1];
            this.receiver.addTitle(this.name, folder);
        } else {
            this.receiver.addTitle(this.args);
        }
    }
}

//删除书签目录命令
class DeleteTitleCommand implements Command {
    private fatherName: string;
    private node: Node;
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
        this.title = title;
        this.node = this.receiver.getNode(title);
        this.fatherName = "";
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.addTitle(this.node, this.fatherName);
    }
    public execute() {
        this.fatherName = this.receiver.getFather(this.title);
        this.receiver.deleteTitle(this.title);
    }
}

//添加书签
class AddBookmarkCommand implements Command {
    private name: string;
    constructor(private receiver: Receiver, private args: string) {
        this.receiver = receiver;
        this.args = args;
        this.name = "";
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.deleteBookmark(this.name);
    }
    public execute() {
        let devide = this.args.split("$");
        let folder: string = devide[1];
        let bmkPart: string = devide[0];
        let bmkArr: Array<string> = bmkPart.split('@');
        let url: string = bmkArr[1];
        let bkName: string = bmkArr[0];
        this.name = bkName;
        this.receiver.addBookmark(bkName, url, folder);
    }
}

//删除书签命令
class DeleteBookmarkCommand implements Command {
    private node: Node;
    private fatherName: string;
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
        this.title = title;
        this.node = this.receiver.getNode(title);
        this.fatherName = "";
    }
    ifUndo(): boolean {
        return true;
    }
    undo(): void {
        this.receiver.addBookmark(this.node.getName(), this.node.getUrl(), this.fatherName);
    }
    public execute() {
        this.fatherName = this.receiver.getFather(this.title);
        this.receiver.deleteBookmark(this.title);
    }
}

//打开书签命令
class OpenCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.open(this.title);
    }
}

//初始化书签命令
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

//修改所打开的标签文件命令
class EditCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.deleteTitle(this.title);
    }
}

//保存命令
class SaveCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.save();
    }
}

//展示当前书签树命令
class ShowTreeCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.showTree();
    }
}

//展示文件树命令
class LsTreeCommand implements Command {
    constructor(private receiver: Receiver) {
        this.receiver = receiver;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.lsTree();
    }
}

//读书签命令
class ReadBookmarkCommand implements Command {
    constructor(private receiver: Receiver, private title: string) {
        this.receiver = receiver;
        this.title = title;
    }
    ifUndo(): boolean {
        return false;
    }
    undo(): void {
    }
    public execute() {
        this.receiver.readBookmark(this.title);
    }
}


//接收者
class Receiver {
    private myBkTree: BookmarkTree;
    private myFileTree: FileTree;
    constructor() {
        let bkTreeFactoryProduct = new FactoryProducer().getBookmarkFactory();
        this.myBkTree = bkTreeFactoryProduct.getTree();
        let fileTreeFactoryProduct = new FactoryProducer().getFileFactory();
        this.myFileTree = fileTreeFactoryProduct.getTree();
    };
    //获取父节点
    public getFather(name: string): string {
        let fatherNode = this.myBkTree.findFatherNode(name)[0];
        return fatherNode.getName();
    }
    //获取节点
    public getNode(name: string): Node {
        let node = this.myBkTree.findNode(name)[0];
        return node;
    }
    //添加书签目录
    public addTitle(title: string | Node, father?: string) {
        if (typeof title === 'string') {
            this.myBkTree.addNode(new Catagory(title), father);
        } else {
            this.myBkTree.addNode(title, father);
        }
    }
    //删除书签目录
    public deleteTitle(title: string) {
        this.myBkTree.deleteNode(new Catagory(title));
    }
    //添加书签目录
    public addBookmark(bkName: string, url: string, folder: string) {
        this.myBkTree.addNode(new Bookmark(bkName, url), folder);
    }
    //删除书签目录
    public deleteBookmark(args: string) {
        this.myBkTree.deleteNode(new Bookmark(args, ""));
    }
    //打开文件
    public open(filePath: string) {
        console.log("Path is", filePath);
        this.myBkTree.clear();
        this.myBkTree.read(filePath);
        this.myFileTree.read(filePath);
    }
    //保存文件
    public save() {
        this.myBkTree.save();
    }
    //展示树
    public showTree() {
        return this.myBkTree.getPrintTreeStr();
    }
    //展示文件树
    public lsShowTree() {
        return this.myBkTree.getLsTreeString();
    }
    //展示文件树
    public lsTree() {
        return this.myFileTree.getPrintlsTree();
    }
    //阅读书签
    public readBookmark(title: string) {
        this.myBkTree.readBookmark(title);
    }
    public getShowTreeStr(): string {
        return this.myBkTree.getSaveContent();
    }
}

class CommandPool {
    private receiver: Receiver;
    private invoker: Invoker;
    constructor() {
        this.receiver = new Receiver();
        this.invoker = new Invoker();
    };

    public getReceiver(): Receiver {
        return this.receiver;
    }
    public getInvoker(): Invoker {
        return this.invoker;
    }
    public sendCommand(thecmd: string, args: string): void {
        // 创建具体命令对象cmd并设定它的接受者
        let cmd: Command = new EmptyCommand();
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
                cmd = new EmptyCommand();
                break;
        }
        this.invoker.call(cmd);
    };

    public getShowTreeStr(): string {
        return this.receiver.getShowTreeStr();
    }
    public getFileStructure(): string {
        return this.receiver.lsTree();
    }
}



function testCommand() {
    let cmp: CommandPool = new CommandPool();
    console.log("*********************************");

    cmp.sendCommand("addTitle", "嗷嗷");
    cmp.sendCommand("addTitle", "bbat嗷嗷");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("undo", "null");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("undo", "null");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("addBookmark", "aa@www.baidu.com$面向对象");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("undo", "null");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("readBookmark", "elearning");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("deleteTitle", "面向对象");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("undo", "null");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("redo", "null");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("readBookmark", "elearning");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("open", "/Users/leizhe/code/lab/VsCode_extention/files/2.bmk");
    cmp.sendCommand("showTree", "null");
    cmp.sendCommand("addTitle", "嗷嗷");
    cmp.sendCommand("save", "null");
    cmp.sendCommand("lsTree", "null");





    // cmp.sendCommand("undo", "null");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("deleteBookmark", "aa");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("undo", "null");
    // cmp.sendCommand("showTree", "null");

    // cmp.sendCommand("addTitle", "嗷嗷");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("undo", "null");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("redo", "null");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("deleteTitle", "嗷嗷");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("addBookmark", "百度@www.baidu.com$面向对象");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("deleteBookmark", "百度");
    // cmp.sendCommand("showTree", "null");
    // cmp.sendCommand("open","C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\2.bmk");
    // cmp.sendCommand("showTree","null");
    // cmp.sendCommand("addTitle","嗷嗷");
    // cmp.sendCommand("showTree","null");
    // cmp.sendCommand("save","null");
    // cmp.sendCommand("showTree","null");
}
// testCommand();