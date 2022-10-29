import { Node, Catagory, Bookmark, Folder, File } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";
export { TreeIterator };

interface Iterators {
    hasNext(): Boolean;
    next(): [Node, number, boolean];
}

class TreeIterator implements Iterators {
    private root: Node;
    private seq: Array<Node>;
    private depth: Array<number>;
    private isLast: Array<boolean>;
    private index: number;

    constructor(root: Node, method: string) {
        this.root = root;
        this.seq = [];
        this.depth = [];
        this.isLast = [];
        this.index = 0;
        if (method === "level") { this.getLevelSequence(); }
        else { this.getPreSequence(); }
    }

    private getLevelSequence(): void {
        let myQueue: Array<Node> = [];
        myQueue.push(this.root);
        while (myQueue.length > 0) {
            let curNode = myQueue.shift();
            if (curNode !== undefined) {
                this.seq.push(curNode);
                this.depth.push(0);
                this.isLast.push(false);
            }
            curNode?.getChildren().forEach(function (son) {
                myQueue.push(son);
            });
        }
    }

    private preOrder(node: Node, deep: number): void {
        this.seq.push(node);
        this.depth.push(deep);
        node?.getChildren().forEach((son, index) => {
            if (index !== node.getChildren().length - 1) {
                this.isLast.push(false);
            } else {
                this.isLast.push(true);
            }
            this.preOrder(son, deep + 1);
        });
    }

    private getPreSequence(): void {
        this.isLast.push(true);
        this.preOrder(this.root, 1);
    }

    public hasNext(): Boolean {
        if (this.index < this.seq.length) { return true; }
        else { return false; }
    }

    public next(): [Node, number, boolean] {
        return [this.seq[this.index], this.depth[this.index], this.isLast[this.index++]];
    }
}


// function testIterator(){
//     let myTree = new BookmarkTree();
//     // let myLevelIter = new TreeIterator(myTree,"level");
//     // while(myLevelIter.hasNext()){
//     //     let tmpNode = myLevelIter.next()[0];
//     //     console.log(tmpNode.getStr());
//     // }
//     // console.log("\n\n\n\n");
//     let myPreIter = new TreeIterator(myTree.getRoot(),"pre");
//     while(myPreIter.hasNext()){
//         let tmpArr = myPreIter.next();
//         let tmpNode = tmpArr[0];
//         let tmpDepth = tmpArr[1];
//         let tmpLast = tmpArr[2];
//         console.log(tmpNode.getStr());
//         console.log(tmpDepth);
//         console.log(tmpLast);

//     }
// }

// testIterator();