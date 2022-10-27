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
    private children:Array<Node>;

    constructor(){
        this.children = Array<Node>();
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