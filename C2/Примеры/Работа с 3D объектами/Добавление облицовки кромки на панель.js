//Пример добавления облицовки кромки на каждый элемент контура панели.
let panel = objects3d.NewPanel(100, 100);
panel.Name = 'Панель с облицовкой кромки (скрипт)';
for (let i = 0; i < panel.Contour.Count; i++) {
    panelOperations.AddButt(panel, i);
}