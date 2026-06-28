// Сканер для поиска свойств Action.Control, начинающихся на букву A
(function () {
	'use strict';

	var result = "=== СКАНЕР Action.Control.A* ===\n";
	result += "Время: " + new Date().toLocaleString() + "\n\n";

	// Проверяем доступность Action.Control
	if (!Action || !Action.Control) {
		result += "❌ Action.Control не доступен!\n";
		system.writeTextFile("Action_Control_A_scan.txt", result);
		alert("Action.Control не доступен!");
		return;
	}

	result += "✅ Action.Control доступен для сканирования\n\n";

	// Счетчики
	var totalProps = 0;
	var aProps = [];
	var otherProps = [];

	// Метод 1: Безопасный перебор с try-catch
	result += "=== МЕТОД 1: БЕЗОПАСНЫЙ ПЕРЕБОР ===\n";

	try {
		for (var prop in Action.Control) {
			totalProps++;

			// Проверяем, начинается ли свойство на 'A' (регистрозависимо)
			if (prop.charAt(0) === 'A' || prop.charAt(0) === 'a') {
				aProps.push(prop);

				try {
					var value = Action.Control[prop];
					var type = typeof value;
					result += "✅ A*: " + prop + " (" + type + ")\n";

					// Дополнительная информация
					if (type === 'function') {
						result += "   ↳ функция\n";
					} else if (type === 'object') {
						result += "   ↳ объект\n";
					} else if (type === 'number') {
						result += "   ↳ число: " + value + "\n";
					} else if (type === 'string') {
						result += "   ↳ строка: " + value.substring(0, 50) +
							(value.length > 50 ? "..." : "") + "\n";
					} else if (type === 'boolean') {
						result += "   ↳ булево: " + value + "\n";
					}

				} catch (e) {
					result += "✅ A*: " + prop + " [ошибка доступа: " + e.message + "]\n";
				}

			} else {
				otherProps.push(prop);
			}
		}

	} catch (e) {
		result += "❌ Ошибка при переборе: " + e.message + "\n";
	}

	// Метод 2: Прямая проверка конкретных свойств на A
	result += "\n=== МЕТОД 2: ПРЯМАЯ ПРОВЕРКА ===\n";

	// Создаем список возможных свойств, начинающихся на A
	var possibleAProps = [
		// Общие
		"Action", "Add", "Apply", "Append", "Attach", "Assign", "Activate",
		"Adjust", "Align", "Arrange", "Assemble", "Attach", "Auto", "Axis",
		"Angle", "Area", "Array", "Absolute", "Accumulate", "Accuracy",
		"Active", "Adapt", "Additive", "Address", "Affine", "Aggregate",
		"Algorithm", "Allocate", "Alpha", "Alternate", "Amplify", "Analog",
		"Analyze", "Anchor", "Animate", "Annotation", "Antialias", "Appearance",
		"Application", "Approximate", "Arc", "Area", "Arithmetic", "Arrange",
		"Array", "Arrow", "Ascending", "Aspect", "Assemble", "Assert",
		"Assign", "Associate", "Assume", "Asymmetric", "Attach", "Attribute",
		"Audio", "Auto", "Automatic", "Average", "Axis", "Azimuth",

		// Специфичные для БАЗИС
		"Assembly", "Animation", "Arc", "Angle", "Axis", "Align",
		"AddPanel", "AddObject", "AddMaterial", "AddFurniture",
		"ApplyMaterial", "ApplyTexture", "AutoArrange", "AutoScale",
		"AutoRotate", "AutoPosition", "AutoSize", "AutoAlign"
	];

	for (var i = 0; i < possibleAProps.length; i++) {
		var prop = possibleAProps[i];

		// Проверяем разные регистры
		var variations = [
			prop,
			prop.charAt(0).toUpperCase() + prop.slice(1).toLowerCase(),
			prop.toLowerCase(),
			prop.toUpperCase()
		];

		for (var v = 0; v < variations.length; v++) {
			var testProp = variations[v];
			if (Action.Control[testProp] !== undefined) {
				// Проверяем, не дублируем ли уже найденное свойство
				if (aProps.indexOf(testProp) === -1) {
					aProps.push(testProp);
					var type = typeof Action.Control[testProp];
					result += "✅ Найдено: " + testProp + " (" + type + ")\n";
				}
				break;
			}
		}
	}

	// Метод 3: Проверка по алфавиту (A-Z)
	result += "\n=== МЕТОД 3: ПРОВЕРКА ПО АЛФАВИТУ ===\n";

	// Проверяем все буквы алфавита
	for (var i = 0; i < 26; i++) {
		var letter = String.fromCharCode(65 + i); // A-Z
		var letterLower = String.fromCharCode(97 + i); // a-z

		// Создаем тестовые имена свойств
		var testNames = [
			letter + "Property",
			letter + "Value",
			letter + "Setting",
			letter + "Option",
			letter + "Config",
			letter + "Parameter",
			letterLower + "ttribute",
			letterLower + "djust"
		];

		for (var j = 0; j < testNames.length; j++) {
			if (Action.Control[testNames[j]] !== undefined) {
				if (aProps.indexOf(testNames[j]) === -1 &&
					(testNames[j].charAt(0) === 'A' || testNames[j].charAt(0) === 'a')) {
					aProps.push(testNames[j]);
					result += "✅ Алфавит: " + testNames[j] +
						" (" + typeof Action.Control[testNames[j]] + ")\n";
				}
			}
		}
	}

	// Итоги
	result += "\n=== ИТОГИ СКАНИРОВАНИЯ ===\n";
	result += "Всего свойств в Action.Control: " + totalProps + "\n";
	result += "Свойств, начинающихся на A: " + aProps.length + "\n";
	result += "Других свойств: " + otherProps.length + "\n\n";

	if (aProps.length > 0) {
		result += "=== НАЙДЕННЫЕ СВОЙСТВА НА 'A' ===\n";
		aProps.sort(); // Сортируем по алфавиту

		for (var i = 0; i < aProps.length; i++) {
			var prop = aProps[i];
			try {
				var value = Action.Control[prop];
				result += (i + 1) + ". " + prop + " = " +
					(typeof value === 'function' ? 'function' :
						typeof value === 'object' ? 'object' :
							String(value)) + "\n";
			} catch (e) {
				result += (i + 1) + ". " + prop + " [ошибка доступа]\n";
			}
		}

		// Тестируем найденные свойства
		result += "\n=== ТЕСТИРОВАНИЕ НАЙДЕННЫХ СВОЙСТВ ===\n";

		for (var i = 0; i < Math.min(5, aProps.length); i++) {
			var prop = aProps[i];
			result += "\nТест " + (i + 1) + ": " + prop + "\n";

			try {
				var value = Action.Control[prop];

				if (typeof value === 'function') {
					// Пробуем вызвать функцию
					try {
						value.call(Action.Control);
						result += "   ✓ Функция вызвана успешно\n";
					} catch (e) {
						result += "   ✗ Ошибка вызова: " + e.message + "\n";
					}
				} else if (typeof value === 'number') {
					// Пробуем изменить число
					var oldValue = value;
					Action.Control[prop] = oldValue + 1;
					if (Action.Control[prop] !== oldValue) {
						result += "   ✓ Значение изменено: " + oldValue + " → " + Action.Control[prop] + "\n";
						// Возвращаем
						Action.Control[prop] = oldValue;
					} else {
						result += "   ✗ Не удалось изменить\n";
					}
				}

			} catch (e) {
				result += "   ✗ Ошибка тестирования: " + e.message + "\n";
			}
		}

	} else {
		result += "❌ Свойств, начинающихся на 'A', не найдено\n";
	}

	// Сохраняем результат
	var filename = "Action_Control_A_properties.txt";
	try {
		system.writeTextFile(filename, result);
		alert("Сканирование завершено!\n\n" +
			"Найдено свойств на 'A': " + aProps.length + "\n" +
			"Файл: " + filename + "\n" +
			"Размер: " + result.length + " символов");
	} catch (e) {
		alert("Ошибка сохранения файла: " + e.message + "\n\n" +
			result.substring(0, 3000));
	}

})();