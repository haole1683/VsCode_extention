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

    constructor(){
        this.root = new Catagory("base");
    }

    private findNode(keyword: string): Node | undefined {
        let myQueue: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            let curName = curNode?.getName();
            if (curName === keyword) {
                return curNode;
            }
            curNode.get().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return undefined;
    }

    private findFatherNode(keyword: string): Array<Node> {
        // 找到爹
        let myQueue: Array<Node> = [];
        let fahterArr: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            console.log(curNode);
            let flag = false;
            curNode?.getSons().forEach(function (son) {
                if (son.getName() === keyword) {
                    flag = true;
                }
            });
            if (flag) {
                if(curNode !== undefined){
                    fahterArr.push(curNode);
                }
            }
            curNode?.getSons().forEach(function (son) {
                myQueue.push(son);
            });
        }
        return fahterArr;
    }
    public addNode(node: Node, father?: string | undefined): void {
        if(father === undefined){
            this.children.push(node);
        }else{
            
        }
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