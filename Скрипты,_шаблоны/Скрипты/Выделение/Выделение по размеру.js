FileOptions = 'Выделение по размеру.xml';

var MinDl;
var MaxDl;
var MinSh;
var MaxSh;
var MinSize;
var MaxSize;

Model.UnSelectAll();
Prop = Action.Properties;

GroupDl = Prop.NewGroup('Длина')
PropMinDl = GroupDl.NewNumber('Минимум');
PropMinDl.Value = 0;
PropMaxDl = GroupDl.NewNumber('Максимум');
PropMaxDl.Value = 1000;
GroupDl.Visible = true;

GroupSh = Prop.NewGroup('Ширина')
PropMinSh = GroupSh.NewNumber('Минимум');
PropMinSh.Value = 0;
PropMaxSh = GroupSh.NewNumber('Максимум');
PropMaxSh.Value = 1000;
GroupSh.Visible = true;

GroupSize = Prop.NewGroup('Размер')
PropMinSize = GroupSize.NewNumber('Минимум');
PropMinSize.Value = 0;
PropMaxSize = GroupSize.NewNumber('Максимум');
PropMaxSize.Value = 1000;
GroupSize.Visible = false;

Texture = Prop.NewBool('Текстура задана');
Texture.Value = true;

Action.Properties.Load(FileOptions);
Action.OnFinish = function() {
    Action.Properties.Save(FileOptions);
}

Texture.OnChange = function() {
    if (Texture.Value) {
        GroupDl.Visible = true;
        GroupSh.Visible = true;
        GroupSize.Visible = false;
    }
    else
    {
        GroupDl.Visible = false;
        GroupSh.Visible = false;
        GroupSize.Visible = true;
    }
  };

OkBtn = Prop.NewButton('Выделить');
OkBtn.OnClick = function() {
    Model.UnSelectAll();
    MinDl = PropMinDl.Value;
    MinSh = PropMinSh.Value;
    MaxDl = PropMaxDl.Value;
    MaxSh = PropMaxSh.Value;
    MinSize = PropMinSize.Value;
    MaxSize = PropMaxSize.Value;
    Model.forEachPanel(function(panel) {
        if (Texture.Value) {
            if (((panel.Contour.Width >= MinDl) && (panel.Contour.Width <= MaxDl)) &&
                ((panel.Contour.Height >= MinSh) && (panel.Contour.Height <= MaxSh)))
                    panel.Selected = true;
                else
                    panel.Selected = false;
            }
            else
            {
                if (panel.Contour.Width > panel.Contour.Height) {
                    PanelMinSize = panel.Contour.Height;
                    PanelMaxSize = panel.Contour.Width;
                    }
                else
                    {
                    PanelMinSize = panel.Contour.Width;
                    PanelMaxSize = panel.Contour.Height;
                    }
                if ((PanelMinSize >= MinSize) && (PanelMaxSize <= MaxSize))
                    panel.Selected = true;
                else
                    panel.Selected = false;
            }
        }
    );
}

Action.Continue();

