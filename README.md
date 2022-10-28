# Software Engineering lab1——Website bookmark Editor based on command line

## 一、说明
#### vscode extention 使用typescript开发 lab
#### lab作业说明见lab.pdf
#### 安装运行需要下载安装npm相关依赖包

#### TODO

#### 2.文档待完善
#### 4.prezatation?
#### 5.页面显示有bug，部分网页无法显示 


## 二、演示demo，没弄完


![demo.gif](https://github.com/haole1683/VsCode_extention/blob/main/demo/demo.gif)


## 三、文档


1. 书签栏的面向对象模型

我们采用树作为存储书签栏的数据结构。我们定义了Node和Tree两个类来描述书签栏的树形结构。
Node具体描述树的结点。我们定义了以下四种属性：

| 属性名 | 数据类型 | 描述 |
| --- | --- | --- |
| name | string | 目录（书签）的名称 |
| type | enum NodeType {leaf,branch} | 结点的类型，值为leaf代表叶子结点，即书签，值为branch代表分支结点，即目录 |
| sons | Array<Node> | 当前结点的儿子结点 |
| content | string | 结点的内容，即书签的url信息 |

	Tree具体描述书签栏的树形结构，有以下三种属性：

| 属性名 | 数据类型 | 描述 |
| --- | --- | --- |
| root | Node | 树的根结点 |
| corFilePath | string | 书签文件的存放路径 |
| BookmarkMap | Map<string,number> | 书签url与对应访问次数的映射关系 |

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

2. 设计模式使用

2.1 Adapter模式
在这次lab中，我们在两处运用到了adapter设计模式。
       <1>我们在树形结构和文件操作之间设计了一个适配器。文件操作类中定义并实现了了一系列处理文件的功能，这些功能是处理书签树形数据结构接口的所能利用的，所以我们通过一个适配器类将二者连接起来，代码如下：
```typescript
//目标接口
interface TargetTree {
    lsTree(): string;
    writeToFile(content: string): void;
    readFromFile(): string;
    readArrFromFile(): Array<string>;
}
//适配器
class AdapterFromTreeToFile implements TargetTree {
    private adaptee: FileOperation;
    constructor(adaptee: FileOperation) {}
    public lsTree(): string {}
    public writeToFile(content: string) {}
    public readFromFile() {}
    public readArrFromFile() {}
}
```
<2>另外，我们在命令语句和树的数据结构之间也使用了适配器的思想，在tree这一类中，我们定义了一些操作数据的方法，如addTitle()，addBookmark()，deleteTitle()等，这些功能是命令语句所需要的，所以我们采用了适配器模式，在利用tree类中这些功能实现了TargetCmd接口。
```typescript
//目标接口
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
//适配器
class AdapterFromCmdToTree implements TargetCmd {
    private adaptee: Tree;
    constructor(adaptee: Tree) {}
    getFileStructure(): string {}
    getData(): string {}
    readBookmark(title: string): void {}
    lsTree(): void {}
    saveTree(): void {}
    openNewFile(filePath: string): void {}
    showTree(): void {}
    addTitle(title: string, folder?: string): void {}
    addBookmark(bkName: string, bkUrl: string, folder: string): void {}
    deleteTitle(title: string): void {}
    deleteBookmark(bkName: string): void {}
}
```
2.2 Command模式
对于命令行语句，我们采用Command设计模式，将发出请求(Invoker类)和执行请求(Receive类)分隔开，二者之间通过具体的命令对象沟通，并且在这基础上实现了书签管理工具的redo和undo功能。
```typescript
//调用者
class Invoker {
    constructor(private command: Command) {
        this.command = command;
    }

    public setCommand(command: Command) {
        this.command = command;
    }

    public call() {
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
class AddTitleCommand implements Command {}
class DeleteTitleCommand implements Command {}
class AddBookmarkCommand implements Command {}
class DeleteBookmarkCommand implements Command {}
class OpenCommand implements Command {}
class BookmarkCommand implements Command {}
class EditCommand implements Command {}
class SaveCommand implements Command {}
class ShowTreeCommand implements Command {}
class LsTreeCommand implements Command {}
class ReadBookmarkCommand implements Command {}

//接收者
class Receiver {
    private getKeyIndex(strs: Array<string>, keyword: string): number {};
    private getKeySIndex(strs: Array<string>, keyword: string): Array<number> {};
    /**
     * The Cmds receiver receives
     */
    public addTitle(title: string, folder?: string) {}
    public deleteTitle(title: string) {}
    public addBookmark(args: string) {}
    public deleteBookmark(args: string) {}
    public open(filePath: string) {}
    public save() {}
    public showTree() {}
    public lsTree() {}
    public readBookmark(title: string) {}
    public getData(): string {}
    public getFileStructure(): string {}
}

class CommandPool {
    
    receiver: Receiver;
    redoStack: Array<string> = [];
    undoStack: Array<string> = [];
    public getData(): string {}
    public getFileStructure(): string{}
    public sendCommand(thecmd: string, args: string): void {};

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
```



## 四、自动化单元测试
单元测试采用Mocha进行，对每条命令进行单元化测试
Mocha Link:
https://mochajs.org/