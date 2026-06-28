let arranger = arrangePositions.NewArranger();
arranger.parameters.arrangeMode = arrangePositions.ArrangeMode.allObjects;
arranger.parameters.designationPrefix = currentFileData.article.ShortSign;
arranger.parameters.list = currentFileData.model;
arranger.parameters.options.LoadFromSettings();
arranger.parameters.selectedOnly = false;
if (arranger.ArrangeObjects()) {
    UI.dialogs.MessageBox('Расстановка позиций выполнена успешно');
    historyOperations.CommitCurrentChanges('Выполнение расстановки позиций в скрипте')
}