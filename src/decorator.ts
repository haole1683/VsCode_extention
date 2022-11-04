import { Bookmark, Node } from "./node";
export { BookmarkDecorator };

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

class BookmarkDecorator extends NodeDecorator {
    public getDecoratorStr(): string {
        let str:string = super.getStr();
        if (this.node instanceof Bookmark) {
            if (this.node.getReadNum()) { str = "*" + str; }
        }
        return str;
    }
}