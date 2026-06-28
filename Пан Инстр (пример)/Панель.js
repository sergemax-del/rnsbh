
ЛБ = AddVertPanel(0, 0, 300, 800, 0);
ПБ = AddVertPanel(0, 0, 300, 800, 450);

BtnMake1 = NewButtonInput('1');
  BtnMake1.OnChange = function()
  {
   system.require('Полки/Полки.js');
  };

BtnMake2 = NewButtonInput('2');
  BtnMake2.OnChange = function()
  {
   system.require('Уголок/Уголок.js');
  };

Action.Continue();