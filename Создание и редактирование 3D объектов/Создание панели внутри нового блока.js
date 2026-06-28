// Пример создания панели внутри нового блока.

// Вариант 1 - задать объект-владельца при создании объекта
let block1 = objects3d.NewBlock('Блок 1');
let panel1 = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front, block1);
panel1.Name = 'Панель 1';

// Вариант 2 - задать объект-владельца после создания объекта
let panel2 = objects3d.NewPanel(200, 300, objects3d.PanelOrientation.front);
panel2.Name = 'Панель 2';
panel2.Owner = block1;