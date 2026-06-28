/**
 * ЭТАП 1: Создание профилей-шестигранников для ВСЕХ отверстий в модели
 * ИСПРАВЛЕНО: Сечение — правильный шестигранник, вершины на окружности радиуса R
 */
var createdProfiles = {};
var profileNameCounter = 0;
var totalPanelsProcessed = 0;
var totalFastenersProcessed = 0;
var _profileFastenerMap = [];

// Вспомогательная функция: добавляет правильный шестигранник в контур
// Вершины лежат на окружности радиуса radius (описанная окружность)
// Ориентация: плоская грань сверху/снизу (стандарт для крепежа)
// Вспомогательная функция: добавляет правильный 8-угольник в контур
// Вершины лежат на окружности радиуса radius (описанная окружность)
// Ориентация: плоская грань сверху/снизу
function AddOctagon(contour, centerX, centerY, radius) {
	var startAngle = -Math.PI / 8; // -22.5°: первая грань горизонтальна
	for (var i = 0; i < 8; i++) {
		var angle1 = startAngle + i * Math.PI / 4;
		var angle2 = startAngle + ((i + 1) % 8) * Math.PI / 4;
		var x1 = centerX + radius * Math.cos(angle1);
		var y1 = centerY + radius * Math.sin(angle1);
		var x2 = centerX + radius * Math.cos(angle2);
		var y2 = centerY + radius * Math.sin(angle2);
		contour.AddLine(x1, y1, x2, y2);
	}
}

function isComposite(obj) {
	if (!obj) return false;
	try {
		var typeName = obj.ClassName || "";
		return (typeName.indexOf("FurnBlock") !== -1 ||
			typeName.indexOf("Layer3D") !== -1 ||
			typeName.indexOf("FurnAsm") !== -1 ||
			typeName.indexOf("DraftBlock") !== -1 ||
			(obj.Objects && obj.Count !== undefined && !obj.FindConnectedFasteners));
	} catch (e) {return false;}
}

function isPanel(obj) {
	if (!obj) return false;
	try {
		return (obj.FindConnectedFasteners && typeof obj.FindConnectedFasteners === 'function');
	} catch (e) {return false;}
}

function ParseHoleName(name) {
	var result = {diameter: 0, depth: null};
	if (!name) return result;
	try {
		var cleanName = name.toString().replace(/\s/g, '');
		var matchBlind = cleanName.match(/^([\d.,]+)[xX×*]([\d.,]+)$/);
		if (matchBlind) {
			result.diameter = parseFloat(matchBlind[1].replace(',', '.'));
			result.depth = parseFloat(matchBlind[2].replace(',', '.'));
		} else {
			var diameter = parseFloat(cleanName.replace(',', '.'));
			if (!isNaN(diameter) && diameter > 0) {
				result.diameter = diameter;
				result.depth = null;
			}
		}
	} catch (e) {}
	return result;
}

function CreateProfileForHole(hole, fastener, panel, holeIndex, fastIndex, panelPath) {
	try {
		if (!hole || !fastener || !panel) return null;

		var globalStart = fastener.ToGlobal(hole.Position);
		var globalEnd = fastener.ToGlobal(hole.EndPosition());
		if (!globalStart || !globalEnd) return null;

		var pId = (panel.Id !== undefined) ? panel.Id : (panel.Name || "P0");
		var fId = (fastener.Id !== undefined) ? fastener.Id : (fastener.Name || "F0");
		var holeKey = "P_" + pId + "_F_" + fId + "_H_" + holeIndex + "_" +
			Math.round(globalStart.x) + "_" + Math.round(globalStart.y) + "_" + Math.round(globalStart.z);

		if (createdProfiles[holeKey]) {
			return {success: true, name: createdProfiles[holeKey], skipped: true};
		}

		var dirVec = {
			x: globalEnd.x - globalStart.x,
			y: globalEnd.y - globalStart.y,
			z: globalEnd.z - globalStart.z
		};
		var depth = Math.sqrt(dirVec.x * dirVec.x + dirVec.y * dirVec.y + dirVec.z * dirVec.z);
		if (depth < 0.1) return null;

		var dir_z = {x: dirVec.x / depth, y: dirVec.y / depth, z: dirVec.z / depth};

		var holeName = hole.Name || ("Hole_" + fastIndex + "_" + holeIndex);
		var holeParams = ParseHoleName(holeName);
		var diameter = holeParams.diameter > 0 ? holeParams.diameter : (hole.Diameter || 5);
		var radius = diameter / 2;

		profileNameCounter++;
		var targetName = "Profile_" + holeName + "_" + profileNameCounter;

		var extr = AddExtrusion(targetName);
		if (!extr) return null;

		try {extr.Name = targetName;} catch (e) {}

		// ЗАМЕНА: octagon вместо круга (вершины на окружности радиуса radius)
		AddOctagon(extr.Contour, 0, 0, radius);

		extr.PositionX = globalStart.x;
		extr.PositionY = globalStart.y;
		extr.PositionZ = globalStart.z;
		extr.Thickness = depth;

		var dir_y = {x: 0, y: 1, z: 0};
		if (Math.abs(dir_z.y) > 0.99) dir_y = {x: 1, y: 0, z: 0};

		var dot = dir_y.x * dir_z.x + dir_y.y * dir_z.y + dir_y.z * dir_z.z;
		dir_y = {
			x: dir_y.x - dot * dir_z.x,
			y: dir_y.y - dot * dir_z.y,
			z: dir_y.z - dot * dir_z.z
		};
		var lenY = Math.sqrt(dir_y.x * dir_y.x + dir_y.y * dir_y.y + dir_y.z * dir_y.z);
		if (lenY > 0.001) {
			dir_y = {x: dir_y.x / lenY, y: dir_y.y / lenY, z: dir_y.z / lenY};
		} else {
			dir_y = {x: 1, y: 0, z: 0};
		}

		extr.Orient(dir_z, dir_y);
		extr.MaterialName = fastener.Name || "Фурнитура";

		// Перемещение в Model
		try {
			if (Model && Model.Owner && extr.Owner) {
				if (extr.Owner !== Model.Owner) {
					extr.ReTransform(extr.Owner, Model.Owner);
				}
				extr.Owner = Model.Owner;
			}
		} catch (e) {}

		extr.Build();
		try {extr.Name = targetName;} catch (e) {}

		createdProfiles[holeKey] = targetName;
		_profileFastenerMap.push({profile: extr, fastener: fastener});

		return {
			success: true,
			name: targetName,
			diameter: diameter,
			depth: depth,
			start: globalStart,
			end: globalEnd
		};

	} catch (e) {
		return null;
	}
}

function ProcessPanel(panel, panelPath, allResults) {
	if (!panel || !panel.FindConnectedFasteners) return;

	totalPanelsProcessed++;
	var fasts = [];
	try {fasts = panel.FindConnectedFasteners();} catch (e) {return;}
	if (!fasts || fasts.length === 0) return;

	var localProcessed = 0;
	var localSkipped = 0;

	for (var i = 0; i < fasts.length; ++i) {
		var fast = fasts[i];
		if (!fast || !fast.Holes) continue;

		totalFastenersProcessed++;

		for (var r = 0; r < fast.Holes.Count; ++r) {
			var hole = fast.Holes[r];
			if (!hole) continue;

			var result = CreateProfileForHole(hole, fast, panel, r, i, panelPath);

			if (result && result.skipped) {
				localSkipped++;
			} else if (result) {
				allResults.results.push({
					name: hole.Name || ("Hole_" + i + "_" + r),
					panel: panel.Name || panelPath,
					panelPath: panelPath,
					fastIndex: i,
					holeIndex: r,
					result: result
				});
			}
			localProcessed++;
		}
	}

	if (localProcessed > 0 || localSkipped > 0) {
		allResults.report.push("Панель: " + panelPath + " | Отверстий: " + localProcessed +
			(localSkipped > 0 ? " (пропущено: " + localSkipped + ")" : ""));
	}

	allResults.processed += localProcessed;
	allResults.skipped += localSkipped;
}

function ProcessModelHierarchy(obj, parentPath, allResults) {
	if (!obj) return;

	if (isPanel(obj)) {
		var panelPath = (parentPath ? parentPath + "/" : "") + (obj.Name || "Panel");
		ProcessPanel(obj, panelPath, allResults);
		return;
	}

	if (isComposite(obj) && obj.Objects && obj.Count) {
		for (var i = 0; i < obj.Count; i++) {
			var child = obj.Objects[i];
			var childPath = (parentPath ? parentPath + "/" : "") + (obj.Name || "Block_" + i);
			ProcessModelHierarchy(child, childPath, allResults);
		}
	}
}

function GroupProfilesIntoAssemblies() {
	var fastenerGroups = {};
	for (var i = 0; i < _profileFastenerMap.length; i++) {
		var item = _profileFastenerMap[i];
		if (!item || !item.fastener || !item.profile) continue;

		var f = item.fastener;
		var p = item.profile;
		var fKey = (f.Id !== undefined) ? "ID_" + f.Id : ("REF_" + f.Name + "_" + i);

		if (!fastenerGroups[fKey]) {
			fastenerGroups[fKey] = {fastener: f, profiles: []};
		}
		fastenerGroups[fKey].profiles.push(p);
	}

	var asmCount = 0;

	for (var key in fastenerGroups) {
		if (!fastenerGroups.hasOwnProperty(key)) continue;

		var group = fastenerGroups[key];
		var fast = group.fastener;
		var profiles = group.profiles;

		if (!fast) continue;

		try {
			var origOwner = fast.Owner || Model;
			var asmName = fast.Name || ("Сборка_" + key);

			var asm = AddAssembly(asmName);
			if (!asm) continue;

			try {asm.ArtPos = fast.ArtPos || 0;} catch (e) {}

			// Перемещение сборки
			if (asm.Owner && origOwner && asm.Owner !== origOwner) {
				try {
					asm.ReTransform(asm.Owner, origOwner);
					asm.Owner = origOwner;
				} catch (e) {}
			}

			// Перемещение профилей
			for (var j = 0; j < profiles.length; j++) {
				var prof = profiles[j];
				if (!prof || !prof.Owner) continue;

				try {
					var oldOwner = prof.Owner;
					if (oldOwner !== asm) {
						prof.ReTransform(oldOwner, asm);
						prof.Owner = asm;
					}
				} catch (e) {}
			}

			// Перемещение фурнитуры
			if (fast.Owner && fast.Owner !== asm) {
				try {
					fast.ReTransform(fast.Owner, asm);
					fast.Owner = asm;
				} catch (e) {}
			}

			asmCount++;
		} catch (e) {}
	}
	return asmCount;
}

// === ГЛАВНАЯ ФУНКЦИЯ ===
function CreateProfilesForAllHoles() {
	if (typeof Model === 'undefined') {
		console.log('Model не найден');
		if (typeof Action !== 'undefined') Action.Finish();
		return;
	}

	try {
		// Начинаем транзакцию отмены
		if (typeof Undo !== 'undefined') {
			Undo.RecursiveChanging(Model);
		}
	} catch (e) {}

	createdProfiles = {};
	profileNameCounter = 0;
	totalPanelsProcessed = 0;
	totalFastenersProcessed = 0;
	_profileFastenerMap = [];

	var allResults = {results: [], processed: 0, skipped: 0, report: []};

	// ЭТАП 1: Генерация профилей
	try {
		ProcessModelHierarchy(Model, "", allResults);
	} catch (e) {
		console.log('Ошибка при создании профилей: ' + e.message);
	}

	// ЭТАП 2: Группировка в сборки
	var assembliesCreated = 0;
	try {
		assembliesCreated = GroupProfilesIntoAssemblies();
	} catch (e) {
		console.log('Ошибка при группировке: ' + e.message);
	}

	// Фиксируем изменения
	try {
		if (typeof Action !== 'undefined') {
			Action.Commit();
		}
	} catch (e) {}

	// Вывод результатов
	var msg = '=== ОБРАБОТКА ЗАВЕРШЕНА ===\n';
	msg += 'Панелей обработано: ' + totalPanelsProcessed + '\n';
	msg += 'Элементов крепежа: ' + totalFastenersProcessed + '\n';
	msg += 'Создано профилей: ' + allResults.results.length + '\n';
	msg += 'Пропущено (дубли): ' + allResults.skipped + '\n';
	msg += 'Создано сборок: ' + assembliesCreated + '\n';

	console.log(msg);

	// Завершаем действие
	try {
		if (typeof Action !== 'undefined') {
			Action.Finish();
		}
	} catch (e) {}
}

// === ЗАПУСК ===
try {
	CreateProfilesForAllHoles();
} catch (e) {
	console.log('Критическая ошибка: ' + e.message);
	try {
		if (typeof Action !== 'undefined') {
			Action.Finish();
		}
	} catch (e2) {}
}