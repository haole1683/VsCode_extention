# **Software Engineering lab1——Website bookmark Editor based on command line**

## **一、说明**

#### vscode extention 使用typescript开发 lab
#### lab作业说明见lab.pdf
#### 安装运行需要下载安装npm相关依赖包

#### TODO

#### 2.文档待完善
#### 4.prezatation?
#### 5.页面显示有bug，部分网页无法显示 

#### UML图：https://www.processon.com/diagraming/6358f3610791296c855e642f

## **二、演示demo，没弄完**


![demo.gif](/demo/demo.gif)


## **三、文档**

### **1. 书签栏的面向对象模型**

我们采用树作为存储书签栏的数据结构。为此，我们创建了两种Tree和Node两种接口，分别表示树和节点。对于树接口，我们实现了书签树和文件树两种类；对于节点接口，我们实现了目录书签、书签、文件夹和文件四种类。其中书签相关的类用于表示书签栏，文件相关的接口用于表示文件系统。书签栏的UML类图如下图所示。

![书签栏类图](/demo/1.png)

> BookmarkTree类表示书签栏所代表的树，其数据成员与方法如下表所示。

| 数据成员 | 数据类型 | 描述 |
| --- | --- | --- |
| root | Category | 标签栏树树根 |
| path | string | 标签栏的存放地址 |

| 方法 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| addNode | node,father | void |在树中某一具体节点处添加子节点 |
| deleteNode | node | void | 删除某一具体的节点 |
| read | path | void | 从文件中读取书签栏 |
| save | void | void | 将书签栏内容保存至文件中 |
| getIterator | void | Iterator | 获取书签栏树的迭代器 |
| getIterator | void | Iterator | 获取书签栏树的迭代器 |
| clear | void | void | 清空此棵树 |
| getRoot | void | Node | 获取树的树根 |
| readBookmark | title | void | 标记书签已被读取 |

> Category类表示书签目录，其数据成员与方法如下表所示。

| 数据成员 | 数据类型 | 描述 |
| --- | --- | --- |
| name | string | 书签目录名称 |
| children | Array<Node> | 子节点数组 |

| 方法 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| addChild | node | void | 为目录添加某一子节点 |
| deleteChild | node | void | 为目录删除某一子节点 |
| getStr() | void | string | 读取节点描述内容，便于打印 |
| getChildren() | void | Array<Node> | 获取孩子节点数组 |
| setChildren() | Array<Node> | void | 设置孩子节点数组 |

> Bookmark类表示书签，其数据成员与方法如下表所示。

| 数据成员 | 数据类型 | 描述 |
| --- | --- | --- |
| name | string | 书签名称 |
| readNum | number | 书签阅读次数 |
| url | string | 书签的url地址 |

| 方法 | 参数 | 返回值 | 描述 |
| --- | --- | --- | --- |
| getStr() | void | string | 读取节点描述内容，便于打印 |


比如，一个书签栏的数据样例如下：

```json
#个人收藏
##课程
[elearing] (https://elearning.fudan.edu.cn/courses)  
 ## 参考资料
[Markdown Guide](https://www.markdownguide.org) 
### 函数式 
[JFP](https://www.cambridge.org/core/journals/journal-of-functional-programming) 
### ⾯向对象 
## 待阅读 
[Category Theory](http://www.appliedcategorytheory.org/what-is-applied-category-theory/)  
```

其树形结构如下：

![](https://cdn.nlark.com/yuque/0/2022/jpeg/1743388/1666334486582-578b1a6a-f8ec-4c0f-9085-5b5404cd2085.jpeg)

### **2. 设计模式**

#### **2.1 命令模式**
命令模式由命令池、命令接口、具体命令、接收者、调用者组成，下图为命令模式的UML类图。

![2](/demo/2.png)

| 类 | 作用 |
| --- | --- |
| 命令池 | 插件运行时，通过命令池接受指令并生成命令 |
| 命令接口 | 具体命令的接口类 |
| 具体命令 | 具体命令的实现类，包括执行和撤销操作 |
| 接收者 | 具体命令通过调用接收者实现操作 |
| 调用者 | 具体命令使用调用者执行，同时实现撤销操作 |

命令池类代码
```typescript
class CommandPool {
    private receiver: Receiver;
    private invoker: Invoker;
    constructor() {
        this.receiver = new Receiver();
        this.invoker = new Invoker();
    };
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
```

命令接口代码
```typescript
interface Command {
    execute(): void;
    undo(): void;
    ifUndo(): boolean;
}
```

具体命令代码
```typescript
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
        this.name = "";
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
```

接受者代码
```typescript
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
        // let devide = args.split("$");
        // let folder: string = devide[1];
        // let bmkPart: string = devide[0];
        // let bmkArr: Array<string> = bmkPart.split('@');
        // let url: string = bmkArr[1];
        // let bkName: string = bmkArr[0];
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
        this.myBkTree.printTree();
    }
    //展示文件树
    public lsTree() {
        return this.myFileTree.printlsTree();
    }
    //阅读书签
    public readBookmark(title: string) {
        this.myBkTree.readBookmark(title);
    }
}
```

调用者代码
```typescript
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
```

#### **2.2 抽象工厂模式**
由于本项目中存在两种树，书签栏树和文件树，为了便于新建类，使用抽象工厂模式。该这只模式包括工厂生产者类、抽象工厂接口、书签树工厂、文件树工厂。UML类图如下图所示。

![3](/demo/3.png)

| 类 | 作用 |
| --- | --- |
| 工厂生产者类 | 用于生成书签树工厂和文件树工厂 |
| 抽象工厂接口 | 具体工厂的接口 |
| 书签树工厂 | 用于生成书签树和书签节点 |
| 文件树工厂 | 用于生成文件树和文件工厂 |

工厂生产者类
```typescript
class FactoryProducer {
    public getBookmarkFactory() {return new BookmarkTreeFactory;}
    public getFileFactory() { return new FileTreeFactory;    }
}
```

抽象工厂接口
```typescript
interface AbstractFactory {
    getTree(path?:string): Tree;
    getNode(nodeType: string, name: string): Node;
}
```

书签树工厂类
```typescript
class BookmarkTreeFactory implements AbstractFactory {
    getTree(): BookmarkTree {
        return new BookmarkTree();
    }
    getNode(nodeType: string, name: string): Node {
        if (nodeType === "Category") { return new Catagory(name); }
        else if (nodeType === "Bookmark") { return new Bookmark(name, ""); }
        else { return new Catagory(name); }
    }
}
```

文件树工厂类
```typescript
class FileTreeFactory implements AbstractFactory {
    getTree(path?: string): FileTree {
        if (path === undefined) {
            return new FileTree();
        } else {
            return new FileTree(path);
        }
    }
    getNode(nodeType: string, name: string): Node {
        if (nodeType === "Folder") { return new Folder(name); }
        else if (nodeType === "File") { return new File(name); }
        else { return new Folder(name); }
    }
}
```

#### **2.3 迭代器模式**
由于在对树的各种操作中需要进行遍历，为了将遍历的操作抽象出来，使用了迭代器模式，便于对树进行遍历。迭代器模式包括迭代器接口和迭代器类，UML类图如下所示。

![4](/demo/4.png)

迭代器接口的代码如下
```typescript
interface Iterators {
    hasNext(): Boolean;
    next(): [Node, number, boolean];
}
```

树迭代器类的代码如下
```typescript
class TreeIterator implements Iterators {
    private root: Node;
    private seq: Array<Node>;
    private depth: Array<number>;
    private isLast: Array<boolean>;
    private index: number;
    constructor(root: Node, method: string) {
        this.root = root;
        this.seq = [];
        this.depth = [];
        this.isLast = [];
        this.index = 0;
        if (method === "level") { this.getLevelSequence(); }
        else { this.getPreSequence(); }
    }
    private getLevelSequence(): void {
        let myQueue: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if (curNode !== undefined) {
                this.seq.push(curNode);
                this.depth.push(0);
                this.isLast.push(false);
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }
    private preOrder(node: Node, deep: number): void {
        this.seq.push(node);
        this.depth.push(deep);
        node?.getChildren().forEach((son, index) => {
            if (index !== node.getChildren().length - 1) {
                this.isLast.push(false);
            } else {
                this.isLast.push(true);
            }
            this.preOrder(son, deep + 1);
        });
    }
    private getPreSequence(): void {
        this.isLast.push(true);
        this.preOrder(this.root, 1);
    }
    public hasNext(): Boolean {
        if (this.index < this.seq.length) { return true; }
        else { return false; }
    }
    public next(): [Node, number, boolean] {
        return [this.seq[this.index], this.depth[this.index], this.isLast[this.index++]];
    }
}
```

#### **2.4 装饰器模式**
阅读书签后会对书签进行标记，书签标记的显示使用装饰器模式。装饰器模式包括节点装饰器抽象类和书签装饰器类，UML类图如下所示。

![5](/demo/5.png)

节点装饰器抽象类代码如下
```typescript
abstract class NodeDecorator {
    protected node: Node;
    constructor(node: Node) {
        this.node = node;
    }
    public getStr() {
        return this.node.getStr();
    }
}
```

书签装饰器抽象类代码如下
```typescript
class BookmarkDecorator extends NodeDecorator {
    public getDecoratorStr(): string {
        let str:string = super.getStr();
        if (this.node instanceof Bookmark) {
            if (this.node.getReadNum()) { str += "*"; }
        }
        return str;
    }
}
```

#### **2.5 打印树代码复用**
由于需要打印书签树和文件树，所以设计了打印树类，初始化类时传递树，通过调用方法实现打印。

树打印类代码如下
```typescript
class TreePrinter {
    private tree: Tree;
    private record: Array<boolean>;
    constructor(tree: Tree) {
        this.tree = tree;
        this.record = [];
    }
    printTree() {
        let iterator = this.tree.getIterator("pre");
        while (iterator.hasNext()) {
            let tmpStr = "";
            let tmpArr = iterator.next();
            let tmpNode = tmpArr[0];
            let tmpDepth:number = tmpArr[1];
            let tmpLast = tmpArr[2];
            this.record[tmpDepth] = tmpLast;
            for (let i = 1; i < tmpDepth; i++) {
                if (this.record[i] === false) {
                    tmpStr += "|    ";
                } else {
                    tmpStr += "    ";
                }
            }
            if (tmpLast === false) {
                tmpStr += "├" + new BookmarkDecorator(tmpNode).getDecoratorStr();
            } else {
                tmpStr += "└" + new BookmarkDecorator(tmpNode).getDecoratorStr();
            }
            console.log(tmpStr);
        }
    }
}
```



## 四、自动化单元测试
单元测试采用Mocha进行，对每条命令进行单元化测试
Mocha Link:
https://mochajs.org/
