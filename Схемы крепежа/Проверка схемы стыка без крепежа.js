function GetFurnCount(obj) {
    k = 0;
    for (var i = 0; i < obj.Count; i++) {
        obj1 = obj.Objects[i];
        if (obj1 instanceof TFastener) k++;
    }
    if k > 0
        obj.Selected = true;
    return k;
}

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        if ((objChild instanceof TFurnBlock) && (objChild.JointData != '')) {
            if (GetFurnCount(obj) == 0) {
                objChild.Selected = true;
                alert('В схеме крепежа ' + objChild.Name + ' нет крепежа');
            }
        }
        else
        {
            if (objChild.List)
                InToList(objChild);
        }
    }
}

UnSelectAll();
for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if ((obj instanceof TFurnBlock) && (obj.JointData != '')) {
        if (GetFurnCount(obj) == 0) {
            alert('В схеме крепежа ' + obj.Name + ' нет крепежа');
        }
    }
    else
    {
        if (obj.List)
            InToList(obj);
    }
}
