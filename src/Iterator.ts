import { Node,Catagory,Bookmark,Folder,File } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";

interface Iterators {
    hasNext(): Boolean;
    next(): Node;
}

class TreeIterator implements Iterators {
    private tree: Tree;
    private seq: Array<Node>;

    constructor(tree: Tree) {
        this.tree = tree;
    }

    private getSequence() {
        let myQueue: Array<Node> = [];
        myQueue.push(this.tree.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if(curNode !== undefined){
                
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }

    public hasNext(): Boolean {
        throw new Error("Method not implemented.");
    }

    public next(): Node {
        throw new Error("Method not implemented.");
    }
    
}