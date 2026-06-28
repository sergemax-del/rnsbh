// Пример скрипта, использующего функционал диалоговых окон
// В этом скрипте: 
// 1. Запрашивается файл у пользователя
// 2. Выводится содержимое выбранного файла и запрашивается подтверждение
//    сохранения содержимого в файл под другим именем
// 3. В случае подверждения сохраняется содержимое в выбранный файл и выводится
//    сообщение о сохранении файла
const fs = require('fs');
const path = require('path');
/**@type {DialogParams} */
let dialogParams = {
    extensions: ['txt'],
    initialDir: '',
    title: 'Выберите файл для отображения его содержимого'
}
const button = UI.dialogs.DialogMessageButton;
let filename = UI.dialogs.RunOpenFileDialog(dialogParams);
if (filename) {
    let content = fs.readFileSync(filename, 'utf8');
    if (UI.dialogs.RunMessageDialog(
        `Содержимое файла:\n${content}\nСохранить его под другим именем?`,
        UI.dialogs.DialogMessageType.confirmation,
        new Set([button.yes, button.no])) == UI.dialogs.DialogMessageResult.yes) {
        dialogParams.initialDir = path.dirname(filename);
        filename = UI.dialogs.RunSaveFileDialog(dialogParams);
        if (filename) {
            fs.writeFileSync(filename, content);
            UI.dialogs.MessageBox(`Файл ${filename} сохранён!`);
        }
        else
            UI.dialogs.ErrorBox('Файл не был выбран');
    }
}
else
    UI.dialogs.ErrorBox('Файл не был выбран');