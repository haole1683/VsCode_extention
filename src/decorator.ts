import { Bookmark, Node } from "./node";
export { BookmarkDecorator1, BookmarkDecorator2 };

//装饰器模式

abstract class NodeDecorator {
    protected node: Node;
    constructor(node: Node) {
        this.node = node;
    }

    public getStr() {
        return this.node.getStr();
    }
}

class BookmarkDecorator1 extends NodeDecorator {
    public getDecoratorStr(): string {
        let str:string = super.getStr();
        if (this.node instanceof Bookmark) {
            if (this.node.getReadNum()) { 
                let devidedStr: Array<string> = str.split("[", 2);
                str = devidedStr[0] + "[*" + devidedStr[1];
            }
        }
        return str;
    }
}

class BookmarkDecorator2 extends NodeDecorator {
    public getDecoratorStr(): string {
        let str:string = super.getStr();
        if (this.node instanceof Bookmark) {
            if (this.node.getReadNum()) { 
                let devidedStr: Array<string> = str.split("[", 2);
                str = devidedStr[0] + "[*" + devidedStr[1];
                devidedStr = str.split("]", 2);
                str = devidedStr[0] + "[" + this.node.getReadNum() + "]]" + devidedStr[1];
            }
        }
        return str;
    }
}