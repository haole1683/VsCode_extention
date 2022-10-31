import { Node } from "./node";
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
        return str;
    }
}