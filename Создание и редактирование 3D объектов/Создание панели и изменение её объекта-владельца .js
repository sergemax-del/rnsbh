// Пример изменения объекта-владельца панели

/** @param {TFurnPanel} panel */
function LogPanelCoordinates(panel) {
    console.log(`Координаты минимальной точки панели относительно ГСК = ${JSON.stringify(panel.GabMin)}\n Координаты максимальной точки панели относительно ГСК = ${JSON.stringify(panel.GabMax)}`);
}

let block1 = objects3d.NewBlock('Блок 1');
let block2 = objects3d.NewBlock('Блок 2');
block2.PositionX = 1000;

let panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front, block1);
panel.Build();
console.log('Панель создана в блоке "Блок 1"');
LogPanelCoordinates(panel);
panel.Owner = block2
console.log('Объект-владелец панели изменён на "Блок 2"');
LogPanelCoordinates(panel);
panel.ReTransform(block1, block2);
console.log('Лск панели преобразована из блока "Блок 1" в блок "Блок 2"');
LogPanelCoordinates(panel);
