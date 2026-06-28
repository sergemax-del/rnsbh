/**
 * Разрушить блок
 * @param {List3D} block Блок для разрушения
 * @param {boolean} recursive Флаг - разрушать ли вложенные блоки
 */
function DestroyBlock(block, recursive) {
    // Если блок - Модель, то ничего не делаем, иначе посыпятся аксессы
    if (block == Model)
        return;
    // Флаг, создан ли блок скриптом (находится во временной области модели)
    var blockIsScript = block.IsOwner(Model.Temp);
    Undo.Changing(block);
    // список вложенных блоков. Используется если разрушение рекурсивное
    var blocklist = [];
    // Идём от последнего элемента к первому, т.к. при удалении объекта из блока,
    // кол-во элементов внутри уменьшается.
    for (var i = block.Count - 1; i >= 0; i--) {
        var obj = block.Objects[i];
        //Если не скриптовый блок, сохраняем изменения объекта в истории вручную
        if (!blockIsScript) {
            Undo.Changing(obj);
            Undo.OwnerChanging(obj);
        }
        if ((block instanceof TFurnBlock)&&(block.DatumMode != 7)){
			obj.ReTransform(obj.Owner, block.Owner);
			obj.Owner = block.Owner;
            if (obj instanceof TModelLimits) DeleteObject(obj);

        if (obj.List){
            blocklist.push(obj);
        }}
    }
    if ((block instanceof TFurnBlock)&&(block.DatumMode != 7)){
    DeleteObject(block);
    }
    if (recursive) {
        for (var i = 0; i < blocklist.length; i++) {
            DestroyBlock(blocklist[i], true);
        }
    }
}


for(var k = 0; k < Model.SelectionCount; k++) {
    var block = Model.Selections[k].AsList();
    for (var j = block.Count - 1; j >= 0; j--) {
        var obj = block[j];
        if (obj.List) {
           DestroyBlock(obj, true);
        }
    }
}