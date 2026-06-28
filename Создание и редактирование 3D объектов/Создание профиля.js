// Пример создания профиля с прямоугольным сечением 100х200 и длиной 300
const radius = 300; // Радиус окружности траектории
const length = 300; // Длина профиля


let extrusion = objects3d.NewExtrusionBody(width, height, length);
extrusion.Name = 'Профиль';