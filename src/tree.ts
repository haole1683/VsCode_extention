import { Node,Catagory,Bookmark,Folder,File } from "./node";

interface Tree{
    addNode():void;
    deleteNode():void;
    read():void;
    save():void;
    getIterator():Iterable<Node>;
    clear():void;
}

class FileTree implements Tree{
    private children:Array<Node>;

    constructor(){
        this.children = Array<Node>();
    }
    addNode(): void {
        throw new Error("Method not implemented.");
    }
    deleteNode(): void {
        throw new Error("Method not implemented.");
    }
    read(): void {
        throw new Error("Method not implemented.");
    }
    save(): void {
        throw new Error("Method not implemented.");
    }
    getIterator(): Iterable<Node> {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        throw new Error("Method not implemented.");
    }
}


class BookmarkTree implements Tree{
    private children:Array<Node>;

    constructor(){
        this.children = Array<Node>();
    }
    addNode(): void {
        throw new Error("Method not implemented.");
    }
    deleteNode(): void {
        throw new Error("Method not implemented.");
    }
    read(): void {
        throw new Error("Method not implemented.");
    }
    save(): void {
        throw new Error("Method not implemented.");
    }
    getIterator(): Iterable<Node> {
        throw new Error("Method not implemented.");
    }
    clear(): void {
        throw new Error("Method not implemented.");
    }
}