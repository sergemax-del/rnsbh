// Пример получения списка пользовательских свойств выделенного объекта

// Проверка версии скрипта и выброс ошибки, если версия < 3
apiVersion.AwareAndThrowIfApiVersionIsLowestThan(3);
let obj = currentFileData.model.SelectedObj;
if (obj) {
    const properties = objectData.GetObjectUserProperties(obj);
    let output = '';
    // Добавление пользовательских свойств в строку вывода в виде
    // <Имя>: <Значение>
    properties.forEach((value, key) => {
        output += `"${value}": "${key}"\r\n`;
    })
    UI.dialogs.MessageBox(output);
}