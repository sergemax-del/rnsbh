// Пример математических операций над векторами без привязки к СК

const stringify = JSON.stringify;

// Создание вектора с помощью функции 
let axisX = geometry3d.VectorMake(1, 0, 0);
let axisY = geometry3d.VectorMake(0, 1, 0);
// Создание вектора с использованием константы
let axisZ = AxisZ;

console.log(`Сумма векторов X и Y = ${stringify(geometry3d.VectorAdd(axisX, axisY))}`);
console.log(`Разность векторов X и Y = ${stringify(geometry3d.VectorSub(axisX, axisY))}`);
console.log(`Вектор X умноженный на 3 = ${stringify(geometry3d.VectorMul(axisX, 3))}`);
console.log(`Коллинеарность (со-/противонаправленность) векторов X и Y = ${stringify(geometry3d.VectorsAreColinear(axisX, axisY))}`);
let zResult = geometry3d.VectorCross(axisX, axisY);
console.log(`Вектороное умножение векторов X и Y = ${stringify(zResult)}`);
console.log(`Оно равно оси Z? - ${geometry3d.VectorEqual(axisZ, zResult)}`);
console.log(`Скалярное умножение векторов X и Y = ${geometry3d.VectorDot(axisX, axisY)}`);
console.log(`Инвертированный вектор X = ${stringify(geometry3d.VectorInvert(axisX))}`);
let v = geometry3d.VectorMake(30, 40, 50);
console.log(`Исходный вектор = ${stringify(v)}`);
console.log(`Длина вектора = ${geometry3d.VectorLength(v)}`);
console.log(`Нормализованный вектор (сонаправленный вектор единичной длины) = ${stringify(geometry3d.VectorNormalize(v))}`);