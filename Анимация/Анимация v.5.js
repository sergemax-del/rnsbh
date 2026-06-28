    Panel = AddFrontPanel(0, 0, 100, 100, 10); // Создание панели
    FacadeAssembly = AddAssembly('Assembly'); // Создание сборки
    Panel.Owner = FacadeAssembly; // Добавление панели в сборку

    FacadeAssembly.AnimType = AnimationType.DoorLift; // Тип анимации сборки
    /*
    DoorLeft - дверь левая
    DoorRight - дверь правая
    DoorFlap - дверь откидная
    DoorLift - дверь подъемная
    SDoorLeft - дверь купе левая
    SDoorRight - дверь купе правая
    Drawer - ящик
    Support - опора
    Handle - ручка
    Facade - фасад
    */
    FacadeAssembly.AnimationType = 1; // Вид анимации (0 - нет, 1 - поворот, 2 - сдвиг)
    FacadeAssembly.DoorAngle = 78; // Угол открывания сборки, град
    FacadeAssembly.DoorShift = 100; // Смещение сборки перпендикуляр оси анимации, мм
    anim = FacadeAssembly.Animation; // Присвоение 'anim' свойств анимации сборке
    // Устанавливка оси анимации как вектора с начальной и конечной точкой -----
    anim.AxisStart = {x: 0, y: 0, z: 0}; // Точка начала вектора (0, 0, 0)
    anim.AxisEnd = {x: 0, y: 100, z: 0}; // Точка конца вектора (0, 100, 0)
    // -------------------------------------------------------------------------
    anim.Duration = 0.5; // Длительность анимации, с