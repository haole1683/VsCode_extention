export { Node, Catagory, Bookmark, Folder, File };

interface Node {
    getName(): string;
    setName(name: string): void;

    addChild(son: Node): void;
    deleteChild(son: Node): void;

    getChildren(): Array<Node>;
    setChildren(children: Array<Node>): void;

    getStr(): string;
    getUrl(): string;
}

class Catagory implements Node {
    private name: string; // 目录（书签）名称额
    private children: Array<Node>;   // 儿子结点 
    constructor(name: string) {
        this.name = name;
        this.children = Array<Node>();
    }
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public addChild(son: Node): void {
        this.children.push(son);
    }
    public deleteChild(son: Node): void {
        let sonName: string = son.getName();
        let i = -1;
        for (i = 0; i < this.children.length; i++) {
            if (this.children[i].getName() === sonName) {
                break;
            }
        }
        if (i === -1) {
            return;
        }
        this.children.splice(i, 1);
    }
    public getChildren(): Array<Node> {
        return this.children;
    }
    public setChildren(children: Array<Node>): void {
        this.children = children;
    }
    public getStr(): string {
        return this.name;
    }
    public getUrl(): string {
        return "";
    }
}

class Bookmark implements Node {
    private name: string; // 目录（书签）名称额
    private readNum: number;
    private url: string;
    constructor(name: string, url: string) {
        this.name = name;
        this.readNum = 0;
        this.url = url;
    }
    // 基本属性set get
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public getReadNum(): number {
        return this.readNum;
    }
    public setReadNum(num: number) {
        this.readNum = num;
    }
    public addReadNum(): void {
        // 增加阅读次数
        this.readNum++;
    }
    public setUrl(url: string) {
        this.url = url;
    }
    public getUrl(): string {
        return this.url;
    }
    // 孩子结点处理
    public addChild(son: Node): void {
        return;
    }
    public deleteChild(son: Node): void {
        return;
    }
    public getChildren(): Array<Node> {
        return new Array<Node>();
    }
    public setChildren(children: Array<Node>): void {
        return;
    }
    public getStr(): string {
        return `[${this.name}](${this.url})`;
    }
}

class Folder implements Node {
    private name: string; // 目录（书签）名称额
    private children: Array<Node>;   // 儿子结点 
    constructor(name: string) {
        this.name = name;
        this.children = Array<Node>();
    }
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public addChild(son: Node): void {
        this.children.push(son);
    }
    public deleteChild(son: Node): void {
        let sonName: string = son.getName();
        let i = -1;
        for (i = 0; i < this.children.length; i++) {
            if (this.children[i].getName() === sonName) {
                break;
            }
        }
        if (i === -1) {
            return;
        }
        this.children.splice(i, 1);
    }
    public getChildren(): Array<Node> {
        return this.children;
    }
    public setChildren(children: Array<Node>): void {
        this.children = children;
    }
    public getStr(): string {
        return this.name;
    }
    public getUrl(): string {
        return "";
    }
}

class File implements Node {
    private name: string; // 目录（书签）名称额
    constructor(name: string) {
        this.name = name;
    }
    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public addChild(son: Node): void {
        return;
    }
    public deleteChild(son: Node): void {
        return;
    }
    public getChildren(): Array<Node> {
        return new Array<Node>();
    }
    public setChildren(children: Array<Node>): void {
        return;
    }
    public getStr(): string {
        return this.name;
    }
    public getUrl(): string {
        return "";
    }
}