// Пример получения заметок выделенного объекта

// Проверка версии скрипта и выброс ошибки, если версия < 3
apiVersion.AwareAndThrowIfApiVersionIsLowestThan(3);
let obj = currentFileData.model.SelectedObj;
if (obj) {
    const notes = objectData.GetObjectNotes(obj);
    if (notes)
        UI.dialogs.MessageBox('Заметки:\r\n' + notes);
    else
        UI.dialogs.MessageBox('Объект не содержит заметок');
}