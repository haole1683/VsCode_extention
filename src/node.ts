export {Node,Catagory,Bookmark,Folder,File};

interface Node{
    getName():string;
    setName(name:string):void;
    addChild(son:Node):void;
    deleteChild(son:Node):void;
    getStr():string;
}

class Catagory implements Node{
    private name: string; // 目录（书签）名称额
    private sons: Array<Node>;   // 儿子结点 
    constructor(name:string){
        this.name = name;
        this.sons = Array<Node>();
    }
    public getName(): string{
        return this.name;
    }
    public setName(name:string): void{
        this.name = name;
    }
    public addChild(son:Node): void {
        this.sons.push(son);
    }
    public deleteChild(son: Node): void {
        let sonName:string = son.getName();
        let i = -1;
        for (i = 0; i < this.sons.length; i++) {
            if (this.sons[i].getName() === sonName) {
                break;
            }
        }
        if (i === -1) { 
            return;
        }
        this.sons.splice(i, 1);
    }
    public getStr(): string {
        return this.name;
    }
}

class Bookmark implements Node{
    private name: string; // 目录（书签）名称额
    private readNum: number; 
    constructor(name:string){
        this.name = name;
        this.readNum = 0;
    }
    public getName(): string{
        return this.name;
    }
    public setName(name:string): void{
        this.name = name;
    }
    public addChild(son:Node): void {
        return;
    }
    public deleteChild(son: Node): void {
        return;
    }
    public getStr(): string {
        return this.name;
    }
}

class Folder implements Node{
    private name: string; // 目录（书签）名称额
    private sons: Array<Node>;   // 儿子结点 
    constructor(name:string){
        this.name = name;
        this.sons = Array<Node>();
    }
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public addChild(son: Node): void {
        this.sons.push(son);
    }
    public deleteChild(son: Node): void {
        let sonName:string = son.getName();
        let i = -1;
        for (i = 0; i < this.sons.length; i++) {
            if (this.sons[i].getName() === sonName) {
                break;
            }
        }
        if (i === -1) { 
            return;
        }
        this.sons.splice(i, 1);
    }
    public getStr(): string {
        return this.name;
    }
}

class File implements Node{
    private name: string; // 目录（书签）名称额
    constructor(name:string){
        this.name = name;
    }
    public getName(): string{
        return this.name;
    }
    public setName(name:string): void{
        this.name = name;
    }
    public addChild(son:Node): void {
        return;
    }
    public deleteChild(son: Node): void {
        return;
    }
    public getStr(): string {
        return this.name;
    }
}