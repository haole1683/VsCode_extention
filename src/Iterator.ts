import { Node,Catagory,Bookmark,Folder,File } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";

interface Iterators {
    hasNext(): Boolean;
    next(): Node;
}

class TreeIterator implements Iterators {
    private tree: Tree;
    private seq: Array<Node>;
    private index: number;

    constructor(tree: Tree) {
        this.tree = tree;
        this.seq = [];
        this.getSequence();
        this.index = 0;
    }

    private getSequence() {
        let myQueue: Array<Node> = [];
        myQueue.push(this.tree.getRoot());
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if(curNode !== undefined){
                this.seq.push(curNode);
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }

    public hasNext(): Boolean {
        if (this.index < this.seq.length) {return true;}
        else { return false;}
    }

    public next(): Node {
        return this.seq[this.index++];
    }
    
}


