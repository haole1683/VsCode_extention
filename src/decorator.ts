import { Bookmark, Node } from "./node";
export { BookmarkDecorator };

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
            if (this.node.getReadNum()) { str += "*"; }
        }
        return str;
    }
}