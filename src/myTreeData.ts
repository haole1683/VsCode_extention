//myTreeData.ts
import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, ProviderResult, window } from "vscode";
import * as  fs from "fs";
import * as path from "path";
import { Folder,File,Catagory,Bookmark } from "./node"; 

export class MyTreeData implements TreeDataProvider<MyTreeItem>{
    constructor(private rootPath: string, private type: string) {
    }

    getTreeItem(element: MyTreeItem): MyTreeItem | Thenable<MyTreeItem> {
        return element;
    }

    getChildren(element?: MyTreeItem | undefined): ProviderResult<MyTreeItem[]> {
        if (!this.rootPath) {
            window.showInformationMessage('No file in empty directory');
            return Promise.resolve([]);
        }
        if (this.type === "file") {
            if (element === undefined) {
                return Promise.resolve(this.searchFiles(this.rootPath));
            }
            else {
                return Promise.resolve(this.searchFiles(path.join(element.parentPath, element.label)));
            }
        }else{
            if (element === undefined) {
                return Promise.resolve(this.searchBookmarks(this.rootPath, null, 1));
            }
            else {
                return Promise.resolve(this.searchBookmarks(element.parentPath, element.label, element.level));
            }
        }        
    }

    // 查找文件信息
    private searchFiles(parentPath: string): MyTreeItem[] {
        var treeDir: MyTreeItem[] = [];
        var fsReadDir = fs.readdirSync(parentPath, 'utf-8');
        fsReadDir.forEach(fileName => {
            var filePath = path.join(parentPath, fileName);//用绝对路径
            if (fs.statSync(filePath).isDirectory()) {//目录
                treeDir.push(new MyTreeItem(fileName, parentPath, TreeItemCollapsibleState.Collapsed, 0, null));
            }
            else {//文件
                treeDir.push(new MyTreeItem(fileName, parentPath, TreeItemCollapsibleState.None, 0, null));
            }
        });
        return treeDir;
    }

    //查找书签信息
    private searchBookmarks(parentPath: string, keyword: string | null, level: number): MyTreeItem[] {
        var treeDir: MyTreeItem[] = [];
        if (this.pathExists(parentPath)) {
            // 读取文件内容
            let content: string = fs.readFileSync(parentPath, "utf-8");
            console.log(content);
            let lines: Array<string> = content.split('\n');
            console.log(lines);
            if (keyword === null) {
                keyword = lines[0].split(" ")[1];
                level = lines[0].split(" ")[0].length;
                treeDir.push(new MyTreeItem(keyword, parentPath, TreeItemCollapsibleState.Collapsed, level, null));
                return treeDir;
            }
            console.log(keyword + level);
            var i = 0;
            for (i = 0; i < lines.length; i++) {
                if (lines[i].indexOf(keyword) !== -1) {
                    break;
                }
            }
            lines = lines.slice(i + 1);
            console.log(lines);
            let lineShow = Array<string>();
            let flag: boolean = true; // 是否第一次获取下行数据
            for (i = 0; i < lines.length; i++) {
                if (lines[i][0] === '[' && flag) {
                    lineShow.push(lines[i]);
                } else {
                    flag = false;
                    let prefixSharp: string = lines[i].split(" ")[0];
                    let sharpNum = prefixSharp.length;
                    if (sharpNum === level + 1) { // 刚好在下级目录
                        lineShow.push(lines[i]);
                    } else if (sharpNum <= level) { // 已经到达同级目录或者上级目录
                        break;
                    } else { // 下下级目录
                        continue;
                    }
                }
            }
            console.log(lineShow);


            lineShow.forEach(sentence => {
                if (sentence[0] === '[') { // 属于书签
                    let arr: Array<string> = sentence.split(']');
                    let name: string = arr[0].substring(1);
                    let url: string = arr[1];
                    treeDir.push(new MyTreeItem(name, parentPath, TreeItemCollapsibleState.None, level + 1, url));
                } else { // 属于文件夹
                    let arr: Array<string> = sentence.split(' ');
                    let name: string = arr[1];
                    treeDir.push(new MyTreeItem(name, parentPath, TreeItemCollapsibleState.Collapsed, level + 1, null));
                }
            });
        }
        return treeDir;
    }

    //判断路径是否存在
    private pathExists(filePath: string): boolean {
        try {
            fs.accessSync(filePath);
        }
        catch (err) {
            return false;
        }
        return true;
    }
}

export class MyTreeItem extends TreeItem {
    constructor(
        public readonly label: string,      //存储当前标签
        public readonly parentPath: string,   //存储当前标签的路径，不包含该标签这个目录
        public readonly collapsibleState: TreeItemCollapsibleState,
        public level: number,
        public url: string | null,
    ) {
        super(label, collapsibleState);
    }

    //设置鼠标悬停在此项上时的工具提示文本
    // get tooltip():string{
    //     return path.join(this.parentPath, this.label);
    // }
    //为每项添加点击事件的命令
    command = {
        title: "this.label",
        command: 'MyTreeItem.itemClick',
        arguments: [    //传递两个参数
            this.label,
            path.join(this.parentPath, this.label),
            this.url
        ]
    };
    contextValue = 'MyTreeItem';//提供给 when 使用
}
