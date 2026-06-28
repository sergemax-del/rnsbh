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
        obj.ReTransform(obj.Owner, block.Owner);
        obj.Owner = block.Owner;
        if (obj.List){
            blocklist.push(obj);
        }
    }
    DeleteObject(block);
    if (recursive) {
        for (var i = 0; i < blocklist.length; i++) {
            DestroyBlock(blocklist[i], true);
        }
    }
}


var block = Model.Selected.AsList();
for (var i = block.Count - 1; i >= 0; i--) {
    var obj = block[i];
    if (obj.List) {
        DestroyBlock(obj, true);
    }
}