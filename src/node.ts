export {Node,Catagory,Bookmark,Folder,File};

interface Node{
    addChild():void;
    deleteChild():void;
    print():void;
}

class Catagory implements Node{
    private name: string; // 目录（书签）名称额
    private sons: Array<Node>;   // 儿子结点 
    constructor(name:string){
        this.name = name;
        this.sons = Array<Node>();
    }
    addChild(): void {
        throw new Error("Method not implemented.");
    }
    deleteChild(): void {
        throw new Error("Method not implemented.");
    }
    print(): void {
        throw new Error("Method not implemented.");
    }
}

class Bookmark implements Node{
    private name: string; // 目录（书签）名称额
    private readNum: number; 
    constructor(name:string){
        this.name = name;
        this.readNum = 0;
    }
    addChild(): void {
        throw new Error("Method not implemented.");
    }
    deleteChild(): void {
        throw new Error("Method not implemented.");
    }
    print(): void {
        throw new Error("Method not implemented.");
    }
}

class Folder implements Node{
    private name: string; // 目录（书签）名称额
    private sons: Array<Node>;   // 儿子结点 
    constructor(name:string){
        this.name = name;
        this.sons = Array<Node>();
    }
    addChild(): void {
        throw new Error("Method not implemented.");
    }
    deleteChild(): void {
        throw new Error("Method not implemented.");
    }
    print(): void {
        throw new Error("Method not implemented.");
    }
}

class File implements Node{
    private name: string; // 目录（书签）名称额
    constructor(name:string){
        this.name = name;
    }
    addChild(): void {
        throw new Error("Method not implemented.");
    }
    deleteChild(): void {
        throw new Error("Method not implemented.");
    }
    print(): void {
        throw new Error("Method not implemented.");
    }
}