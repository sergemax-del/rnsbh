UnSelectAll();
Prop = Action.Properties;
var namesMaterialPanel = [];

Model.forEachPanel(function(panel) {
        var sign = ExtractMatName(panel.MaterialName);
        if (namesMaterialPanel.indexOf(sign) < 0) {
            namesMaterialPanel.push(sign);
        }
    }
);

//Создание выпадающего списка и добавление туда имен материалов панелей
MaterialPanel = Prop.NewCombo('Имя материала', '');
MaterialPanel.AddItem('');
namesMaterialPanel.sort();
for (var i = 0; i < namesMaterialPanel.length; i++) {
    MaterialPanel.AddItem(namesMaterialPanel[i]);
};


Prop.OnChange = function() {
    Model.forEachPanel(function(panel) {
            var sign = ExtractMatName(panel.MaterialName);
            value = MaterialPanel.Value;
            if (sign == value) {
                if (panel.FrontFace != 2) panel.Selected = true;
            }
        });
    }

Action.Continue();