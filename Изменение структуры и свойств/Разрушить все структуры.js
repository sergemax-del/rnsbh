var Block;
var filesPathSource;
var filesPathTarget;

//Удаление габаритных рамок и линий стыка
function InToList_TModelLimit(obj) {
    for (var i = obj.Count - 1; i > -1; i--) {
        obj1 = obj.Objects[i];
        if (obj1 instanceof TModelLimits) DeleteObject(obj1);
        else {
            if (obj1.List) InToList_TModelLimit(obj1);
        }
    }
}

function MoveToBlock(obj) {
    Log = false;
    for (var i = obj.Count - 1; i > -1; i--) {
        obj1 = obj.Objects[i];
        if ((obj1.List) && (!(obj1 instanceof TFurnAsm))) {
            for (var i1 = 0; i1 < obj1.Count; i1++) {
                objChild = obj1.Objects[i1];
                NewObj = AddCopy(objChild);
                NewObj.Owner = Block;
                NewObj.ReTransform(obj1, Block);
            }
            DeleteObject(obj1);
            Log = true;
        }
    }
    return Log;
}

function DeleteModelLimits() {
    for (var i = Model.Count - 1; i > -1; i--) {
        obj = Model.Objects[i];
        if (obj instanceof TModelLimits) DeleteObject(obj);
        else {
            if (obj.List) InToList_TModelLimit(obj);
        }
    }
}

function CopyToBlock() {
    Block = AddBlock (Article.Name);
    for (var i = Model.Count - 1; i > -1; i--) {
        obj = Model.Objects[i];
        if ((obj.List) && (!(obj instanceof TFurnAsm)))
        {
            for (var i1 = 0; i1 < obj.Count; i1++) {
                objChild = obj.Objects[i1];
                NewObj = AddCopy(objChild);
                NewObj.Owner = Block;
                NewObj.ReTransform(obj, Block);
            }
            DeleteObject(obj);
        }
    }
}

const fs = require('fs');
const path = require("path");

function DeleteStruct(filename, filenameTarget) {
    Action.LoadModel(filename);
    DeleteModelLimits();
    CopyToBlock();
    Log = true;
    while (Log)
        Log = MoveToBlock(Block);
    Action.Commit();
    Action.SaveModel(filenameTarget);
}

function getFiles(dir, files_) {
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

Prop = Action.Properties;
PropPathSource = Prop.NewSelector('Исходные модели');
PropPathTarget = Prop.NewSelector('Обработанные модели');
OkBtn = Prop.NewButton('Выполнить');

PropPathSource.OnClick = function() {
    PropPathSource.Value = system.askFolder('Исходные модели');
};

PropPathTarget.OnClick = function() {
    PropPathTarget.Value = system.askFolder('Обработанные модели');
};

function Make() {
    filesPathSource = PropPathSource.Value;
    filesPathTarget = PropPathTarget.Value;
    if (filesPathSource != '') {
        var files = getFiles(filesPathSource);
        files.forEach(function(filename) {
            var ext = path.extname(filename);
            var Name = path.parse(filename).base;;
            if (ext == '.b3d')
                filenameTarget = filesPathTarget + Name;
                DeleteStruct(filename, filenameTarget);
        });
    }
}

OkBtn.OnClick = function() {
    filesPathSource = PropPathSource.Value;
    filesPathTarget = PropPathTarget.Value;
    if (filesPathSource == '') {
        alert('Не указана папка с исходными моделями.');
    } else {
        if (filesPathTarget == '') {
            alert('Не указана папка с измененными моделями.');
        } else {
            if (filesPathSource == filesPathTarget) {
                alert('Папки совпадают.');
            } else {
                Make();
                Action.Finish();
            }
        }
    }
}

Action.Continue();


