(function () {
	"use strict";

	apiVersion.AwareAndThrowIfApiVersionIsLowestThan(2);

	/**
	 * Скрипт для задания положения и ориентации выделенного объекта.
	 * v5: Исправлена работа Enter в полях ввода (OnKeyPress + ReferenceObject<string>/number).
	 */

	/**
 * Сокращает имя объекта для записи в историю изменений.
 * Оставляет артикул (если есть) и первые слова названия.
 */
	function shortenNameForHistory(fullName, maxLen = 35) {
		if (!fullName || fullName.length <= maxLen) return fullName;

		// Пытаемся разделить имя и артикул (разделитель \r или пробел в начале)
		const parts = fullName.split(/\r|\n/);
		const name = parts[0] || fullName;
		const article = parts[1] || '';

		// Если есть артикул — используем его + часть названия
		if (article && article.length < 15) {
			const remaining = maxLen - article.length - 5;
			if (name.length > remaining) {
				return `"${ name.substring(0, remaining) }..." (${ article })`;
			}
			return `"${ name }" (${ article })`;
		}

		// Иначе просто сокращаем до maxLen
		return `"${ name.substring(0, maxLen - 3) }..."`;
	}


	// ---------------- math utils ----------------
	const EPS = 1e-12;
	const G_AXIS_X = {x: 1, y: 0, z: 0};
	const G_AXIS_Y = {x: 0, y: 1, z: 0};
	const G_AXIS_Z = {x: 0, y: 0, z: 1};

	function normalizeVec(v) {
		const n = Math.hypot(v.x, v.y, v.z) || 1;
		return {x: v.x / n, y: v.y / n, z: v.z / n};
	}
	function cross(a, b) {
		return {
			x: a.y * b.z - a.z * b.y,
			y: a.z * b.x - a.x * b.z,
			z: a.x * b.y - a.y * b.x
		};
	}
	function dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	function quatFromEulerZYX(degX, degY, degZ) {
		const RAD = Math.PI / 180;
		const hx = 0.5 * degX * RAD, hy = 0.5 * degY * RAD, hz = 0.5 * degZ * RAD;
		const cx = Math.cos(hx), sx = Math.sin(hx);
		const cy = Math.cos(hy), sy = Math.sin(hy);
		const cz = Math.cos(hz), sz = Math.sin(hz);
		return {
			w: cz * cy * cx + sz * sy * sx,
			x: cz * cy * sx - sz * sy * cx,
			y: cz * sy * cx + sz * cy * sx,
			z: sz * cy * cx - cz * sy * sx
		};
	}

	function quatFromAxisAngle(axis, angleDeg) {
		const halfRad = (angleDeg * Math.PI / 180) / 2;
		const s = Math.sin(halfRad);
		const n = normalizeVec(axis);
		return {
			w: Math.cos(halfRad),
			x: n.x * s,
			y: n.y * s,
			z: n.z * s
		};
	}

	function multiplyQuaternions(q1, q2) {
		return {
			w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
			x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
			y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
			z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
		};
	}

	function normalizeQuat(q) {
		const n = Math.hypot(q.w, q.x, q.y, q.z) || 1;
		return {w: q.w / n, x: q.x / n, y: q.y / n, z: q.z / n};
	}

	function axesFromQuat(q) {
		q = normalizeQuat(q);
		const {w, x, y, z} = q;
		const r00 = 1 - 2 * (y * y + z * z);
		const r01 = 2 * (x * y - z * w);
		const r02 = 2 * (x * z + y * w);
		const r10 = 2 * (x * y + z * w);
		const r11 = 1 - 2 * (x * x + z * z);
		const r12 = 2 * (y * z - x * w);
		const r20 = 2 * (x * z - y * w);
		const r21 = 2 * (y * z + x * w);
		const r22 = 1 - 2 * (x * x + y * y);

		let axisZ = normalizeVec({x: r02, y: r12, z: r22});
		let axisY = {x: r01, y: r11, z: r21};

		let c = cross(axisY, axisZ);
		let cLen = Math.hypot(c.x, c.y, c.z);
		if (cLen < EPS) {
			axisY = Math.abs(axisZ.z) < 0.99 ? cross(G_AXIS_Z, axisZ) : cross(G_AXIS_X, axisZ);
		}

		let axisX = normalizeVec(cross(axisY, axisZ));
		axisY = normalizeVec(cross(axisZ, axisX));

		let det = dot(axisX, cross(axisY, axisZ));
		if (det < 0) {
			axisY = {x: -axisY.x, y: -axisY.y, z: -axisY.z};
			axisX = normalizeVec(cross(axisY, axisZ));
		}

		return {axisZ, axisY};
	}

	function roundIfClose(value, precision = 1e-12) {
		const rounded = Math.round(value);
		return (Math.abs(value - rounded) < precision) ? rounded : value;
	}

	function normalizeAngle(angle) {
		angle = angle % 360;
		if (angle > 180) angle -= 360;
		if (angle <= -180) angle += 360;
		return roundIfClose(angle);
	}

	function getObjectAnglesUsingQuaternions(transformation) {
		const quaternion = transformation.Rotation;
		const qx = quaternion.ImagPart.x;
		const qy = quaternion.ImagPart.y;
		const qz = quaternion.ImagPart.z;
		const qw = quaternion.RealPart;

		const sinr_cosp = 2 * (qw * qx + qy * qz);
		const cosr_cosp = 1 - 2 * (qx * qx + qy * qy);
		const x = Math.atan2(sinr_cosp, cosr_cosp);

		const sinp = 2 * (qw * qy - qz * qx);
		let y;
		if (Math.abs(sinp) >= 1) {
			y = Math.sign(sinp) * Math.PI / 2;
		} else {
			y = Math.asin(sinp);
		}

		const siny_cosp = 2 * (qw * qz + qx * qy);
		const cosy_cosp = 1 - 2 * (qy * qy + qz * qz);
		const z = Math.atan2(siny_cosp, cosy_cosp);

		const toDegrees = 180 / Math.PI;
		return {
			x: normalizeAngle(x * toDegrees),
			y: normalizeAngle(y * toDegrees),
			z: normalizeAngle(z * toDegrees)
		};
	}

	function calculateOrientationVectors(angleX, angleY, angleZ) {
		const q = quatFromEulerZYX(angleX, angleY, angleZ);
		const {axisZ, axisY} = axesFromQuat(q);
		return {axis1: axisZ, axis2: axisY};
	}

	// ---------------- Работа с моделью ----------------
	const model = currentFileData.model;

	const selectionCount = model.SelectionCount;
	if (selectionCount === 0) {
		UI.dialogs.MessageBox("Нет выделенных объектов.\nВыделите объект для работы скрипта.");
		execution.FinishExecution();
	}

	const selectedObject = model.Selections[0];

	// ---------------- UI ----------------
	CreateUserInterface();

	function CreateUserInterface() {
		const MainForm = UI.components.NewForm();
		MainForm.Caption = `Положение и ориентация: "${ selectedObject.Name }"`;
		MainForm.Width = 250;
		MainForm.Height = 415;
		MainForm.Position = UI.constants.formPosition.designed;
		MainForm.BorderStyle = UI.constants.formBorderStyle.toolWindow;

		const currentAngles = getObjectAnglesUsingQuaternions(selectedObject.Transformation);
		const currentPos = selectedObject.Position;

		// ========= Группа "Положение" =========
		const grpPosition = UI.components.NewGroupBox(MainForm, MainForm);
		grpPosition.Caption = "Положение (X, Y, Z):";
		grpPosition.Left = 5;
		grpPosition.Top = 5;
		grpPosition.Width = 225;
		grpPosition.Height = 115;

		const lblPX = UI.components.NewLabel(grpPosition, grpPosition);
		lblPX.Caption = "X:";
		lblPX.Left = 10; lblPX.Top = 22; lblPX.Width = 15;

		const editPX = UI.components.NewTextEdit(grpPosition, grpPosition);
		editPX.Text = roundIfClose(currentPos.x).toString();
		editPX.Left = 28; editPX.Top = 20; editPX.Width = 70;

		const lblPY = UI.components.NewLabel(grpPosition, grpPosition);
		lblPY.Caption = "Y:";
		lblPY.Left = 105; lblPY.Top = 22; lblPY.Width = 15;

		const editPY = UI.components.NewTextEdit(grpPosition, grpPosition);
		editPY.Text = roundIfClose(currentPos.y).toString();
		editPY.Left = 123; editPY.Top = 20; editPY.Width = 70;

		const lblPZ = UI.components.NewLabel(grpPosition, grpPosition);
		lblPZ.Caption = "Z:";
		lblPZ.Left = 10; lblPZ.Top = 52; lblPZ.Width = 15;

		const editPZ = UI.components.NewTextEdit(grpPosition, grpPosition);
		editPZ.Text = roundIfClose(currentPos.z).toString();
		editPZ.Left = 28; editPZ.Top = 50; editPZ.Width = 70;

		const btnApplyPos = UI.components.NewButton(grpPosition, grpPosition);
		btnApplyPos.Caption = "Применить";
		btnApplyPos.Left = 105; btnApplyPos.Top = 49;
		btnApplyPos.Width = 108; btnApplyPos.Height = 24;
		btnApplyPos.Hint = "Применить введённые координаты к объекту";
		btnApplyPos.ShowHint = true;

		const btnResetPos = UI.components.NewButton(grpPosition, grpPosition);
		btnResetPos.Caption = "⟲ Сбросить в (0, 0, 0)";
		btnResetPos.Left = 10; btnResetPos.Top = 82;
		btnResetPos.Width = 203; btnResetPos.Height = 24;
		btnResetPos.Hint = "Обнулить координаты объекта (поворот не затрагивается)";
		btnResetPos.ShowHint = true;

		// ========= Группа "Углы" =========
		const grpAngles = UI.components.NewGroupBox(MainForm, MainForm);
		grpAngles.Caption = "Углы поворота:";
		grpAngles.Left = 5;
		grpAngles.Top = 125;
		grpAngles.Width = 225;
		grpAngles.Height = 115;

		const labelX = UI.components.NewLabel(grpAngles, grpAngles);
		labelX.Caption = "X:";
		labelX.Left = 10; labelX.Top = 22; labelX.Width = 15;

		const editX = UI.components.NewTextEdit(grpAngles, grpAngles);
		editX.Text = currentAngles.x.toString();
		editX.Left = 28; editX.Top = 20; editX.Width = 70;

		const btnXPlus = UI.components.NewButton(grpAngles, grpAngles);
		btnXPlus.Caption = "+90°";
		btnXPlus.Left = 105; btnXPlus.Top = 19;
		btnXPlus.Width = 50; btnXPlus.Height = 24;

		const btnXMinus = UI.components.NewButton(grpAngles, grpAngles);
		btnXMinus.Caption = "−90°";
		btnXMinus.Left = 160; btnXMinus.Top = 19;
		btnXMinus.Width = 50; btnXMinus.Height = 24;

		const labelY = UI.components.NewLabel(grpAngles, grpAngles);
		labelY.Caption = "Y:";
		labelY.Left = 10; labelY.Top = 52; labelY.Width = 15;

		const editY = UI.components.NewTextEdit(grpAngles, grpAngles);
		editY.Text = currentAngles.y.toString();
		editY.Left = 28; editY.Top = 50; editY.Width = 70;

		const btnYPlus = UI.components.NewButton(grpAngles, grpAngles);
		btnYPlus.Caption = "+90°";
		btnYPlus.Left = 105; btnYPlus.Top = 49;
		btnYPlus.Width = 50; btnYPlus.Height = 24;

		const btnYMinus = UI.components.NewButton(grpAngles, grpAngles);
		btnYMinus.Caption = "−90°";
		btnYMinus.Left = 160; btnYMinus.Top = 49;
		btnYMinus.Width = 50; btnYMinus.Height = 24;

		const labelZ = UI.components.NewLabel(grpAngles, grpAngles);
		labelZ.Caption = "Z:";
		labelZ.Left = 10; labelZ.Top = 82; labelZ.Width = 15;

		const editZ = UI.components.NewTextEdit(grpAngles, grpAngles);
		editZ.Text = currentAngles.z.toString();
		editZ.Left = 28; editZ.Top = 80; editZ.Width = 70;

		const btnZPlus = UI.components.NewButton(grpAngles, grpAngles);
		btnZPlus.Caption = "+90°";
		btnZPlus.Left = 105; btnZPlus.Top = 79;
		btnZPlus.Width = 50; btnZPlus.Height = 24;

		const btnZMinus = UI.components.NewButton(grpAngles, grpAngles);
		btnZMinus.Caption = "−90°";
		btnZMinus.Left = 160; btnZMinus.Top = 79;
		btnZMinus.Width = 50; btnZMinus.Height = 24;

		// ========= Основные кнопки =========
		const btnApplyAngles = UI.components.NewButton(MainForm, MainForm);
		btnApplyAngles.Caption = "✔ Задать ориентацию";
		btnApplyAngles.Left = 5; btnApplyAngles.Top = 245;
		btnApplyAngles.Width = 225; btnApplyAngles.Height = 28;

		const btnResetAngles = UI.components.NewButton(MainForm, MainForm);
		btnResetAngles.Caption = "⟲ Сбросить ориентацию (0°/0°/0°)";
		btnResetAngles.Left = 5; btnResetAngles.Top = 278;
		btnResetAngles.Width = 225; btnResetAngles.Height = 28;
		btnResetAngles.Hint = "Сбросить повороты, не трогая координаты объекта";
		btnResetAngles.ShowHint = true;

		const btnResetAll = UI.components.NewButton(MainForm, MainForm);
		btnResetAll.Caption = "⟲ Сбросить всё";
		btnResetAll.Left = 5; btnResetAll.Top = 311;
		btnResetAll.Width = 225; btnResetAll.Height = 28;
		btnResetAll.Hint = "Полный сброс: координаты и углы обнуляются";
		btnResetAll.ShowHint = true;

		const btnCancel = UI.components.NewButton(MainForm, MainForm);
		btnCancel.Caption = "Закрыть";
		btnCancel.Left = 5; btnCancel.Top = 344;
		btnCancel.Width = 225; btnCancel.Height = 28;

		// ========= Вспомогательные функции =========

		const parseLocalizedFloat = (str) => parseFloat(String(str).replace(',', '.'));

		function refreshPositionFields() {
			const p = selectedObject.Position;
			editPX.Text = roundIfClose(p.x).toString();
			editPY.Text = roundIfClose(p.y).toString();
			editPZ.Text = roundIfClose(p.z).toString();
		}

		function refreshAngleFields() {
			const a = getObjectAnglesUsingQuaternions(selectedObject.Transformation);
			editX.Text = a.x.toString();
			editY.Text = a.y.toString();
			editZ.Text = a.z.toString();
		}

		function applyPosition(x, y, z) {
			try {
				historyOperations.RegisterObjectChanging(selectedObject);
				selectedObject.Position = {x: x, y: y, z: z};
				selectedObject.Build();
				const shortName = shortenNameForHistory(selectedObject.Name);
				historyOperations.CommitCurrentChanges(
					`Положение ${ shortName }: X=${ roundIfClose(x) }, Y=${ roundIfClose(y) }, Z=${ roundIfClose(z) }`
				);
				refreshPositionFields();
			} catch (err) {
				UI.dialogs.MessageBox(
					`Ошибка при изменении положения:\n${ (err && err.message) || err }`
				);
			}
		}

		function applyAngles(x, y, z) {
			try {
				historyOperations.RegisterObjectChanging(selectedObject);
				const {axis1, axis2} = calculateOrientationVectors(x, y, z);
				selectedObject.Orient(axis1, axis2);
				selectedObject.Build();
				const shortName = shortenNameForHistory(selectedObject.Name);
				historyOperations.CommitCurrentChanges(
					`Ориентация "${ shortName }": X=${ roundIfClose(x) }°, Y=${ roundIfClose(y) }°, Z=${ roundIfClose(z) }°`
				);
				refreshAngleFields();
			} catch (err) {
				UI.dialogs.MessageBox(
					`Ошибка при изменении ориентации:\n${ (err && err.message) || err }`
				);
			}
		}

		function resetAngles() {
			try {
				historyOperations.RegisterObjectChanging(selectedObject);
				selectedObject.Orient(AxisZ, AxisY);
				selectedObject.Build();
				const shortName = shortenNameForHistory(selectedObject.Name);
				historyOperations.CommitCurrentChanges(
					`Сброс ориентации "${ shortName }" (углы обнулены, положение сохранено)`
				);
				editX.Text = "0";
				editY.Text = "0";
				editZ.Text = "0";
				refreshAngleFields();
			} catch (err) {
				UI.dialogs.MessageBox(
					`Ошибка при сбросе ориентации:\n${ (err && err.message) || err }`
				);
			}
		}

		function applyRelativeRotation(axisVec, angleDeg) {
			try {
				historyOperations.RegisterObjectChanging(selectedObject);

				const curQ = selectedObject.Transformation.Rotation;
				const curQuat = {
					w: curQ.RealPart,
					x: curQ.ImagPart.x,
					y: curQ.ImagPart.y,
					z: curQ.ImagPart.z
				};

				const deltaQ = quatFromAxisAngle(axisVec, angleDeg);
				const newQ = multiplyQuaternions(curQuat, deltaQ);

				const {axisZ, axisY} = axesFromQuat(newQ);
				selectedObject.Orient(axisZ, axisY);
				selectedObject.Build();
				const shortName = shortenNameForHistory(selectedObject.Name);
				historyOperations.CommitCurrentChanges(
					`Поворот "${ shortName }" на ${ angleDeg }° вокруг локальной оси`
				);

				refreshAngleFields();
			} catch (err) {
				UI.dialogs.MessageBox(
					`Ошибка при повороте:\n${ (err && err.message) || err }`
				);
			}
		}

		// ========= Отдельные функции применения из полей (для Enter и кнопок) =========
		function applyPositionFromFields() {
			const x = parseLocalizedFloat(editPX.Text);
			const y = parseLocalizedFloat(editPY.Text);
			const z = parseLocalizedFloat(editPZ.Text);
			if (isNaN(x) || isNaN(y) || isNaN(z)) {
				UI.dialogs.MessageBox("Введите корректные числовые значения координат.\n" +
					"Дробная часть отделяется точкой или запятой.");
				return;
			}
			applyPosition(x, y, z);
		}

		function applyAnglesFromFields() {
			const x = parseLocalizedFloat(editX.Text);
			const y = parseLocalizedFloat(editY.Text);
			const z = parseLocalizedFloat(editZ.Text);
			if (isNaN(x) || isNaN(y) || isNaN(z)) {
				UI.dialogs.MessageBox("Введите корректные числовые значения углов.\n" +
					"Дробная часть отделяется точкой или запятой.");
				return;
			}
			applyAngles(x, y, z);
		}

		// ========= Обработчики нажатия Enter (OnKeyPress!) =========
		// Сигнатура OnKeyPress: (sender, key), где key — ReferenceObject<number> (charCode).
		// Enter = 13. Присваиваем key.value = 0, чтобы "потребить" символ.

		const handleEnterPosition = function (sender, key) {
			if (key.value === 13) {
				key.value = 0;
				applyPositionFromFields();
			}
		};
		editPX.OnKeyPress = handleEnterPosition;
		editPY.OnKeyPress = handleEnterPosition;
		editPZ.OnKeyPress = handleEnterPosition;

		const handleEnterAngles = function (sender, key) {
			if (key.value === 13) {
				key.value = 0;
				applyAnglesFromFields();
			}
		};
		editX.OnKeyPress = handleEnterAngles;
		editY.OnKeyPress = handleEnterAngles;
		editZ.OnKeyPress = handleEnterAngles;

		// ========= Обработчики кнопок =========

		btnApplyPos.OnClick = function () {
			applyPositionFromFields();
		};

		btnResetPos.OnClick = function () {
			editPX.Text = "0";
			editPY.Text = "0";
			editPZ.Text = "0";
			applyPosition(0, 0, 0);
		};

		btnApplyAngles.OnClick = function () {
			applyAnglesFromFields();
		};

		btnResetAngles.OnClick = function () {
			resetAngles();
		};

		btnResetAll.OnClick = function () {
			editPX.Text = "0"; editPY.Text = "0"; editPZ.Text = "0";
			editX.Text = "0"; editY.Text = "0"; editZ.Text = "0";

			try {
				historyOperations.RegisterObjectChanging(selectedObject);
				selectedObject.Position = {x: 0, y: 0, z: 0};
				selectedObject.SetDefaultTransform();
				selectedObject.Build();
				const shortName = shortenNameForHistory(selectedObject.Name);
				historyOperations.CommitCurrentChanges(
					`Полный сброс "${ shortName }" (положение и ориентация)`
				);
				refreshPositionFields();
				refreshAngleFields();
			} catch (err) {
				UI.dialogs.MessageBox(
					`Ошибка при сбросе:\n${ (err && err.message) || err }`
				);
			}
		};

		btnXPlus.OnClick = function () {applyRelativeRotation(G_AXIS_X, +90);};
		btnXMinus.OnClick = function () {applyRelativeRotation(G_AXIS_X, -90);};
		btnYPlus.OnClick = function () {applyRelativeRotation(G_AXIS_Y, +90);};
		btnYMinus.OnClick = function () {applyRelativeRotation(G_AXIS_Y, -90);};
		btnZPlus.OnClick = function () {applyRelativeRotation(G_AXIS_Z, +90);};
		btnZMinus.OnClick = function () {applyRelativeRotation(G_AXIS_Z, -90);};

		btnCancel.OnClick = function () {MainForm.Close();};

		MainForm.OnClose = function (sender, action) {
			action.value = UI.constants.closeAction.free;
			execution.FinishExecution();
		};

		MainForm.Show();
		execution.ContinueExecution();
	}

})();