//Пример добавления облицовки пласти разными материалами с обеих сторон панели.
let panel = objects3d.NewPanel(100, 100);
panel.Name = 'Панель с облицовкой пласти (скрипт)';
let material = materialData.CreateMaterialData('"Передний" пластик', 0.5);
panelOperations.AddPlastic(panel, true, material);
material = materialData.CreateMaterialData('"Задний" пластик', 1);
panelOperations.AddPlastic(panel, false, material);