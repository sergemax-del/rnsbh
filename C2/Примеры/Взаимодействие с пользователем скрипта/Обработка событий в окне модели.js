// Пример обработки событий в окне модели.
// В этом примере задаются обработчики событий нажатия клавиши мыши и нажатия кнопок.
// При нажатии кнопки мыши работает следующий алгоритм:
// 1. Продолжаем, если нажата левая клавиша мыши
// 2. Если в списке клавиш-модификаторов нет клавиши "Shift", снимаем выделение
//    со всех объектов.
// 3. Получаем данные модели относительно положения мыши.
// 4. Если под курсором мыши есть объект, инвертируем его выделение
//
// При нажатии клавиши клавиатуры работает следующий алгоритм:
// 1. Продолжаем, если нажата кнопка "Escape",
// 2. Запрашиваем подтверждение отмены скрипта у пользователя.
// 3. Если пользователь не подтвердил отмену скрипта, выставляем значение 
//    кнопки равное нулю. Это предотвратит дальнейшую обработку нажатия
//    клавиши "Escape" после завершения назначенного обработчика

execution.ContinueExecution();
const shiftState = UI.constants.shiftState;

let clickPos;
interaction.events.SetMouseDownHandler((sender, button, shift, x, y) => {
    if (button == UI.constants.mouseButton.left) {
        if (!shift.has(shiftState.shift)) {
            currentFileData.model.UnSelectAll();
        }
        let pointInfo = interaction.windowData.GetPointInfo(x, y);
        if (pointInfo && pointInfo.obj)
            pointInfo.obj.Selected = !pointInfo.obj.Selected;
    }
})

interaction.events.SetKeyDownHandler((sender, key, shift) => {
    if (key.value == UI.constants.keys.escape) {
        if (!UI.dialogs.RunYesNoDialog('Отменить выполнение скрипта?'))
            key.value = 0;
    }
})