import { Bookmark, Catagory, Node } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";

class FactoryProducer {
    public getFactory(choice: string): AbstractFactory | undefined {
        if (choice === "Bookmark") { return new BookmarkTreeFactory; }
        else if (choice === "File") { return new FileTreeFactory; }
        else {return undefined;}
    }
}

interface AbstractFactory {
    getTree(): Tree;
    getNode(node: string): Node | undefined;
}

class BookmarkTreeFactory implements AbstractFactory {
    getTree(): Tree {
        return new BookmarkTree;
    }
    getNode(node: string): Node | undefined {
        if (node === "Category") {}
        else if (node === "Bookmark") {}
        else {return undefined;}
    }
}

class FileTreeFactory implements AbstractFactory {
    getTree(): Tree {
        return new FileTree;
    }
    getNode(node: string): Node | undefined {
        if (node === "Category") {}
        else if (node === "Bookmark") {}
        else {return undefined;}
    }
}