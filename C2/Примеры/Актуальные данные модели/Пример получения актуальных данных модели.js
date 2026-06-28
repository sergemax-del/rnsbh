// Пример получения актуальных данных модели и опериования ими

/**
 * Получить количество вложенных объектов (рекурсивно)
 * @param {T3DObjectList} objList 
 */
function GetInternalObjectCountRecursive(objList) {
    let result = objList.Count;
    for (let i = 0; i < objList.Count; i++) {
        let obj = objList.Objects[i];
        if (obj.List)
            result += GetInternalObjectCountRecursive(obj);
    }
    return result;
}

let model = currentFileData.model;
console.log(`Количество объектов верхнего уровня в модели: ${model.Count}`);
console.log(`Общее количество объектов в модели: ${GetInternalObjectCountRecursive(model)}`);

let article = currentFileData.article;
console.log('Параметры изделия:');
console.log(`Наименование: ${article.Name}\nАртикул: ${article.Code}`);

console.log(`Имя текущего редактруемого файла: ${currentFileData.filename}`);