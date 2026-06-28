// Пример получения списка дополнительных материалов выделенного объекта

// Проверка версии скрипта и выброс ошибки, если версия < 3
apiVersion.AwareAndThrowIfApiVersionIsLowestThan(3);
let obj = currentFileData.model.SelectedObj;
if (obj) {
    const properties = objectData.GetObjectAdditionalMaterials(obj);
    if (properties.length > 0) {
        let output = '';
        // Добавление дополнительных материалов в строку вывода в виде
        // <Наименование> <Артикул> <Количество> <Единицы измерения>
        properties.forEach(mt => {
            output += `"${mt.name}" "${mt.art}" ${mt.count} "${mt.measure}"\r\n`
        });
        UI.dialogs.MessageBox(output);
    }
    else
        UI.dialogs.MessageBox('У выделенного объекта нет дополнительных материалов')
}