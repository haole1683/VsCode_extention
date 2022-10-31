// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { CommandPool } from '../../command';

// import * as myExtension from '../../extension';

suite('Command Test Suite', () => {
    
    function testAddTitle(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test AddTitle");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("showTree","null");
    }

    function testDeleteTitle(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test DeleteTitle");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("deleteTitle","你好");
        myCmd.sendCommand("showTree","null");
    }

    function testAddBookmark(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test AddBookmark");
        myCmd.sendCommand("addBookmark","百度@www.baidu.comat面向对象");
        myCmd.sendCommand("showTree","null");
    }

    function testDeleteBookmark(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test DeleteBookmark");
        myCmd.sendCommand("addBookmark","百度@www.baidu.comat面向对象");
        myCmd.sendCommand("deleteBookmark","百度");
        myCmd.sendCommand("showTree","null");
    }

    function testOpenCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test OpenCommand");
        // open another bmk文件
        myCmd.sendCommand("open","C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\2.bmk");
        myCmd.sendCommand("showTree","null");
    }

    function testBookmarkCommand(){ // nothing to do
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test BookmarkCommand");
        myCmd.sendCommand("bookmark","你好");
        myCmd.sendCommand("showTree","null");
    }

    function testEditCommand(){ // nothing to do
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test EditCommand");
        myCmd.sendCommand("edit","你好");
        myCmd.sendCommand("showTree","null");
    }

    function testUndoCommand(){ 
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test UndoCommand");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("undo","null");
        myCmd.sendCommand("showTree","null");
    }

    function testRedoCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test RedoCommand");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("undo","null");
        myCmd.sendCommand("redo","null");
        myCmd.sendCommand("showTree","null");
    }

    function testSaveCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test SaveCommand");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("showTree","null");
        myCmd.sendCommand("save","null"); // 在此查看文件修改情况
    }

    function testShowTreeCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test ShowTreeCommand");
        myCmd.sendCommand("showTree","null");
    }

    function testlsTreeCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test lsTreeCommand");
        myCmd.sendCommand("lsTree","null");
    }

    function testReadBookmarkCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test ReadBookmarkCommand");
        myCmd.sendCommand("readBookmark","elearning");
        myCmd.sendCommand("showTree","null");
    }

	test('Sample test', () => {
		console.log("test in command.test.ts");

        // Test Add Cmd
        testAddTitle();

        // Test Delete Cmd
        testDeleteTitle();

        // Test Add Bookmark
        testAddBookmark();

        testDeleteBookmark();

        testOpenCommand();
        
        testBookmarkCommand();

        testEditCommand();

        testUndoCommand();

        testRedoCommand();

        // testSave will influence the corresding file
        // testSaveCommand();

        testShowTreeCommand();

        testlsTreeCommand();

        testReadBookmarkCommand();
	});
});
