let holeInfo = {
                      hole_name: `${hole.Diameter}x${hole.Depth}`,
                      side: "",
                      depth: hole.Depth,
                      diameter: hole.Diameter,
                      pos: []
                  };
// Переводим центр отверстия в локальные координаты панели
let globalHoleCenter = fasts[i].ToGlobal(hole.Position);
let localHoleCenter = panel.ToObject(globalHoleCenter);

holeInfo['pos'] = [localHoleCenter.x, localHoleCenter.y];

// Переводим направление отверстия в локальную систему
let globalHoleDirection = fasts[i].NToGlobal(hole.Direction);
let localHoleDirection = panel.NToObject(globalHoleDirection);
