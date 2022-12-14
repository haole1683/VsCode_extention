import { Bookmark, Catagory, File, Folder, Node } from "./node";
import { Tree, BookmarkTree, FileTree } from "./tree";
export { BookmarkTreeFactory, FileTreeFactory,FactoryProducer};

//抽象工厂模式

interface AbstractFactory {
    getTree(path?:string): Tree;
    getNode(nodeType: string, name: string): Node;
}

class FactoryProducer {
    public getBookmarkFactory() {return new BookmarkTreeFactory;}
    public getFileFactory() { return new FileTreeFactory;    }
}

class BookmarkTreeFactory implements AbstractFactory {
    getTree(): BookmarkTree {
        return new BookmarkTree();
    }
    getNode(nodeType: string, name: string): Node {
        if (nodeType === "Category") { return new Catagory(name); }
        else if (nodeType === "Bookmark") { return new Bookmark(name, ""); }
        else { return new Catagory(name); }
    }
}

class FileTreeFactory implements AbstractFactory {
    getTree(path?: string): FileTree {
        if (path === undefined) {
            return new FileTree();
        } else {
            return new FileTree(path);
        }
    }
    getNode(nodeType: string, name: string): Node {
        if (nodeType === "Folder") { return new Folder(name); }
        else if (nodeType === "File") { return new File(name); }
        else { return new Folder(name); }
    }
}