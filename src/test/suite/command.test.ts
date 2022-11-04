// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import assert = require('assert');
import { CommandPool } from '../../command';

// import * as myExtension from '../../extension';

suite('Command Test Suite', () => {
    
    function testAddTitle(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test AddTitle");
        myCmd.sendCommand("addTitle","你好");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    ├待阅读
    |    └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
    └你好
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testDeleteTitle(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test DeleteTitle");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("deleteTitle","你好");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testAddBookmark(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test AddBookmark");
        myCmd.sendCommand("addBookmark","百度@www.baidu.comat面向对象");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    ├待阅读
    |    └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
    └[百度](www.baidu.comat面向对象)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testDeleteBookmark(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test DeleteBookmark");
        myCmd.sendCommand("addBookmark","百度@www.baidu.comat面向对象");
        myCmd.sendCommand("deleteBookmark","百度");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testOpenCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test OpenCommand");
        // open another bmk文件
        myCmd.sendCommand("open","C:\\Users\\29971\\Desktop\\Learning\\VSCode_extension\\Project\\case2script\\files\\test1\\test1.bmk");
        // myCmd.sendCommand("open","/Users/leizhe/code/lab/VsCode_extention/files/test1/test1.bmk");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testBookmarkCommand(){ // nothing to do
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test BookmarkCommand");
        myCmd.sendCommand("bookmark", "null");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testUndoCommand(){ 
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test UndoCommand");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("undo","null");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testRedoCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test RedoCommand");
        myCmd.sendCommand("addTitle","你好");
        myCmd.sendCommand("undo","null");
        myCmd.sendCommand("redo","null");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    ├待阅读
    |    └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
    └你好
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testSaveCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test SaveCommand");
        myCmd.sendCommand("addTitle","你好");
        let str: string = 
`# 个人收藏
## 课程
[elearning](https://elearning.fudan.edu.cn/courses)
### 函数式
[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
### 面向对象
## 参考资料
[Markdown Guide](https://www.markdownguide.org)
## 待阅读
[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
## 你好
`;
        assert.equal(myCmd.getSaveContent(), str);
    }

    function testShowTreeCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test ShowTreeCommand");
        myCmd.sendCommand("showTree","null");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

    function testlsTreeCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test lsTreeCommand");
        let str: string  = 
`└base
    └files
        ├1.bmk
        ├2.bmk
        ├3.bmk
        ├test1
        |    └test1.bmk
        └tmp.bmk
`;
        assert.equal(myCmd.getFileStructure(), str);
    }

    function testReadBookmarkCommand(){
        let myCmd:CommandPool = new CommandPool();
        console.log("\n\n Test ReadBookmarkCommand");
        myCmd.sendCommand("readBookmark","elearning");
        let str: string  = 
`└个人收藏
    ├课程
    |    ├*[elearning](https://elearning.fudan.edu.cn/courses)
    |    ├函数式
    |    |    └[JFP](https://www.cambridge.org/core/journals/journal-of-functionalprogramming)
    |    └面向对象
    ├参考资料
    |    └[Markdown Guide](https://www.markdownguide.org)
    └待阅读
        └[Category Theory](http://www.appliedcategorytheory.org/what-is-appliedcategory-theory/)
`;
        assert.equal(myCmd.getShowTreeStr(), str);
    }

	test('Sample test', () => {
		console.log("test in command.test.ts");

        testAddTitle();

        testDeleteTitle();

        testAddBookmark();

        testDeleteBookmark();

        testOpenCommand();
        
        testBookmarkCommand();

        testUndoCommand();

        testRedoCommand();

        testSaveCommand();

        testShowTreeCommand();

        testlsTreeCommand();

        testReadBookmarkCommand();
	});
});
