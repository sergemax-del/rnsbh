var Block;

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

DeleteModelLimits();
CopyToBlock();
Log = true;
while (Log)
    Log = MoveToBlock(Block);

