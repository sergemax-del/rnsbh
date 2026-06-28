UnSelectAll();
Prop = Action.Properties;
Condition = Prop.NewCombo('Условие выделения', 'И (&&)\nИЛИ (||)');
switch (Condition.ItemIndex) {
    case 0:
        {
            UslAnd = true
            break;
        }
    case 1:
        {
            UslAnd = false
            break;
        }
}

var namesBlocks = [];
var namesBlockSB = [];
var namesBlockElastic = [];
var namesAssembly = [];
var value = '';
var Select = true;

function BlockToListOrSelect(obj) {
    sign = obj.Name;
    if (!Select) {
            if (obj instanceof TFurnBlock) {
                if ((namesBlocks.indexOf(sign) < 0) || (value = 'Все')) {
                    namesBlocks.push(sign);
                    }
            }
            if (((obj instanceof TFurnBlock) && (obj.IsAssemblyUnit)) || (value = 'Все')) {
                if (namesBlockSB.indexOf(sign) < 0) {
                    namesBlockSB.push(sign);
                    }
            }
            if (((obj instanceof TFurnBlock) && (obj.IsElastic(obj))) || (value = 'Все')) {
                if (namesBlockElastic.indexOf(sign) < 0) {
                    namesBlockElastic.push(sign);
                    }
            }
            if (obj instanceof TFurnAsm) {
                if ((namesAssembly.indexOf(sign) < 0) || (value = 'Все')) {
                    namesAssembly.push(sign);
                    }
            }
        }
         else {
            if ((sign == value) || (value == 'Все')) obj.Selected = true;
        }
        for (var i = 0; i < obj.Count; i++) {
            obj1 = obj.Objects[i];
            if (obj1 instanceof TFurnBlock) BlockToListOrSelect(obj1);
            if (obj1 instanceof TFurnAsm) BlockToListOrSelect(obj1);
        }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if ((obj instanceof TFurnBlock) ||
        (obj instanceof TFurnAsm))
    {
        Select = false;
        BlockToListOrSelect(obj);
    }
}

///////////////////////////////////
//Создание выпадающего списка и добавление туда имен блоков
SpNameBlocks = Prop.NewCombo('Имена блоков', '');
SpNameBlocksSB = Prop.NewCombo('Имена сборочных единиц', '');
SpNameBlocksElastic = Prop.NewCombo('Имена эластичных блоков', '');
SpNameAssembly = Prop.NewCombo('Имена сборок', '');
namesBlocks.sort();
namesBlockSB.sort();
namesBlockElastic.sort();
namesAssembly.sort();

SpNameBlocks.AddItem('');
if (namesBlocks.length > 1) {
    SpNameBlocks.AddItem('Все');
    for (var i = 0; i < namesBlocks.length; i++) {
        SpNameBlocks.AddItem(namesBlocks[i]);
    }
}

SpNameBlocksSB.AddItem('');
if (namesBlockSB.length > 1) {
    SpNameBlocksSB.AddItem('Все');
    for (var i = 0; i < namesBlockSB.length; i++) {
        SpNameBlocksSB.AddItem(namesBlockSB[i]);
    }
}

SpNameBlocksElastic.AddItem('');
if (namesBlockElastic.length > 1) {
    SpNameBlocksElastic.AddItem('Все');
    for (var i = 0; i < namesBlockElastic.length; i++) {
        SpNameBlocksElastic.AddItem(namesBlockElastic[i]);
    }
}

SpNameAssembly.AddItem('');
if (namesAssembly.length > 1) {
    SpNameAssembly.AddItem('Все');
    for (var i = 0; i < namesAssembly.length; i++) {
        SpNameAssembly.AddItem(namesAssembly[i]);
    }
}

SpNameBlocks.OnChange = function() {
    switch (Condition.ItemIndex) {
        case 0:
            {
                UslAnd = true
                break;
            }
        case 1:
            {
                UslAnd = false
                break;
            }
    }

    if (UslAnd) UnSelectAll();
    Select = true;
    value = SpNameBlocks.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if (obj instanceof TFurnBlock) BlockToListOrSelect(obj);
    }
};

SpNameBlocksSB.OnChange = function() {
    switch (Condition.ItemIndex) {
        case 0:
            {
                UslAnd = true
                break;
            }
        case 1:
            {
                UslAnd = false
                break;
            }
    }

    if (UslAnd) UnSelectAll();
    Select = true;
    value = SpNameBlocksSB.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if ((obj instanceof TFurnBlock) && (obj.IsAssemblyUnit)) BlockToListOrSelect(obj);
    }
};

SpNameBlocksElastic.OnChange = function() {
    switch (Condition.ItemIndex) {
        case 0:
            {
                UslAnd = true
                break;
            }
        case 1:
            {
                UslAnd = false
                break;
            }
    }

    if (UslAnd) UnSelectAll();
    Select = true;
    value = SpNameBlocksElastic.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if ((obj instanceof TFurnBlock) && (obj.IsElastic(obj))) BlockToListOrSelect(obj);
    }
};


SpNameAssembly.OnChange = function() {
    switch (Condition.ItemIndex) {
        case 0:
            {
                UslAnd = true
                break;
            }
        case 1:
            {
                UslAnd = false
                break;
            }
    }

    if (UslAnd) UnSelectAll();
    Select = true;
    value = SpNameAssembly.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if (obj instanceof TFurnAsm) BlockToListOrSelect(obj);
    }
};


Action.Continue();