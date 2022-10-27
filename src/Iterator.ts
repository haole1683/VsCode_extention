import { Node, Catagory, Bookmark, Folder, File } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";

interface Iterators {
    hasNext(): Boolean;
    next(): Node;
}

class TreeIterator implements Iterators {
    private tree: Tree;
    private seq: Array<Node>;
    private deepth: Array<number>;
    private index: number;

    constructor(tree: Tree, method: string) {
        this.tree = tree;
        this.seq = [];
        this.deepth = [];
        this.index = 0;
        if (method === "level") { this.getLevelSequence(); }
        else { this.getPreSequence(); }
    }

    private getLevelSequence(): void {
        let myQueue: Array<Node> = [];
        myQueue.push(this.tree.getRoot());
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if (curNode !== undefined) {
                this.seq.push(curNode);
                this.deepth.push(0);
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }

    private preOrder(node: Node, deep: number): void {
        if (node !== this.tree.getRoot()) { 
            this.seq.push(node); 
            this.deepth.push(deep);
        }
        node?.getChildren().forEach( (son) => {
            this.preOrder(son, deep + 1);
        });
    }

    private getPreSequence(): void {
        this.preOrder(this.tree.getRoot(), 0);
    }

    public hasNext(): Boolean {
        if (this.index < this.seq.length) { return true; }
        else { return false; }
    }

    public next():[Node, Number] {
        return [this.seq[this.index], this.deepth[this.index++]];
    }

}

