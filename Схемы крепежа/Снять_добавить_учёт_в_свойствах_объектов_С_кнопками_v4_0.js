function showCheckList() {
    const checklistForm = NewForm();
    checklistForm.Width = 260;
    checklistForm.Caption = "Изменить чекбоксы объектов";
    const props = checklistForm.Properties;

    const tasks = [
        { label: "Учитывать в документации", key: "UseInDocs" },
        { label: "Создавать сборочный чертеж", key: "MakeAsmDrawing" },
        { label: "Создавать схему сборки", key: "MakeExploidedView" },
        { label: "Учитывать в Базис - Смете", key: "UseInEstimate" },
        { label: "Учитывать в Базис - Раскрое", key: "UseInCutting" },
        { label: "Учитывать в Базис - ЧПУ", key: "UseInCNC" }
    ];

    const categories = [
        { label: "Блоки", key: "Blocks" },
        { label: "Панели", key: "Panels" },
        { label: "Фурнитура", key: "Furn" },
        { label: "Профили", key: "Profiles" },
        { label: "Полуфабрикаты", key: "Drafts" },
        { label: "Покупные изделия", key: "Asms" }
    ];

    let posY = 5;
    const checkboxHeight = 20;
    let checkboxes = {};

    // Общий чекбокс для всех свойств учета
    const selectAllTasks = props.NewBool('');
    selectAllTasks.SetLayout(5, posY, 16, checkboxHeight);
    selectAllTasks.OnChange = () => {
        tasks.forEach(task => {
            checkboxes[task.key].Value = selectAllTasks.Value;
        });
    };

    const selectAllTasksLabel = props.NewLabel("Выбрать все свойства учета");
    selectAllTasksLabel.SetLayout(30, posY, 220, checkboxHeight);

    posY += checkboxHeight;

    tasks.forEach(task => {
        const checkbox = props.NewBool('');
        checkbox.SetLayout(5, posY, 16, checkboxHeight);
        checkbox.OnChange = () => {
            if (!checkbox.Value) {
                selectAllTasks.Value = false;
            } else {
                if (tasks.every(task => checkboxes[task.key].Value)) {
                    selectAllTasks.Value = true;
                }
            }

            // Если устанавливаются "Создавать сборочный чертеж" или "Создавать схему сборки", "Учитывать в документации" также устанавливается в true
            if (task.key === 'MakeAsmDrawing' || task.key === 'MakeExploidedView') {
                if (checkbox.Value) {
                    checkboxes['UseInDocs'].Value = true;
                }
            }
        };
        checkboxes[task.key] = checkbox;

        const label = props.NewLabel(task.label);
        label.SetLayout(30, posY, 220, checkboxHeight);

        posY += checkboxHeight;
    });

    const separator1 = props.NewLabel("-------------------------------------------------------------------------------------");
    separator1.SetLayout(0, posY, 333, 22);
    posY += 22;

    // Общий чекбокс для всех категорий элементов
    const selectAllCategories = props.NewBool('');
    selectAllCategories.SetLayout(5, posY, 16, checkboxHeight);
    selectAllCategories.OnChange = () => {
        categories.forEach(category => {
            checkboxes[category.key].Value = selectAllCategories.Value;
        });
    };

    const selectAllCategoriesLabel = props.NewLabel("Выбрать все категории");
    selectAllCategoriesLabel.SetLayout(30, posY, 220, checkboxHeight);

    posY += checkboxHeight;

    categories.forEach(category => {
        const checkbox = props.NewBool('');
        checkbox.SetLayout(5, posY, 16, checkboxHeight);
        checkbox.OnChange = () => {
            if (!checkbox.Value) {
                selectAllCategories.Value = false;
            } else {
                if (categories.every(category => checkboxes[category.key].Value)) {
                    selectAllCategories.Value = true;
                }
            }
        };
        checkboxes[category.key] = checkbox;

        const label = props.NewLabel(category.label);
        label.SetLayout(30, posY, 220, checkboxHeight);

        posY += checkboxHeight;
    });

    const allButton = props.NewButton("Все");
    allButton.SetLayout(5, posY, 110, 20);
    allButton.OnClick = () => {
        applyChangesToAllObjects(checkboxes);
        checklistForm.Close();
        Action.Finish();
    };

    const selectedButton = props.NewButton("Выделенные");
    selectedButton.SetLayout(125, posY, 130, 20);
    selectedButton.OnClick = () => {
        if (Model.SelectionCount < 1) {
            const result = confirm('Нет выделенных объектов. Применить изменения ко всем объектам?');
            if (result) {
                applyChangesToAllObjects(checkboxes);
            } else {
                showCheckList(); // Повторный вызов формы
            }
        } else {
            applyChangesToSelectedObjects(checkboxes);
        }
        checklistForm.Close();
        Action.Finish();
    };

    checklistForm.OnClose = function() {
        Action.Finish();
    };

    checklistForm.Height = posY + 50;
    checklistForm.Show();
}

function applyChangesToSelectedObjects(checkboxes) {
    Undo.RecursiveChanging(Model);
    for (let i = 0; i < Model.SelectionCount; i++) {
        const obj = Model.Selections[i];
        applyChangesRecursively(obj, checkboxes);
    }
    Control.ActionOptions.UpdateContent(); // Обновление содержимого после изменений
}

function applyChangesToAllObjects(checkboxes) {
    Undo.RecursiveChanging(Model);
    Model.forEach(obj => {
        applyChangesRecursively(obj, checkboxes);
    });
    Control.ActionOptions.UpdateContent(); // Обновление содержимого после изменений
}

function applyChangesRecursively(obj, checkboxes) {
    if (shouldApplyChanges(obj, checkboxes)) {
        applyChanges(obj, checkboxes);
    }

    if (obj.Count) {
        for (let i = 0; i < obj.Count; i++) {
            applyChangesRecursively(obj[i], checkboxes);
        }
    }
}

function shouldApplyChanges(obj, checkboxes) {
    let isBlock = checkboxes['Blocks'].Value ? obj instanceof TFurnBlock : false;
    let isPanel = checkboxes['Panels'].Value ? obj instanceof TFurnPanel : false;
    let isFurn = checkboxes['Furn'].Value ? obj instanceof TFastener : false;
    let isProf = checkboxes['Profiles'].Value ? obj instanceof TExtrusionBody : false;
    let isDraft = checkboxes['Drafts'].Value ? obj instanceof TDraftBlock : false;
    let isAsm = checkboxes['Asms'].Value ? obj instanceof TFurnAsm : false;

    return isBlock || isPanel || isFurn || isProf || isDraft || isAsm;
}

function applyChanges(obj, checkboxes) {
    if (checkboxes['UseInDocs'].Value !== undefined) obj.UseInDocs = checkboxes['UseInDocs'].Value;
    if (checkboxes['MakeAsmDrawing'].Value !== undefined) obj.MakeAssemblyDrawing = checkboxes['MakeAsmDrawing'].Value;
    if (checkboxes['MakeExploidedView'].Value !== undefined) {
        if ('MakeExploidedView' in obj) {
            obj.MakeExploidedView = checkboxes['MakeExploidedView'].Value;
        } else if ('MakeExplodedView' in obj) {
            obj.MakeExplodedView = checkboxes['MakeExploidedView'].Value;
        }
    }
    if (checkboxes['UseInEstimate'].Value !== undefined) obj.UseInEstimate = checkboxes['UseInEstimate'].Value;
    if (checkboxes['UseInCutting'].Value !== undefined) obj.UseInCutting = checkboxes['UseInCutting'].Value;
    if (checkboxes['UseInCNC'].Value !== undefined) obj.UseInCNC = checkboxes['UseInCNC'].Value;

    // Если устанавливаются "Создавать сборочный чертеж" или "Создавать схему сборки", "Учитывать в документации" также устанавливается в true
    if (checkboxes['MakeAsmDrawing'].Value || checkboxes['MakeExploidedView'].Value) {
        obj.UseInDocs = true;
    }

    obj.Highlighted = true; // Подсветка изменённых объектов
}

showCheckList();
