// Пример создания панели и изменения её контура
const radius = 200; // Радиус будущей окружности контура
let panel = objects3d.NewPanel(0, 0, objects3d.PanelOrientation.front);
panel.Name = 'Фронтальная';
let contour = panel.Contour;
contour.Clear(); // Очищение контура
contour.AddCircle(0, 0, radius); // Создание окружности с центром в точке (0, 0) и заданным радиусом