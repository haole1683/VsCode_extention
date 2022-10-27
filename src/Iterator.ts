import { Node, Catagory, Bookmark, Folder, File } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";

interface Iterators {
    hasNext(): Boolean;
    next(): [Node, Number];
}

class TreeIterator implements Iterators {
    private tree: Tree;
    private seq: Array<Node>;
    private depth: Array<number>;
    private index: number;

    constructor(tree: Tree, method: string) {
        this.tree = tree;
        this.seq = [];
        this.depth = [];
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
                this.depth.push(0);
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }

    private preOrder(node: Node, deep: number): void {
        if (node !== this.tree.getRoot()) { 
            this.seq.push(node); 
            this.depth.push(deep);
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
        return [this.seq[this.index], this.depth[this.index++]];
    }
}


function testIterator(){
    let myTree = new BookmarkTree();
    let myLevelIter = new TreeIterator(myTree,"level");
    while(myLevelIter.hasNext()){
        let tmpNode = myLevelIter.next()[0];
        console.log(tmpNode.getStr());
    }
    console.log("\n\n\n\n");
    let myPreIter = new TreeIterator(myTree,"pre");
    while(myPreIter.hasNext()){
        let tmpArr = myPreIter.next();
        let tmpNode = tmpArr[0];
        let tmpDepth = tmpArr[1];
        console.log(tmpNode.getStr());
        console.log(tmpDepth);
    }
}

// testIterator();