// Пример создания тела по траектории с прямоугольным сечением 100х200 и траекторией в виде окружности с радиусом 300
const width = 100; // Ширина сечения
const height = 200; // Высота сечения 
const radius = 300; // Радиус окружности траектории

let trajectoryBody = objects3d.NewTrajectoryBody();
trajectoryBody.Name = 'Тело по траектории';

// Редактирование сечения
let contour = trajectoryBody.Contour2D;
contour.Clear();
contour.AddRectangle(0, 0, width, height);

// Редактирование траектории
let trajectory = trajectoryBody.Trajectory2D;
trajectory.Clear();
trajectory.AddCircle(0, 0, radius);