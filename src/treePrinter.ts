import { BookmarkDecorator } from "./decorator";
import { BookmarkTree, Tree } from "./tree";
export { TreePrinter };

class TreePrinter {
    private tree: Tree;
    private record: Array<boolean>;
    constructor(tree: Tree) {
        this.tree = tree;
        this.record = [];
    }
    printTree() {
        let iterator = this.tree.getIterator("pre");
        while (iterator.hasNext()) {
            let tmpStr = "";
            let tmpArr = iterator.next();
            let tmpNode = tmpArr[0];
            let tmpDepth:number = tmpArr[1];
            let tmpLast = tmpArr[2];
            
            this.record[tmpDepth] = tmpLast;
            for (let i = 1; i < tmpDepth; i++) {
                if (this.record[i] === false) {
                    tmpStr += "|    ";
                } else {
                    tmpStr += "    ";
                }
            }
            if (tmpLast === false) {
                tmpStr += "├" + new BookmarkDecorator(tmpNode).getDecoratorStr();
            } else {
                tmpStr += "└" + new BookmarkDecorator(tmpNode).getDecoratorStr();
            }

            console.log(tmpStr);
        }
    }
}

function testTreePrinter(){
    let myTree = new BookmarkTree();
    let treePrinter = new TreePrinter(myTree);
    treePrinter.printTree();
}

// testTreePrinter();