// Пример выбора и установки фурнитуры.

/**
 * Установка обычной фурнитуры
 * @param {TFurnitureInfo} info 
 */
function MountFastener(info) {
    /**@type {MountParams} */
    const params = {};
    params.panel1 = interaction.getRequest.GetObject('Укажите панель 1', objectTypeChecker.ObjectTypeValue.panel);
    params.panel2 = interaction.getRequest.GetObject('Укажите панель 2', objectTypeChecker.ObjectTypeValue.panel);
    params.position = interaction.getRequest.GetVector('Укажите положение фурнитуры');
    fastenerOperations.MountFurniture(info, params);
}

/**
 * Установка схемы крепежа
 * @param {TFurnitureInfo} info 
 */
function MountScheme(info) {
    /**@type {MountParams} */
    const params = {};
    params.panel1 = interaction.getRequest.GetObject('Укажите панель 1', objectTypeChecker.ObjectTypeValue.panel);
    params.panel2 = interaction.getRequest.GetObject('Укажите панель 2', objectTypeChecker.ObjectTypeValue.panel);
    params.basePlane = fastenerOperations.basePlaneMount.inside;
    fastenerOperations.MountFurniture(info, params);
}

/**
 * Установка секции
 * @param {TFurnitureInfo} info 
 */
function MountBox(info) {
    /**@type {MountParams} */
    const params = {};
    const limits = objects3d.NewLimits();
    const position = interaction.getRequest.GetVector('Укажите положение секции');
    limits.Position = position;
    interaction.windowData.SetPointAnchoring(true);
    // Установка обработчика движения мыши для изменения размеров габаритной рамки,
    // описывающей будущий размер секции.
    interaction.events.SetMouseMoveHandler(() => {
        let newPoint = interaction.windowData.GetPoint3D();
        limits.LimitSize = geometry3d.VectorSub(newPoint, position);
        limits.Build()
    })
    const secondPos = interaction.getRequest.GetVector('Укажите положение противоположного угла секции');
    // Сброс обработчика движения мыши
    interaction.events.SetMouseMoveHandler(undefined);
    const size = geometry3d.VectorSub(secondPos, position);
    // Проверка всех координат во избежание некорректной установки.
    // Размер по каждой оси должен иметь положительное значение.
    ['x', 'y', 'z'].forEach(key => {
        if (size[key] < 0) {
            size[key] = Math.abs(size[key]);
            position[key] -= size[key];
        }
    });
    params.boxSize = size;
    objects3d.DeleteObject(limits);
    const box = fastenerOperations.MountFurniture(info, params);
    box.Position = position;
}

const furnInfo = fastenerOperations.CreateFurnitureInfo();
if (fastenerOperations.ChooseFurnitureInfo(furnInfo,
    fastenerOperations.PARAM_FASTENER_FILTER_ALL, fastenerOperations.DATUM_MODE_FILTER_ALL)) {
    const datumMode = furnInfo.FindDatumMode();
    switch (datumMode) {
        case fastenerOperations.datumMode.faceButt:
        case fastenerOperations.datumMode.faceEdge:
        case fastenerOperations.datumMode.faceFace:
        case fastenerOperations.datumMode.parallelFaces:
            MountFastener(furnInfo);
            break;
        case fastenerOperations.datumMode.joint:
            MountScheme(furnInfo);
            break;
        case fastenerOperations.datumMode.box:
            MountBox(furnInfo);
            break;
    }
}