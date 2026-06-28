// Пример создания панели размером 100х200 в разных пространственных положениях 
// (фронтальное, вертикальное и горизонтальное)
const width = 100; // Ширина панели
const height = 200; // Высота панели

// Фронтальная - панель с единичной матрицей поворота, то есть, оси её ЛСК
// сонаправлены осям ГСК
let panel = objects3d.NewPanel(width, height, objects3d.PanelOrientation.front);
panel.Name = 'Фронтальная';

panel = objects3d.NewPanel(width, height, objects3d.PanelOrientation.vertical);
panel.Name = 'Вертикальная';

panel = objects3d.NewPanel(width, height, objects3d.PanelOrientation.horizont);
panel.Name = 'Горизонтальная';