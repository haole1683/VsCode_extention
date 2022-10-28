// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';
import * as  fs from "fs";
import { MyTreeData } from './myTreeData';
import { CommandPool } from './command';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function getHtml(type:number,data:string):string{
    // 1为访问网址， 2为显示标签
    let htmlStr:string;
    if(type ===1 ){
        htmlStr = 
    `
            <!DOCTYPE html >
            <html lang="en">
            <head>
            <head>
            <style>
              body, html
                {
                  margin: 0; padding: 0; height: 100%; overflow: hidden;
                }
                .vscode-light {
                    background: #fff;
                }
            </style>
          </head>
          <body>
            <iframe  class="vscode-light" id= "iframe" width="100%" height="100%" src="${data}" frameborder="0">
            </iframe>
          </body>
          </html>
            `;
    }else{
        htmlStr = 
        `
            <!DOCTYPE html >
            <html lang="en">
            <head>
            <head>
            <style>
              body, html
                {
                  margin: 0; padding: 0; height: 100%; overflow: hidden;
                }
                .vscode-light {
                    background: #fff;
                }
            </style>
          </head>
          <body>
            <div>
                <br/><br/><br/><br/>
                ${data}
            </div>
          </body>
          </html>
            `;
    }
    // console.log(htmlStr);
    return htmlStr;
};
export async function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "case2script" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json


    /**
     * 大纲显示
     */
    //注册命令 case2script.opendir，使用这个命令的时候，会调用callback()
    let treeviewTest = vscode.commands.registerCommand('TreeViewTest_One.opendir', () => {
        vscode.window.showInformationMessage("hello TTT");
        let options = {
            canSelectFiles: true,		//是否可选择文件
            canSelectFolders: false,		//是否可选择目录
            canSelectMany: false,		//是否可多选
            defaultUri: vscode.Uri.file("D:/VScode"),	//默认打开的文件夹
            openLabel: 'Choose Your file',
            title: "Hello"
        };
        vscode.window.showOpenDialog(options).then(result => {
            if (result === undefined) {
                vscode.window.showInformationMessage("can't open dir.");
            }
            else {
                //vscode.window.showInformationMessage("open dir: " + result.toString());
                //TODO: 这里 URI 转本地路径，暂时先这样，以后再改
                var loadUri = result[0].path.toString();
                console.log("1" + loadUri);
                var loadDir = loadUri.substring(1, loadUri.length);
                console.log(loadDir);
                vscode.window.showInformationMessage("open dir: " + loadDir);
                vscode.window.registerTreeDataProvider('TreeViewTest_One', new MyTreeData(loadDir));


                // 显示书签栏树形结构
                let content: string = fs.readFileSync(loadDir, "utf-8");
                let lines: Array<string> = content.split('\n');

            }
        });
    });
    context.subscriptions.push(treeviewTest);

    //注册命令 MyTreeItem.itemClick
    context.subscriptions.push(vscode.commands.registerCommand('MyTreeItem.itemClick', (label, filePath, url) => {
        //TODO：可以获取文件内容显示出来，这里暂时只打印入参
        url = url.substring(1, url.length - 1);
        console.log("label : " + label);
        console.log("filePath : " + filePath);
        console.log("url: " + url);
        if (url !== null) {
            const panel = vscode.window.createWebviewPanel(
                'webPage',
                label,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );
            panel.webview.html = getHtml(1,url);
        }
    }));

    //function activate 中 添加
    //注册命令 TreeViewTest_One.item.add
    context.subscriptions.push(vscode.commands.registerCommand('TreeViewTest_One.item.add', () => {
        //TODO：你想要执行的操作，这里只弹出信息
        vscode.window.showInformationMessage('add');
    }));
    //注册命令 TreeViewTest_One.item.delete
    context.subscriptions.push(vscode.commands.registerCommand('TreeViewTest_One.item.delete', () => {
        //TODO：你想要执行的操作，这里只弹出信息
        vscode.window.showInformationMessage('delete');
    }));



    /**
     * 。。
     */
    // Hello world
    let disposable = vscode.commands.registerCommand('case2script.helloWorld', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from case2script! I am Dylan Zhang ~');

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        let res = await axios.get("https://www.zhihu.com/api/v4/topics/19552112");
        let snippetString = "name: " + res.data.name + "\n" + "introduction:" + res.data.introduction;

        let snippet: vscode.SnippetString = new vscode.SnippetString(snippetString);
        editor.insertSnippet(snippet);
    });
    context.subscriptions.push(disposable);


    // askQ部分
    let askQ = vscode.commands.registerCommand("case2script.askQuestion", async () => {
        let answer = await vscode.window.showInformationMessage("How was your day ?", "good", "bad",);
        if (answer === "bad") {
            vscode.window.showInformationMessage("sorry to hear it");

        } else {
            console.log({ answer });
        }
    });
    context.subscriptions.push(askQ);


    /**
     * Command 指令
     */
    let commandPool = new CommandPool(); // 命令池

    let addTitleCmd = vscode.commands.registerCommand('case2script.addTitle', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("addTitle", inputwindow);
        }
    });
    context.subscriptions.push(addTitleCmd);

    let deleteTitleCmd = vscode.commands.registerCommand('case2script.deleteTitle', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("deleteTitle", inputwindow);
        }
    });
    context.subscriptions.push(deleteTitleCmd);

    let addBookmarkCmd = vscode.commands.registerCommand('case2script.addBookmark', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("addBookmark", inputwindow);
        }
    });
    context.subscriptions.push(addBookmarkCmd);

    let deleteBookmarkCmd = vscode.commands.registerCommand('case2script.deleteBookmark', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("deleteBookmark", inputwindow);
        }
    });
    context.subscriptions.push(deleteBookmarkCmd);

    let openCmd = vscode.commands.registerCommand('case2script.open', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("open", inputwindow);
        }
    });
    context.subscriptions.push(openCmd);

    let bookmarkCMd = vscode.commands.registerCommand('case2script.bookmark', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("deleteTitle", inputwindow);
        }
    });
    context.subscriptions.push(bookmarkCMd);

    let editCmd = vscode.commands.registerCommand('case2script.edit', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("deleteTitle", inputwindow);
        }
    });
    context.subscriptions.push(editCmd);

    let saveCmd = vscode.commands.registerCommand('case2script.save', async () => {
        commandPool.sendCommand("save", "");
    });
    context.subscriptions.push(saveCmd);

    let undoCmd = vscode.commands.registerCommand('case2script.undo', async () => {
        commandPool.sendCommand("undo", "null");
    });
    context.subscriptions.push(undoCmd);

    let redoCmd = vscode.commands.registerCommand('case2script.redo', async () => {
        commandPool.sendCommand("redo", "null");
    });
    context.subscriptions.push(redoCmd);

    let showTreeCmd = vscode.commands.registerCommand('case2script.showTree', async () => {
        // commandPool.sendCommand("showTree", "null");
        const panel = vscode.window.createWebviewPanel(
            'webPage',
            "Working On",
            {
                viewColumn:vscode.ViewColumn.Active,
                preserveFocus:true
            },
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                // preserveFocus:true,
            }
        );
        let dataStr:string = commandPool.getData();
        var reg = new RegExp("\n", "g" );
        dataStr = dataStr.replace(reg,"<br/>");

        panel.webview.html = getHtml(2,dataStr);
    });
    context.subscriptions.push(showTreeCmd);

    let lsTreeCmd = vscode.commands.registerCommand('case2script.lsTree', async () => {
        // commandPool.sendCommand("showTree", "null");
        const panel = vscode.window.createWebviewPanel(
            'webPage',
            "Working On",
            {
                viewColumn:vscode.ViewColumn.Active,
                preserveFocus:true
            },
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                // preserveFocus:true,
            }
        );
        let dataStr:string = commandPool.getFileStructure();
        let reg = new RegExp("\n", "g" );
        let reg2 = new RegExp(" ","g");
        dataStr = dataStr.replace(reg,"<br/>");
        dataStr = dataStr.replace(reg2,"&nbsp&nbsp&nbsp&nbsp");

        panel.webview.html = getHtml(2,dataStr);
    });
    context.subscriptions.push(lsTreeCmd);

    let readBookmarkCmd = vscode.commands.registerCommand('case2script.readBookmark', async () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let inputwindow = await vscode.window.showInputBox();
        while (inputwindow === undefined) {
            vscode.window.showInformationMessage("You input is empty");
            inputwindow = await vscode.window.showInputBox();
        }
        console.log(inputwindow);
        if (inputwindow !== undefined) {
            commandPool.sendCommand("readBookmark", inputwindow);
        }
    });
    context.subscriptions.push(readBookmarkCmd);
}

// this method is called when your extension is deactivated
export function deactivate() { }
