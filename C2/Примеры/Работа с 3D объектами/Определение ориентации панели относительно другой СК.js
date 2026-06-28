// Пример определения ориентации панели относительно другой СК.
// В этом примере будут созданы два блока, каждый с панелью внутри, имитирующей
// фасад модуля.
// Один из блоков будет повёрнут так, что фасад относительно ГСК станет 
// "вертикальной" панелью.
//
// Ориентация панели определяется с помощью перевода вектора, направленного
// вдоль оси Z, из ЛСК панели в необходимую СК. Полученный вектор определяет,
// куда "смотрит" лицевая пласть панели относительно использованной СК
const { NewBlock, NewPanel, PanelOrientation } = objects3d;
const { VectorsAreColinear } = geometry3d;
let centerBlock = NewBlock('Центральный блок');
let leftBlock = NewBlock('Левый блок');
objectTransformation.RotateObject(leftBlock, AxisY, 90, true);;
let centerPanel = NewPanel(100, 100, PanelOrientation.front, centerBlock);
centerPanel.Name = 'Фасад центральный';
let leftPanel = NewPanel(200, 200, PanelOrientation.front, leftBlock);
leftPanel.Name = 'Фасад левый';
leftBlock.Build();
centerBlock.Build();
leftPanel.TranslateLCS(geometry3d.VectorMake(-leftPanel.GSize.x - centerPanel.Thickness, 0, - leftPanel.Thickness));
// Ориентация панели относительно ГСК
LogPanelOrientationDependOnCS(centerPanel);
// Ориентация панели относительно объекта-владельца
LogPanelOrientationDependOnCS(centerPanel, centerBlock);
// Ориентация панели относительно ГСК
LogPanelOrientationDependOnCS(leftPanel);
// Ориентация панели относительно объекта-владельца
LogPanelOrientationDependOnCS(leftPanel, leftBlock);


/**
 * Записать в лог ориентацию панели относительно заданной СК.
 * Если объект, задающий СК не указан, ориентация считается относительно ГСК
 * @param {TFurnPanel} panel Панель.
 * @param {TObject3D} [CSOwner] Объект, задающий СК
 */
function LogPanelOrientationDependOnCS(panel, CSOwner) {
    let dir, dependString;
    if (CSOwner) {
        dir = CSOwner.NObjectToObject(panel, AxisZ);
        dependString = `СК объекта "${CSOwner.Name}"`;
    }
    else {
        dir = panel.NToGlobal(AxisZ);
        dependString = 'ГСК';
    }
    let orientationString;
    if (VectorsAreColinear(dir, AxisX))
        orientationString = 'Вертикальная';
    else if (VectorsAreColinear(dir, AxisY))
        orientationString = 'Горизонтальная';
    else if (VectorsAreColinear(dir, AxisZ))
        orientationString = 'Фронтальная';
    else
        orientationString = 'Не ортогональная';
    console.log(`Ориентация объекта "${panel.Name}" относительно ${dependString} : "${orientationString}"`);
}