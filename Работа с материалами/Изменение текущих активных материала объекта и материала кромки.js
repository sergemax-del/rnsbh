//Пример изменения текущих активных материала объекта и материала кромки
materialData.SetupActiveMaterial('ДСП бук 16\r60', 16, 0);
materialData.SetupActiveButtMaterial('Кромка ПВХ Бук 0,4/19', 0.4, 0, true, 'Бук0,4/19', 0, true, 0);
let panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front);
panelOperations.AddButt(panel, 0);

materialData.ChooseActiveFurnMaterial();
materialData.ChooseActiveButtMaterial();
panel = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.vertical);
panelOperations.AddButt(panel, 0);