Uroven = 0;

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
            alert('Тип объекта = ' + objChild + ' Имя = ' + objChild.Name + '. Уровень = ' + Uroven); //Это тестовая печать. Можно удалить
        if (objChild.Name == 'Габаритная рамка') objChild.Selected = true;  //Можно проверить на имя объекта
//        if (objChild instanceof TModelLimits) objChild.Selected = true; //Можно проверить на тип объекта
        Uroven++;
        if (objChild instanceof TFurnBlock) InToList(objChild); //Если это блок, заходим в блок
        Uroven--;
    }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
        alert('Тип объекта = ' + obj + ' Имя = ' + obj.Name + '. Уровень = ' + Uroven); //Это тестовая печать. Можно удалить
    if (obj.Name == 'Габаритная рамка') obj.Selected = true;  //Можно проверить на имя объекта
//    if (obj instanceof TModelLimits) obj.Selected = true; //Можно проверить на тип объекта
    Uroven++;
    if (obj instanceof TFurnBlock) InToList(obj); //Если это блок, заходим в блок
    Uroven--;
}
