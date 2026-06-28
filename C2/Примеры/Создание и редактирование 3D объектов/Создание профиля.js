// Пример создания профиля с прямоугольным сечением 100х200 и длиной 300
const width = 100; // Ширина профили
const height = 200; // Высота профиля
const length = 300; // Длина профиля

let extrusion = objects3d.NewExtrusionBody(width, height, length);
extrusion.Name = 'Профиль';