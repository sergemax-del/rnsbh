Obj = GetObject('Выберите объект блока');
if (Obj.Owner instanceof TFurnBlock) {
    MainObj = Obj.Owner;
    MainObj.Highlighted = true;
    for (var i = 0; i < Model.SelectionCount; i++) {
        obj1 = Model.Selections[i];
        Undo.OwnerChanging(obj1);
        obj1.Owner = MainObj;
    }

    MainObj.Highlighted = false;
    MainObj.Selected = true;
}
else
{
    alert('Элемент не принадлежит блоку');
}

