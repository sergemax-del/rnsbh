////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                                                                            //
//                                                                            //
//                          Выделение по маске v20                            //
//                 by OlegVolgin feat. Nikolay Kaskevich, 2024                //
//                                                                            //
//               Выделяет элементы согласно выбранным параметрам              //
//                                                                            //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

//-- MainForm #def_starts
var MainForm = UI.components.NewForm();
MainForm.Width = 556;
MainForm.Height = 674;
MainForm.Caption = 'Выделение по маске';
MainForm.Anchors = new Set([0, 1]);
MainForm.ShowHint = true;
MainForm.Show();
//-- MainForm #def_ends

//-- btnRotationBody #def_starts
var btnRotationBody = UI.components.NewButton(MainForm, MainForm);
btnRotationBody.Colors.AssignedColors = new Set([]);
btnRotationBody.Width = 255;
btnRotationBody.Height = 25;
btnRotationBody.ShowHint = true;
btnRotationBody.Caption = 'Тела вращения';
btnRotationBody.Left = 275;
btnRotationBody.Top = 387;
btnRotationBody.Anchors = new Set([0, 1]);
btnRotationBody.OnClick = function (Sender) {
    DoRotationBodySelection();
}
//-- btnRotationBody #def_ends

//-- lblCase #def_starts
var lblCase = UI.components.NewLabel(MainForm, MainForm);
lblCase.Style.Edges = new Set([0, 1, 2, 3]);
lblCase.Style.BorderColor = 0;
lblCase.Style.Font.Color = -16777208;
lblCase.Style.Font.Size = 9;
lblCase.Style.Font.Name = 'Segoe UI';
lblCase.Style.Font.Style = new Set([]);
lblCase.Style.TextStyle = new Set([]);
lblCase.Style.Color = 16777215;
lblCase.ShowHint = true;
lblCase.AutoSize = false;
lblCase.Transparent = true;
lblCase.Properties.Alignment.Horz = 2;
lblCase.Width = 255;
lblCase.Height = 21;
lblCase.Left = 275;
lblCase.Top = 452;
lblCase.Anchors = new Set([0, 1]);
//-- lblCase #def_ends

//-- pnCount #def_starts
var pnCount = UI.components.NewPanel(MainForm, MainForm);
pnCount.Left = 328;
pnCount.Width = 202;
pnCount.Top = 4;
pnCount.Height = 40;
pnCount.Caption = 'pnCount';
pnCount.ShowCaption = false;
pnCount.BevelEdges = new Set([0, 1, 2, 3]);
pnCount.BevelOuter = 0;
pnCount.Anchors = new Set([0, 1]);
//-- pnCount #def_ends

//-- lblCount #def_starts
var lblCount = UI.components.NewLabel(MainForm, pnCount);
lblCount.Left = 1;
lblCount.Style.Edges = new Set([0, 1, 2, 3]);
lblCount.Style.BorderColor = 0;
lblCount.Style.Font.Color = -16777208;
lblCount.Style.Font.Size = 9;
lblCount.Style.Font.Name = 'Segoe UI';
lblCount.Style.Font.Style = new Set([]);
lblCount.Style.TextStyle = new Set([]);
lblCount.Style.Color = 16777215;
lblCount.Width = 131;
lblCount.Top = 11;
lblCount.Height = 21;
lblCount.Caption = 'Выделено элементов:';
lblCount.Transparent = true;
lblCount.Anchors = new Set([0, 1]);
//-- lblCount #def_ends

//-- edtCount #def_starts
var edtCount = UI.components.NewTextEdit(MainForm, pnCount);
edtCount.Left = 137;
edtCount.Style.Edges = new Set([0, 1, 2, 3]);
edtCount.Style.BorderColor = 0;
edtCount.Style.Font.Color = -16777208;
edtCount.Style.Font.Size = 9;
edtCount.Style.Font.Name = 'Segoe UI';
edtCount.Style.Font.Style = new Set([]);
edtCount.Style.TextStyle = new Set([]);
edtCount.Style.BorderStyle = 4;
edtCount.Style.Color = 16777215;
edtCount.Width = 53;
edtCount.Top = 7;
edtCount.Height = 25;
with (edtCount.Properties.LookupItems) { }
edtCount.Properties.PasswordChar = '*';
edtCount.Properties.ReadOnly = true;
edtCount.Text = '0';
edtCount.Anchors = new Set([0, 1]);
//-- edtCount #def_ends

//-- btnGabaritFrames #def_starts
var btnGabaritFrames = UI.components.NewButton(MainForm, MainForm);
btnGabaritFrames.Left = 275;
btnGabaritFrames.Colors.AssignedColors = new Set([]);
btnGabaritFrames.Width = 255;
btnGabaritFrames.Top = 417;
btnGabaritFrames.Height = 25;
btnGabaritFrames.Caption = 'Габаритные рамки';
btnGabaritFrames.Anchors = new Set([0, 1]);
btnGabaritFrames.OnClick = function (Sender) {
    DoGabaritFramesSelection();
}
//-- btnGabaritFrames #def_ends

//-- btnTrajectoryBodies #def_starts
var btnTrajectoryBodies = UI.components.NewButton(MainForm, MainForm);
btnTrajectoryBodies.Left = 275;
btnTrajectoryBodies.Colors.AssignedColors = new Set([]);
btnTrajectoryBodies.Width = 255;
btnTrajectoryBodies.Top = 357;
btnTrajectoryBodies.Height = 25;
btnTrajectoryBodies.Caption = 'Тела по траектории';
btnTrajectoryBodies.Anchors = new Set([0, 1]);
btnTrajectoryBodies.OnClick = function (Sender) {
    DoBodyTrajectorySelection();
}
//-- btnTrajectoryBodies #def_ends

//-- btnProfiles #def_starts
var btnProfiles = UI.components.NewButton(MainForm, MainForm);
btnProfiles.Left = 275;
btnProfiles.Colors.AssignedColors = new Set([]);
btnProfiles.Width = 255;
btnProfiles.Top = 327;
btnProfiles.Height = 25;
btnProfiles.Caption = 'Профили';
btnProfiles.Anchors = new Set([0, 1]);
btnProfiles.OnClick = function (Sender) {
    DoProfileSelection();
}
//-- btnProfiles #def_ends

//-- btnRoundContour #def_starts
var btnRoundContour = UI.components.NewButton(MainForm, MainForm);
btnRoundContour.Left = 275;
btnRoundContour.Colors.AssignedColors = new Set([]);
btnRoundContour.Width = 255;
btnRoundContour.Top = 297;
btnRoundContour.Height = 25;
btnRoundContour.Caption = 'Контур с дугами или окружностями';
btnRoundContour.Anchors = new Set([0, 1]);
btnRoundContour.OnClick = function (Sender) {
    DoRoundContourSelection();
}
//-- btnRoundContour #def_ends

//-- btnContourNonRectangular #def_starts
var btnContourNonRectangular = UI.components.NewButton(MainForm, MainForm);
btnContourNonRectangular.Left = 275;
btnContourNonRectangular.Colors.AssignedColors = new Set([]);
btnContourNonRectangular.Width = 255;
btnContourNonRectangular.Top = 267;
btnContourNonRectangular.Height = 25;
btnContourNonRectangular.Caption = 'Контур не прямоугольный';
btnContourNonRectangular.Anchors = new Set([0, 1]);
btnContourNonRectangular.OnClick = function (Sender) {
    DoNonRectangularContourSelection();
}
//-- btnContourNonRectangular #def_ends

//-- btnCancelSelection #def_starts
var btnCancelSelection = UI.components.NewButton(MainForm, MainForm);
btnCancelSelection.Left = 275;
btnCancelSelection.Colors.AssignedColors = new Set([]);
btnCancelSelection.Width = 255;
btnCancelSelection.Top = 566;
btnCancelSelection.Height = 25;
btnCancelSelection.Caption = 'Отменить выделение';
btnCancelSelection.Anchors = new Set([0, 1]);
btnCancelSelection.OnClick = function (Sender) {
    DoCancelSelection();
}
//-- btnCancelSelection #def_ends

//-- btnInvertSelection #def_starts
var btnInvertSelection = UI.components.NewButton(MainForm, MainForm);
btnInvertSelection.Left = 275;
btnInvertSelection.Colors.AssignedColors = new Set([]);
btnInvertSelection.Width = 255;
btnInvertSelection.Top = 595;
btnInvertSelection.Height = 25;
btnInvertSelection.Caption = 'Инвертировать выделение';
btnInvertSelection.Anchors = new Set([0, 1]);
btnInvertSelection.OnClick = function (Sender) {
    DoInvertSelection();
}
//-- btnInvertSelection #def_ends

//-- lblGroveType #def_starts
var lblGroveType = UI.components.NewLabel(MainForm, MainForm);
lblGroveType.Style.Edges = new Set([0, 1, 2, 3]);
lblGroveType.Style.BorderColor = 0;
lblGroveType.Style.Font.Color = -16777208;
lblGroveType.Style.Font.Size = 9;
lblGroveType.Style.Font.Name = 'Segoe UI';
lblGroveType.Style.Font.Style = new Set([]);
lblGroveType.Style.TextStyle = new Set([]);
lblGroveType.Style.Color = 16777215;
lblGroveType.Width = 64;
lblGroveType.Height = 21;
lblGroveType.Caption = 'Тип пазов';
lblGroveType.Transparent = true;
lblGroveType.Left = 275;
lblGroveType.Top = 216;
lblGroveType.Anchors = new Set([0, 1]);
//-- lblGroveType #def_ends

//-- cbCuts #def_starts
var cbCuts = UI.components.NewComboBox(MainForm, MainForm);
cbCuts.Style.Edges = new Set([0, 1, 2, 3]);
cbCuts.Style.BorderColor = 0;
cbCuts.Style.Font.Color = -16777208;
cbCuts.Style.Font.Size = 9;
cbCuts.Style.Font.Name = 'Segoe UI';
cbCuts.Style.Font.Style = new Set([]);
cbCuts.Style.TextStyle = new Set([]);
cbCuts.Style.BorderStyle = 4;
cbCuts.Style.Color = 16777215;
cbCuts.Width = 255;
cbCuts.Height = 25;
with (cbCuts.Properties.Items) { }
cbCuts.Properties.ImmediatePost = true;
cbCuts.Left = 275;
cbCuts.Top = 237;
cbCuts.Anchors = new Set([0, 1]);
cbCuts.Properties.Sorted = true;
cbCuts.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbCuts #def_ends

//-- gbFurniture #def_starts
var gbFurniture = UI.components.NewGroupBox(MainForm, MainForm);
gbFurniture.Style.Edges = new Set([0, 1, 2, 3]);
gbFurniture.Style.BorderColor = 0;
gbFurniture.Style.Font.Color = -16777208;
gbFurniture.Style.Font.Size = 9;
gbFurniture.Style.Font.Name = 'Segoe UI';
gbFurniture.Style.Font.Style = new Set([]);
gbFurniture.Style.TextStyle = new Set([]);
gbFurniture.Style.BorderStyle = 4;
gbFurniture.Style.Color = 16777215;
gbFurniture.Width = 255;
gbFurniture.Height = 127;
gbFurniture.Top = 493;
gbFurniture.Left = 11;
gbFurniture.Caption = 'Фурнитура';
gbFurniture.PanelStyle.CaptionIndent = 2;
gbFurniture.Anchors = new Set([0, 1]);
//-- gbFurniture #def_ends

//-- cbHoles #def_starts
var cbHoles = UI.components.NewComboBox(MainForm, gbFurniture);
cbHoles.Style.Edges = new Set([0, 1, 2, 3]);
cbHoles.Style.BorderColor = 0;
cbHoles.Style.Font.Color = -16777208;
cbHoles.Style.Font.Size = 9;
cbHoles.Style.Font.Name = 'Segoe UI';
cbHoles.Style.Font.Style = new Set([]);
cbHoles.Style.TextStyle = new Set([]);
cbHoles.Style.BorderStyle = 4;
cbHoles.Style.Color = 16777215;
cbHoles.Width = 231;
cbHoles.Height = 25;
with (cbHoles.Properties.Items) { }
cbHoles.Properties.ImmediatePost = true;
cbHoles.Left = 12;
cbHoles.Top = 86;
cbHoles.Anchors = new Set([0, 1, 2]);
cbHoles.Properties.Sorted = true;
cbHoles.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbHoles #def_ends

//-- lblHoles #def_starts
var lblHoles = UI.components.NewLabel(MainForm, gbFurniture);
lblHoles.Style.Edges = new Set([0, 1, 2, 3]);
lblHoles.Style.BorderColor = 0;
lblHoles.Style.Font.Color = -16777208;
lblHoles.Style.Font.Size = 9;
lblHoles.Style.Font.Name = 'Segoe UI';
lblHoles.Style.Font.Style = new Set([]);
lblHoles.Style.TextStyle = new Set([]);
lblHoles.Style.Color = 16777215;
lblHoles.Width = 64;
lblHoles.Height = 21;
lblHoles.Caption = 'Отверстия';
lblHoles.Transparent = true;
lblHoles.Left = 12;
lblHoles.Top = 65;
lblHoles.Anchors = new Set([0, 1, 2]);
//-- lblHoles #def_ends

//-- cbFurnitureName #def_starts
var cbFurnitureName = UI.components.NewComboBox(MainForm, gbFurniture);
cbFurnitureName.Style.Edges = new Set([0, 1, 2, 3]);
cbFurnitureName.Style.BorderColor = 0;
cbFurnitureName.Style.Font.Color = -16777208;
cbFurnitureName.Style.Font.Size = 9;
cbFurnitureName.Style.Font.Name = 'Segoe UI';
cbFurnitureName.Style.Font.Style = new Set([]);
cbFurnitureName.Style.TextStyle = new Set([]);
cbFurnitureName.Style.BorderStyle = 4;
cbFurnitureName.Style.Color = 16777215;
cbFurnitureName.Width = 231;
cbFurnitureName.Height = 25;
with (cbFurnitureName.Properties.Items) { }
cbFurnitureName.Properties.ImmediatePost = true;
cbFurnitureName.Left = 12;
cbFurnitureName.Top = 40;
cbFurnitureName.Anchors = new Set([0, 1, 2]);
cbFurnitureName.Properties.Sorted = true;
cbFurnitureName.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbFurnitureName #def_ends

//-- lblFurnitureName #def_starts
var lblFurnitureName = UI.components.NewLabel(MainForm, gbFurniture);
lblFurnitureName.Style.Edges = new Set([0, 1, 2, 3]);
lblFurnitureName.Style.BorderColor = 0;
lblFurnitureName.Style.Font.Color = -16777208;
lblFurnitureName.Style.Font.Size = 9;
lblFurnitureName.Style.Font.Name = 'Segoe UI';
lblFurnitureName.Style.Font.Style = new Set([]);
lblFurnitureName.Style.TextStyle = new Set([]);
lblFurnitureName.Style.Color = 16777215;
lblFurnitureName.Width = 157;
lblFurnitureName.Height = 21;
lblFurnitureName.Caption = 'Наименование фурнитуры';
lblFurnitureName.Transparent = true;
lblFurnitureName.Left = 12;
lblFurnitureName.Top = 19;
lblFurnitureName.Anchors = new Set([0, 1, 2]);
//-- lblFurnitureName #def_ends

//-- gbButt #def_starts
var gbButt = UI.components.NewGroupBox(MainForm, MainForm);
gbButt.Left = 275;
gbButt.Style.Edges = new Set([0, 1, 2, 3]);
gbButt.Style.BorderColor = 0;
gbButt.Style.Font.Color = -16777208;
gbButt.Style.Font.Size = 9;
gbButt.Style.Font.Name = 'Segoe UI';
gbButt.Style.Font.Style = new Set([]);
gbButt.Style.TextStyle = new Set([]);
gbButt.Style.BorderStyle = 4;
gbButt.Style.Color = 16777215;
gbButt.Width = 255;
gbButt.Top = 44;
gbButt.Height = 172;
gbButt.Caption = 'Кромка';
gbButt.PanelStyle.CaptionIndent = 2;
gbButt.Anchors = new Set([0, 1]);
//-- gbButt #def_ends

//-- cbButtThickness #def_starts
var cbButtThickness = UI.components.NewComboBox(MainForm, gbButt);
cbButtThickness.Style.Edges = new Set([0, 1, 2, 3]);
cbButtThickness.Style.BorderColor = 0;
cbButtThickness.Style.Font.Color = -16777208;
cbButtThickness.Style.Font.Size = 9;
cbButtThickness.Style.Font.Name = 'Segoe UI';
cbButtThickness.Style.Font.Style = new Set([]);
cbButtThickness.Style.TextStyle = new Set([]);
cbButtThickness.Style.BorderStyle = 4;
cbButtThickness.Style.Color = 16777215;
cbButtThickness.Width = 231;
cbButtThickness.Height = 25;
with (cbButtThickness.Properties.Items) { }
cbButtThickness.Properties.ImmediatePost = true;
cbButtThickness.Left = 12;
cbButtThickness.Top = 132;
cbButtThickness.Anchors = new Set([0, 1, 2]);
cbButtThickness.Properties.Sorted = true;
cbButtThickness.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbButtThickness #def_ends

//-- lblButtThickness #def_starts
var lblButtThickness = UI.components.NewLabel(MainForm, gbButt);
lblButtThickness.Style.Edges = new Set([0, 1, 2, 3]);
lblButtThickness.Style.BorderColor = 0;
lblButtThickness.Style.Font.Color = -16777208;
lblButtThickness.Style.Font.Size = 9;
lblButtThickness.Style.Font.Name = 'Segoe UI';
lblButtThickness.Style.Font.Style = new Set([]);
lblButtThickness.Style.TextStyle = new Set([]);
lblButtThickness.Style.Color = 16777215;
lblButtThickness.Width = 104;
lblButtThickness.Height = 21;
lblButtThickness.Caption = 'Толщина кромки';
lblButtThickness.Transparent = true;
lblButtThickness.Left = 12;
lblButtThickness.Top = 111;
lblButtThickness.Anchors = new Set([0, 1, 2]);
//-- lblButtThickness #def_ends

//-- cbButtType #def_starts
var cbButtType = UI.components.NewComboBox(MainForm, gbButt);
cbButtType.Style.Edges = new Set([0, 1, 2, 3]);
cbButtType.Style.BorderColor = 0;
cbButtType.Style.Font.Color = -16777208;
cbButtType.Style.Font.Size = 9;
cbButtType.Style.Font.Name = 'Segoe UI';
cbButtType.Style.Font.Style = new Set([]);
cbButtType.Style.TextStyle = new Set([]);
cbButtType.Style.BorderStyle = 4;
cbButtType.Style.Color = 16777215;
cbButtType.Width = 231;
cbButtType.Height = 25;
with (cbButtType.Properties.Items) { }
cbButtType.Properties.ImmediatePost = true;
cbButtType.Left = 12;
cbButtType.Top = 86;
cbButtType.Anchors = new Set([0, 1, 2]);
cbButtType.Properties.Sorted = true;
cbButtType.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbButtType #def_ends

//-- lblButtType #def_starts
var lblButtType = UI.components.NewLabel(MainForm, gbButt);
lblButtType.Style.Edges = new Set([0, 1, 2, 3]);
lblButtType.Style.BorderColor = 0;
lblButtType.Style.Font.Color = -16777208;
lblButtType.Style.Font.Size = 9;
lblButtType.Style.Font.Name = 'Segoe UI';
lblButtType.Style.Font.Style = new Set([]);
lblButtType.Style.TextStyle = new Set([]);
lblButtType.Style.Color = 16777215;
lblButtType.Width = 74;
lblButtType.Height = 21;
lblButtType.Caption = 'Тип кромки';
lblButtType.Transparent = true;
lblButtType.Left = 12;
lblButtType.Top = 65;
lblButtType.Anchors = new Set([0, 1, 2]);
//-- lblButtType #def_ends

//-- cbButtMaterial #def_starts
var cbButtMaterial = UI.components.NewComboBox(MainForm, gbButt);
cbButtMaterial.Style.Edges = new Set([0, 1, 2, 3]);
cbButtMaterial.Style.BorderColor = 0;
cbButtMaterial.Style.Font.Color = -16777208;
cbButtMaterial.Style.Font.Size = 9;
cbButtMaterial.Style.Font.Name = 'Segoe UI';
cbButtMaterial.Style.Font.Style = new Set([]);
cbButtMaterial.Style.TextStyle = new Set([]);
cbButtMaterial.Style.BorderStyle = 4;
cbButtMaterial.Style.Color = 16777215;
cbButtMaterial.Width = 231;
cbButtMaterial.Height = 25;
with (cbButtMaterial.Properties.Items) { }
cbButtMaterial.Properties.ImmediatePost = true;
cbButtMaterial.Left = 12;
cbButtMaterial.Top = 40;
cbButtMaterial.Anchors = new Set([0, 1]);
cbButtMaterial.Properties.Sorted = true;
cbButtMaterial.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbButtMaterial #def_ends

//-- lblButtMaterial #def_starts
var lblButtMaterial = UI.components.NewLabel(MainForm, gbButt);
lblButtMaterial.Style.Edges = new Set([0, 1, 2, 3]);
lblButtMaterial.Style.BorderColor = 0;
lblButtMaterial.Style.Font.Color = -16777208;
lblButtMaterial.Style.Font.Size = 9;
lblButtMaterial.Style.Font.Name = 'Segoe UI';
lblButtMaterial.Style.Font.Style = new Set([]);
lblButtMaterial.Style.TextStyle = new Set([]);
lblButtMaterial.Style.Color = 16777215;
lblButtMaterial.Width = 106;
lblButtMaterial.Height = 21;
lblButtMaterial.Caption = 'Материал кромки';
lblButtMaterial.Transparent = true;
lblButtMaterial.Left = 12;
lblButtMaterial.Top = 19;
lblButtMaterial.Anchors = new Set([0, 1, 2]);
//-- lblButtMaterial #def_ends

//-- gbPanel #def_starts
var gbPanel = UI.components.NewGroupBox(MainForm, MainForm);
gbPanel.Left = 11;
gbPanel.Style.Edges = new Set([0, 1, 2, 3]);
gbPanel.Style.BorderColor = 0;
gbPanel.Style.Font.Color = -16777208;
gbPanel.Style.Font.Size = 9;
gbPanel.Style.Font.Name = 'Segoe UI';
gbPanel.Style.Font.Style = new Set([]);
gbPanel.Style.TextStyle = new Set([]);
gbPanel.Style.BorderStyle = 4;
gbPanel.Style.Color = 16777215;
gbPanel.Width = 255;
gbPanel.Top = 44;
gbPanel.Height = 449;
gbPanel.Caption = 'Панель';
gbPanel.PanelStyle.CaptionIndent = 2;
gbPanel.Anchors = new Set([0, 1]);
//-- gbPanel #def_ends

//-- btnCaseSensitive #def_starts
var btnCaseSensitive = UI.components.NewButton(MainForm, gbPanel);
btnCaseSensitive.Colors.AssignedColors = new Set([]);
btnCaseSensitive.Width = 25;
btnCaseSensitive.Height = 25;
btnCaseSensitive.ShowHint = true;
btnCaseSensitive.Caption = 'Аа';
btnCaseSensitive.Hint = 'Учитывать регистр';
btnCaseSensitive.Left = 218;
btnCaseSensitive.Top = 178;
btnCaseSensitive.Anchors = new Set([0, 1]);
btnCaseSensitive.OnClick = function (Sender) {
    caseSensitive = !caseSensitive;
    UpdateCaseLabel();
    DoValueChanged();
}
//-- btnCaseSensitive #def_ends

//-- cbUserProperties #def_starts
var cbUserProperties = UI.components.NewComboBox(MainForm, gbPanel);
cbUserProperties.Style.Edges = new Set([0, 1, 2, 3]);
cbUserProperties.Style.BorderColor = 0;
cbUserProperties.Style.Font.Color = -16777208;
cbUserProperties.Style.Font.Size = 9;
cbUserProperties.Style.Font.Name = 'Segoe UI';
cbUserProperties.Style.Font.Style = new Set([]);
cbUserProperties.Style.TextStyle = new Set([]);
cbUserProperties.Style.BorderStyle = 4;
cbUserProperties.Style.Color = 16777215;
cbUserProperties.Width = 231;
cbUserProperties.Height = 25;
with (cbUserProperties.Properties.Items) { }
cbUserProperties.Properties.ImmediatePost = true;
cbUserProperties.Left = 12;
cbUserProperties.Top = 408;
cbUserProperties.Anchors = new Set([0, 1, 2]);
cbUserProperties.Properties.Sorted = true;
cbUserProperties.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbUserProperties #def_ends

//-- lblUserProps #def_starts
var lblUserProps = UI.components.NewLabel(MainForm, gbPanel);
lblUserProps.Style.Edges = new Set([0, 1, 2, 3]);
lblUserProps.Style.BorderColor = 0;
lblUserProps.Style.Font.Color = -16777208;
lblUserProps.Style.Font.Size = 9;
lblUserProps.Style.Font.Name = 'Segoe UI';
lblUserProps.Style.Font.Style = new Set([]);
lblUserProps.Style.TextStyle = new Set([]);
lblUserProps.Style.Color = 16777215;
lblUserProps.Width = 167;
lblUserProps.Height = 21;
lblUserProps.Caption = 'Пользовательские свойства';
lblUserProps.Transparent = true;
lblUserProps.Left = 12;
lblUserProps.Top = 387;
lblUserProps.Anchors = new Set([0, 1, 2]);
//-- lblUserProps #def_ends

//-- cbPanelPlastic #def_starts
var cbPanelPlastic = UI.components.NewComboBox(MainForm, gbPanel);
cbPanelPlastic.Style.Edges = new Set([0, 1, 2, 3]);
cbPanelPlastic.Style.BorderColor = 0;
cbPanelPlastic.Style.Font.Color = -16777208;
cbPanelPlastic.Style.Font.Size = 9;
cbPanelPlastic.Style.Font.Name = 'Segoe UI';
cbPanelPlastic.Style.Font.Style = new Set([]);
cbPanelPlastic.Style.TextStyle = new Set([]);
cbPanelPlastic.Style.BorderStyle = 4;
cbPanelPlastic.Style.Color = 16777215;
cbPanelPlastic.Width = 231;
cbPanelPlastic.Height = 25;
with (cbPanelPlastic.Properties.Items) { }
cbPanelPlastic.Properties.ImmediatePost = true;
cbPanelPlastic.Left = 12;
cbPanelPlastic.Top = 362;
cbPanelPlastic.Anchors = new Set([0, 1, 2]);
cbPanelPlastic.Properties.Sorted = true;
cbPanelPlastic.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbPanelPlastic #def_ends

//-- lblPanelPlastics #def_starts
var lblPanelPlastics = UI.components.NewLabel(MainForm, gbPanel);
lblPanelPlastics.Style.Edges = new Set([0, 1, 2, 3]);
lblPanelPlastics.Style.BorderColor = 0;
lblPanelPlastics.Style.Font.Color = -16777208;
lblPanelPlastics.Style.Font.Size = 9;
lblPanelPlastics.Style.Font.Name = 'Segoe UI';
lblPanelPlastics.Style.Font.Style = new Set([]);
lblPanelPlastics.Style.TextStyle = new Set([]);
lblPanelPlastics.Style.Color = 16777215;
lblPanelPlastics.Width = 119;
lblPanelPlastics.Height = 21;
lblPanelPlastics.Caption = 'Пластик на панели';
lblPanelPlastics.Transparent = true;
lblPanelPlastics.Left = 12;
lblPanelPlastics.Top = 341;
lblPanelPlastics.Anchors = new Set([0, 1, 2]);
//-- lblPanelPlastics #def_ends

//-- cbPanelThickess #def_starts
var cbPanelThickess = UI.components.NewComboBox(MainForm, gbPanel);
cbPanelThickess.Style.Edges = new Set([0, 1, 2, 3]);
cbPanelThickess.Style.BorderColor = 0;
cbPanelThickess.Style.Font.Color = -16777208;
cbPanelThickess.Style.Font.Size = 9;
cbPanelThickess.Style.Font.Name = 'Segoe UI';
cbPanelThickess.Style.Font.Style = new Set([]);
cbPanelThickess.Style.TextStyle = new Set([]);
cbPanelThickess.Style.BorderStyle = 4;
cbPanelThickess.Style.Color = 16777215;
cbPanelThickess.Width = 231;
cbPanelThickess.Height = 25;
with (cbPanelThickess.Properties.Items) { }
cbPanelThickess.Properties.ImmediatePost = true;
cbPanelThickess.Left = 12;
cbPanelThickess.Top = 316;
cbPanelThickess.Anchors = new Set([0, 1, 2]);
cbPanelThickess.Properties.Sorted = true;
cbPanelThickess.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbPanelThickess #def_ends

//-- lblPanelThickness #def_starts
var lblPanelThickness = UI.components.NewLabel(MainForm, gbPanel);
lblPanelThickness.Style.Edges = new Set([0, 1, 2, 3]);
lblPanelThickness.Style.BorderColor = 0;
lblPanelThickness.Style.Font.Color = -16777208;
lblPanelThickness.Style.Font.Size = 9;
lblPanelThickness.Style.Font.Name = 'Segoe UI';
lblPanelThickness.Style.Font.Style = new Set([]);
lblPanelThickness.Style.TextStyle = new Set([]);
lblPanelThickness.Style.Color = 16777215;
lblPanelThickness.Width = 111;
lblPanelThickness.Height = 21;
lblPanelThickness.Caption = 'Толщина панелей';
lblPanelThickness.Transparent = true;
lblPanelThickness.Left = 12;
lblPanelThickness.Top = 295;
lblPanelThickness.Anchors = new Set([0, 1, 2]);
//-- lblPanelThickness #def_ends

//-- cbPanelDesignation #def_starts
var cbPanelDesignation = UI.components.NewComboBox(MainForm, gbPanel);
cbPanelDesignation.Style.Edges = new Set([0, 1, 2, 3]);
cbPanelDesignation.Style.BorderColor = 0;
cbPanelDesignation.Style.Font.Color = -16777208;
cbPanelDesignation.Style.Font.Size = 9;
cbPanelDesignation.Style.Font.Name = 'Segoe UI';
cbPanelDesignation.Style.Font.Style = new Set([]);
cbPanelDesignation.Style.TextStyle = new Set([]);
cbPanelDesignation.Style.BorderStyle = 4;
cbPanelDesignation.Style.Color = 16777215;
cbPanelDesignation.Width = 231;
cbPanelDesignation.Height = 25;
with (cbPanelDesignation.Properties.Items) { }
cbPanelDesignation.Properties.ImmediatePost = true;
cbPanelDesignation.Left = 12;
cbPanelDesignation.Top = 270;
cbPanelDesignation.Anchors = new Set([0, 1, 2]);
cbPanelDesignation.Properties.Sorted = true;
cbPanelDesignation.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbPanelDesignation #def_ends

//-- lblPanelDesignation #def_starts
var lblPanelDesignation = UI.components.NewLabel(MainForm, gbPanel);
lblPanelDesignation.Style.Edges = new Set([0, 1, 2, 3]);
lblPanelDesignation.Style.BorderColor = 0;
lblPanelDesignation.Style.Font.Color = -16777208;
lblPanelDesignation.Style.Font.Size = 9;
lblPanelDesignation.Style.Font.Name = 'Segoe UI';
lblPanelDesignation.Style.Font.Style = new Set([]);
lblPanelDesignation.Style.TextStyle = new Set([]);
lblPanelDesignation.Style.Color = 16777215;
lblPanelDesignation.Width = 131;
lblPanelDesignation.Height = 21;
lblPanelDesignation.Transparent = true;
lblPanelDesignation.Caption = 'Обозначение панелей';
lblPanelDesignation.Left = 12;
lblPanelDesignation.Top = 249;
lblPanelDesignation.Anchors = new Set([0, 1, 2]);
//-- lblPanelDesignation #def_ends

//-- cbPanelPosition #def_starts
var cbPanelPosition = UI.components.NewComboBox(MainForm, gbPanel);
cbPanelPosition.Style.Edges = new Set([0, 1, 2, 3]);
cbPanelPosition.Style.BorderColor = 0;
cbPanelPosition.Style.Font.Color = -16777208;
cbPanelPosition.Style.Font.Size = 9;
cbPanelPosition.Style.Font.Name = 'Segoe UI';
cbPanelPosition.Style.Font.Style = new Set([]);
cbPanelPosition.Style.TextStyle = new Set([]);
cbPanelPosition.Style.BorderStyle = 4;
cbPanelPosition.Style.Color = 16777215;
cbPanelPosition.Width = 231;
cbPanelPosition.Height = 25;
with (cbPanelPosition.Properties.Items) { }
cbPanelPosition.Properties.ImmediatePost = true;
cbPanelPosition.Left = 12;
cbPanelPosition.Top = 224;
cbPanelPosition.Anchors = new Set([0, 1, 2]);
cbPanelPosition.Properties.Sorted = true;
cbPanelPosition.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbPanelPosition #def_ends

//-- lblPanelPositions #def_starts
var lblPanelPositions = UI.components.NewLabel(MainForm, gbPanel);
lblPanelPositions.Style.Edges = new Set([0, 1, 2, 3]);
lblPanelPositions.Style.BorderColor = 0;
lblPanelPositions.Style.Font.Color = -16777208;
lblPanelPositions.Style.Font.Size = 9;
lblPanelPositions.Style.Font.Name = 'Segoe UI';
lblPanelPositions.Style.Font.Style = new Set([]);
lblPanelPositions.Style.TextStyle = new Set([]);
lblPanelPositions.Style.Color = 16777215;
lblPanelPositions.Width = 111;
lblPanelPositions.Height = 21;
lblPanelPositions.Caption = 'Позиции панелей';
lblPanelPositions.Transparent = true;
lblPanelPositions.Left = 12;
lblPanelPositions.Top = 203;
lblPanelPositions.Anchors = new Set([0, 1, 2]);
//-- lblPanelPositions #def_ends

//-- edtNameContains #def_starts
var edtNameContains = UI.components.NewTextEdit(MainForm, gbPanel);
edtNameContains.Style.Edges = new Set([0, 1, 2, 3]);
edtNameContains.Style.BorderColor = 0;
edtNameContains.Style.Font.Color = -16777208;
edtNameContains.Style.Font.Size = 9;
edtNameContains.Style.Font.Name = 'Segoe UI';
edtNameContains.Style.Font.Style = new Set([]);
edtNameContains.Style.TextStyle = new Set([]);
edtNameContains.Style.BorderStyle = 4;
edtNameContains.Style.Color = 16777215;
edtNameContains.Width = 200;
edtNameContains.Height = 25;
with (edtNameContains.Properties.LookupItems) { }
edtNameContains.Properties.PasswordChar = '*';
edtNameContains.AlignWithMargins = true;
edtNameContains.Margins.Bottom = 5;
edtNameContains.Margins.Left = 10;
edtNameContains.Margins.Right = 10;
edtNameContains.Margins.Top = 0;
edtNameContains.Left = 12;
edtNameContains.Top = 178;
edtNameContains.Anchors = new Set([0, 1, 2]);
edtNameContains.Properties.OnChange = function (Sender) {
    DoValueChanged();
}
//-- edtNameContains #def_ends

//-- lblNameContains #def_starts
var lblNameContains = UI.components.NewLabel(MainForm, gbPanel);
lblNameContains.Style.Edges = new Set([0, 1, 2, 3]);
lblNameContains.Style.BorderColor = 0;
lblNameContains.Style.Font.Color = -16777208;
lblNameContains.Style.Font.Size = 9;
lblNameContains.Style.Font.Name = 'Segoe UI';
lblNameContains.Style.Font.Style = new Set([]);
lblNameContains.Style.TextStyle = new Set([]);
lblNameContains.Style.Color = 16777215;
lblNameContains.Width = 133;
lblNameContains.Height = 21;
lblNameContains.Caption = 'Имя панели содержит';
lblNameContains.Transparent = true;
lblNameContains.AlignWithMargins = true;
lblNameContains.Margins.Bottom = 0;
lblNameContains.Margins.Left = 10;
lblNameContains.Margins.Right = 10;
lblNameContains.Margins.Top = 0;
lblNameContains.Left = 12;
lblNameContains.Top = 157;
lblNameContains.Anchors = new Set([0, 1, 2]);
//-- lblNameContains #def_ends

//-- cbPanelNames #def_starts
var cbPanelNames = UI.components.NewComboBox(MainForm, gbPanel);
cbPanelNames.Style.Edges = new Set([0, 1, 2, 3]);
cbPanelNames.Style.BorderColor = 0;
cbPanelNames.Style.Font.Color = -16777208;
cbPanelNames.Style.Font.Size = 9;
cbPanelNames.Style.Font.Name = 'Segoe UI';
cbPanelNames.Style.Font.Style = new Set([]);
cbPanelNames.Style.TextStyle = new Set([]);
cbPanelNames.Style.BorderStyle = 4;
cbPanelNames.Style.Color = 16777215;
cbPanelNames.Width = 231;
cbPanelNames.Height = 25;
with (cbPanelNames.Properties.Items) { }
cbPanelNames.Properties.ImmediatePost = true;
cbPanelNames.AlignWithMargins = true;
cbPanelNames.Margins.Bottom = 5;
cbPanelNames.Margins.Left = 10;
cbPanelNames.Margins.Right = 10;
cbPanelNames.Margins.Top = 0;
cbPanelNames.Left = 12;
cbPanelNames.Top = 132;
cbPanelNames.Anchors = new Set([0, 1, 2]);
cbPanelNames.Properties.Sorted = true;
cbPanelNames.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbPanelNames #def_ends

//-- lblPanelNames #def_starts
var lblPanelNames = UI.components.NewLabel(MainForm, gbPanel);
lblPanelNames.Style.Edges = new Set([0, 1, 2, 3]);
lblPanelNames.Style.BorderColor = 0;
lblPanelNames.Style.Font.Color = -16777208;
lblPanelNames.Style.Font.Size = 9;
lblPanelNames.Style.Font.Name = 'Segoe UI';
lblPanelNames.Style.Font.Style = new Set([]);
lblPanelNames.Style.TextStyle = new Set([]);
lblPanelNames.Style.Color = 16777215;
lblPanelNames.Width = 94;
lblPanelNames.Height = 21;
lblPanelNames.Caption = 'Имена панелей';
lblPanelNames.Transparent = true;
lblPanelNames.Margins.Bottom = 0;
lblPanelNames.Margins.Left = 10;
lblPanelNames.Margins.Right = 10;
lblPanelNames.AlignWithMargins = true;
lblPanelNames.Margins.Top = 0;
lblPanelNames.Left = 12;
lblPanelNames.Top = 111;
lblPanelNames.Anchors = new Set([0, 1, 2]);
//-- lblPanelNames #def_ends

//-- cbMatArticle #def_starts
var cbMatArticle = UI.components.NewComboBox(MainForm, gbPanel);
cbMatArticle.Style.Edges = new Set([0, 1, 2, 3]);
cbMatArticle.Style.BorderColor = 0;
cbMatArticle.Style.Font.Color = -16777208;
cbMatArticle.Style.Font.Size = 9;
cbMatArticle.Style.Font.Name = 'Segoe UI';
cbMatArticle.Style.Font.Style = new Set([]);
cbMatArticle.Style.TextStyle = new Set([]);
cbMatArticle.Style.BorderStyle = 4;
cbMatArticle.Style.Color = 16777215;
cbMatArticle.Width = 231;
cbMatArticle.Height = 25;
with (cbMatArticle.Properties.Items) { }
cbMatArticle.Properties.ImmediatePost = true;
cbMatArticle.AlignWithMargins = true;
cbMatArticle.Margins.Bottom = 5;
cbMatArticle.Margins.Left = 10;
cbMatArticle.Margins.Right = 10;
cbMatArticle.Margins.Top = 0;
cbMatArticle.Left = 12;
cbMatArticle.Top = 86;
cbMatArticle.Anchors = new Set([0, 1, 2]);
cbMatArticle.Properties.Sorted = true;
cbMatArticle.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbMatArticle #def_ends

//-- lblMatArticle #def_starts
var lblMatArticle = UI.components.NewLabel(MainForm, gbPanel);
lblMatArticle.Style.Edges = new Set([0, 1, 2, 3]);
lblMatArticle.Style.BorderColor = 0;
lblMatArticle.Style.Font.Color = -16777208;
lblMatArticle.Style.Font.Size = 9;
lblMatArticle.Style.Font.Name = 'Segoe UI';
lblMatArticle.Style.Font.Style = new Set([]);
lblMatArticle.Style.TextStyle = new Set([]);
lblMatArticle.Style.Color = 16777215;
lblMatArticle.Width = 117;
lblMatArticle.Height = 21;
lblMatArticle.Caption = 'Артикул материала';
lblMatArticle.Transparent = true;
lblMatArticle.Margins.Bottom = 0;
lblMatArticle.Margins.Left = 10;
lblMatArticle.AlignWithMargins = true;
lblMatArticle.Margins.Top = 0;
lblMatArticle.Margins.Right = 10;
lblMatArticle.Left = 12;
lblMatArticle.Top = 65;
lblMatArticle.Anchors = new Set([0, 1, 2]);
//-- lblMatArticle #def_ends


//-- lblMaterialName #def_starts
var lblMaterialName = UI.components.NewLabel(MainForm, gbPanel);
lblMaterialName.Style.Edges = new Set([0, 1, 2, 3]);
lblMaterialName.Style.BorderColor = 0;
lblMaterialName.Style.Font.Color = -16777208;
lblMaterialName.Style.Font.Size = 9;
lblMaterialName.Style.Font.Name = 'Segoe UI';
lblMaterialName.Style.Font.Style = new Set([]);
lblMaterialName.Style.TextStyle = new Set([]);
lblMaterialName.Style.Color = 16777215;
lblMaterialName.Width = 93;
lblMaterialName.Height = 21;
lblMaterialName.Caption = 'Имя материала';
lblMaterialName.Transparent = true;
lblMaterialName.AlignWithMargins = true;
lblMaterialName.Margins.Bottom = 0;
lblMaterialName.Margins.Left = 10;
lblMaterialName.Margins.Right = 10;
lblMaterialName.Margins.Top = 0;
lblMaterialName.Anchors = new Set([0, 1]);
lblMaterialName.Left = 12;
lblMaterialName.Top = 19;
//-- lblMaterialName #def_ends

//-- cbCondition #def_starts
var cbCondition = UI.components.NewComboBox(MainForm, MainForm);
cbCondition.Style.Edges = new Set([0, 1, 2, 3]);
cbCondition.Style.BorderColor = 0;
cbCondition.Style.Font.Color = -16777208;
cbCondition.Style.Font.Size = 9;
cbCondition.Style.Font.Name = 'Segoe UI';
cbCondition.Style.Font.Style = new Set([]);
cbCondition.Style.TextStyle = new Set([]);
cbCondition.Style.BorderStyle = 4;
cbCondition.Style.Color = 16777215;
cbCondition.Width = 75;
cbCondition.Height = 25;
with (cbCondition.Properties.Items) {
    Add('И (&&)');
    Add('ИЛИ (||)');
}
cbCondition.Properties.ImmediatePost = true;
cbCondition.Properties.DropDownListStyle = 2;
cbCondition.Text = 'И (&&)';
cbCondition.ItemIndex = 0;
cbCondition.Left = 141;
cbCondition.Top = 10;
cbCondition.Anchors = new Set([0, 1]);
cbCondition.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbCondition #def_ends

//-- lblCondition #def_starts
var lblCondition = UI.components.NewLabel(MainForm, MainForm);
lblCondition.Style.Edges = new Set([0, 1, 2, 3]);
lblCondition.Style.BorderColor = 0;
lblCondition.Style.Font.Color = -16777208;
lblCondition.Style.Font.Size = 9;
lblCondition.Style.Font.Name = 'Segoe UI';
lblCondition.Style.Font.Style = new Set([]);
lblCondition.Style.TextStyle = new Set([]);
lblCondition.Style.Color = 16777215;
lblCondition.Width = 124;
lblCondition.Height = 21;
lblCondition.Caption = 'Условие выделения:';
lblCondition.Transparent = true;
lblCondition.Left = 11;
lblCondition.Top = 10;
//-- lblCondition #def_ends



//-- cbMaterialName #def_starts
var cbMaterialName = UI.components.NewComboBox(MainForm, gbPanel);
cbMaterialName.Style.Edges = new Set([0, 1, 2, 3]);
cbMaterialName.Style.BorderColor = 0;
cbMaterialName.Style.Font.Color = -16777208;
cbMaterialName.Style.Font.Size = 9;
cbMaterialName.Style.Font.Name = 'Segoe UI';
cbMaterialName.Style.Font.Style = new Set([]);
cbMaterialName.Style.TextStyle = new Set([]);
cbMaterialName.Style.BorderStyle = 4;
cbMaterialName.Style.Color = 16777215;
cbMaterialName.Width = 231;
cbMaterialName.Height = 25;
with (cbMaterialName.Properties.Items) { }
cbMaterialName.Properties.ImmediatePost = true;
cbMaterialName.AlignWithMargins = true;
cbMaterialName.Margins.Bottom = 5;
cbMaterialName.Margins.Left = 10;
cbMaterialName.Margins.Right = 10;
cbMaterialName.Margins.Top = 0;
cbMaterialName.Left = 12;
cbMaterialName.Top = 40;
cbMaterialName.Anchors = new Set([0, 1]);
cbMaterialName.Properties.Sorted = true;
cbMaterialName.Properties.OnEditValueChanged = function (Sender) {
    DoValueChanged();
}
//-- cbMaterialName #def_ends

//////////////////////////////////////////////////////////

currentFileData.model.UnSelectAll();

var Item = [];
var ItemAnd = [];
var ItemOr = [];
let conditionAnd = false;
let caseSensitive = false;

const AND_CONDITINON_INDEX = 0;
const CASE_SENSETIVE_TRUE = 'Поиск чувствителен к регистру';
const CASE_SENSITIVE_FALSE = 'Поиск НЕ чувствителен к регистру';

/** Обновление метки с текущим регистром */
function UpdateCaseLabel() {
    if (caseSensitive) {
        lblCase.Caption = CASE_SENSETIVE_TRUE;
        lblCase.Style.TextColor = 0x4C9900;
    } else {
        lblCase.Caption = CASE_SENSITIVE_FALSE;
        lblCase.Style.TextColor = 0x0000FF;
    }
}

/**
 * Проверка на принадлежность отверстия панели
 * @param {THole} hole Проверяемое отверстие
 * @param {TFastener} fast Фурнитура, к которой относится отверстие
 * @param {TFurnPanel} panel Панель, принадлежность к которой проверяется
 * @returns {boolean}
 */
function CheckHole(hole, fast, panel) {
    let holeCenter = fast.ToGlobal({
        x: hole.Position.x + hole.Direction.x * (hole.Depth / 2),
        y: hole.Position.y + hole.Direction.y * (hole.Depth / 2),
        z: hole.Position.z + hole.Direction.z * (hole.Depth / 2),
    });

    holeCenter = panel.ToObject(holeCenter);
    return (holeCenter.x > panel.GMin.x) && (holeCenter.x < panel.GMax.x) &&
        (holeCenter.y > panel.GMin.y) && (holeCenter.y < panel.GMax.y) &&
        (holeCenter.z > panel.GMin.z) && (holeCenter.z < panel.GMax.z);
}

/**
 * Перебор панелей
 * @param {string} value Текущее значение с которым сравниваются панели
 * @param {object} func Функция проверки
 */
function IteratePanels(value, func) {
    if (value != '') {
        ItemAnd = [];
        Item.forEach(panel => {
            if (func(panel)) {
                if (conditionAnd) {
                    if (!ItemAnd.includes(panel)) ItemAnd.push(panel);
                } else {
                    if (!ItemOr.includes(panel)) ItemOr.push(panel);
                }
            }
        });
        if (conditionAnd) Item = ItemAnd;
    }
}

/**
 * Перебор панелей и вложенных в них свойств
 * @param {string} value Текущее значение
 * @param {object} funcCompare Функция проверки
 * @param {object} funcGetCount Функция для получения количества перебираемых элементов
 */
function IteratePanelsProperties(value, funcCompare, funcGetCount) {
    if (value != '') {
        ItemAnd = [];
        Item.forEach(panel => {
            for (let i = 0; i < funcGetCount(panel); i++) {
                if (funcCompare(panel, i)) {
                    if (conditionAnd) {
                        if (!ItemAnd.includes(panel)) ItemAnd.push(panel);
                    } else {
                        if (!ItemOr.includes(panel)) ItemOr.push(panel);
                    }
                }
            }
        });
        if (conditionAnd) Item = ItemAnd;
    }
}


/** Выборка панелей по материалу */
function SelectMaterialPanel() {
    let value = cbMaterialName.Text;
    IteratePanels(value, panel => {
        return value == materialData.ExtractMaterialName(panel.MaterialName);
    });
}

/** Выборка панелей артикулу материала */
function SelectArticleMaterialPanel() {
    let value = cbMatArticle.Text;
    IteratePanels(value, panel => {
        return value == materialData.ExtractMaterialCode(panel.MaterialName);
    });
}

/** Выборка панелей по имени */
function SelectNames() {
    let value = cbPanelNames.Text;
    IteratePanels(value, panel => {
        return value == panel.Name;
    });
}

/** Выборка панелей по тексту в их имени */
function SelectContains() {
    let value = edtNameContains.Text;
    IteratePanels(value, panel => {
        let result;
        if (caseSensitive)
            result = panel.Name.includes(value)
        else
            result = panel.Name.toLowerCase().includes(value.toLowerCase());
        return result;
    });
}

/** Выборка панелей по позиции */
function SelectPanelPos() {
    let value = cbPanelPosition.Text;
    IteratePanels(value, panel => {
        return value == panel.ArtPos;
    });
}

/** Выборка панелей по обозначению */
function SelectPanelDesignation() {
    let value = cbPanelDesignation.Text;
    IteratePanels(value, panel => {
        return value == panel.Designation;
    });
}

/** Выделение панелей по толщине */
function SelectPanelThickness() {
    let value = cbPanelThickess.Text;
    IteratePanels(value, panel => {
        return value == panel.Thickness;
    });
}

/** Выборка панелей по пластику */
function SelectPanelPlastic() {
    let value = cbPanelPlastic.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            return value == materialData.ExtractMaterialName(panel.Plastics[index].Material);
        },
        (panel) => {
            return panel.Plastics.Count;
        });
}

/** Выборка панелей по пользовательским свойствам */
function SelectPanelUserProperty() {
    let value = cbUserProperties.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            let prop = panel.UserPropertyName[index] +
                ' = "' + panel.UserProperty[index].toString().trim() + '"';
            return value == prop;
        },
        (panel) => {
            return panel.UserPropCount;
        });
}

/** Выборка кромок по материалу */
function SelectButtMaterials() {
    let value = cbButtMaterial.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            let matName = materialData.ExtractMaterialName(panel.Butts.Butts[index].Material);
            return value == matName;
        },
        (panel) => {
            return panel.Butts.Count;
        });
}

/** Выборка кромок по обозначению */
function SelectButts() {
    let value = cbButtType.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            let sign = panel.Butts.Butts[index].Sign;
            return value == sign;
        },
        (panel) => {
            return panel.Butts.Count;
        });
}

/** Выборка кромок по толщине */
function SelectThicknessButts() {
    let value = cbButtThickness.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            let thickness = panel.Butts.Butts[index].Thickness;
            return value == thickness;
        },
        (panel) => {
            return panel.Butts.Count;
        });
}

/** Выборка пазов */
function SelectCuts() {
    let value = cbCuts.Text;
    IteratePanelsProperties(value,
        (panel, index) => {
            let sign = panel.Cuts[index].Sign;
            return value == sign;
        },
        (panel) => {
            return panel.Cuts.Count;
        })
}

/** Выборка фурнитуры */
function SelectFurnsAndHoles() {
    function Add(panel, item) {
        if (conditionAnd) {
            if (!ItemAnd.includes(panel))
                ItemAnd.push(panel);
            if (!ItemAnd.includes(item))
                ItemAnd.push(item);
        } else {
            if (!ItemOr.includes(panel))
                ItemOr.push(panel);
            if (!ItemOr.includes(item))
                ItemOr.push(item);
        }
    }

    let furnValue = cbFurnitureName.Text;
    let holeValue = cbHoles.Text;
    if (furnValue != '' || holeValue != '') {
        ItemAnd = [];
        Item.forEach(panel => {
            let fasts = fastenerOperations.FindConnectedFasteners(panel);
            if (fasts) {
                fasts.forEach((fast) => {
                    let matName = materialData.ExtractMaterialName(fast.Name);
                    if (furnValue == matName)
                        Add(panel, fast);
                    if (fast.Holes) {
                        for (let i = 0; i < fast.Holes.Count; i++) {
                            let hole = fast.Holes[i];
                            if (CheckHole(hole, fast, panel)) {
                                let holeSign = 'D ' + hole.Diameter.toFixed(1) +
                                    ' x ' + hole.Depth.toFixed(1);
                                if (holeValue == holeSign)
                                    Add(panel, fast);
                            }
                        }
                    }
                })
            }
        });
    }
}

/** Запуск выборки и последующего выделения по заданным критериям */
function SelectMask() {
    pnCount.Visible = true;
    currentFileData.model.UnSelectAll();

    let SumStr =
        cbMaterialName.Text +
        cbMatArticle.Text +
        cbPanelThickess.Text +
        cbPanelNames.Text +
        edtNameContains.Text +
        cbPanelPosition.Text +
        cbPanelDesignation.Text +
        cbPanelPlastic.Text +
        cbUserProperties.Text +
        cbButtMaterial.Text +
        cbButtType.Text +
        cbButtThickness.Text +
        cbCuts.Text +
        cbFurnitureName.Text +
        cbHoles.Text;

    if (SumStr.trim() == '') {
        Item = [];
        currentFileData.model.UnSelectAll();
    } else {
        Item = [];
        batchProcessing.ForEachObjectInList(currentFileData.model, (panel) => {
            Item.push(panel);
        }, true, [objectTypeChecker.ObjectTypeValue.panel]);

        SelectMaterialPanel();
        SelectArticleMaterialPanel();
        SelectPanelThickness();
        SelectNames();
        SelectContains();
        SelectPanelPos();
        SelectPanelDesignation();
        SelectPanelPlastic();
        SelectPanelUserProperty();

        SelectButtMaterials();
        SelectButts();
        SelectThicknessButts();

        SelectFurnsAndHoles();

        SelectCuts();

        if (conditionAnd)
            Item = ItemAnd
        else
            Item = ItemOr;

        for (let i = 0; i < Item.length; i++) {
            Item[i].Selected = true;
        }
    }

    edtCount.EditValue = Item.length;
    ItemOr = [];
}


/** 
 * Добавить значение в компонент TcxComboBox
 * @param {string} value Значение
 * @param {TcxComboBox} component Компонент, в который добавляется значение
 */
function AddValueToCombo(value, component) {
    let values = component.Properties.Items.ToStringArray() || Array();
    if (!values.includes(String(value)))
        component.Properties.Items.Add(value);
}

/**
 * Перебор панелей на наличие фурнитуры и отверстий, добавление их в 
 * соответствующие компоненты
 * @param {TFurnPanel} panel Панель
 */
function ParseFurnsAndHoles(panel) {
    let fasts = fastenerOperations.FindConnectedFasteners(panel);
    for (let i = 0; i < fasts.length; i++) {
        let fast = fasts[i];
        let fastSign = materialData.ExtractMaterialName(fast.Name);
        AddValueToCombo(fastSign, cbFurnitureName);
        let holes = fast.Holes;
        if (holes && holes.Count > 0) {
            for (let j = 0; j < holes.Count; j++) {
                let hole = holes[j];
                if (CheckHole(hole, fast, panel)) {
                    let holeSign = 'D ' + hole.Diameter.toFixed(1) + ' x ' + hole.Depth.toFixed(1);
                    AddValueToCombo(holeSign, cbHoles);
                }
            }
        }
    }
}

/** Перебор панелей и заполнение компонентов данными */
function FillComponents() {
    UpdateCaseLabel();
    AddValueToCombo('', cbMaterialName);
    AddValueToCombo('', cbMatArticle);
    AddValueToCombo('', cbPanelPosition);
    AddValueToCombo('', cbPanelDesignation);
    AddValueToCombo('', cbPanelThickess);
    AddValueToCombo('', cbPanelNames);
    AddValueToCombo('', cbPanelPlastic);
    AddValueToCombo('', cbUserProperties);
    AddValueToCombo('', cbButtMaterial);
    AddValueToCombo('', cbButtType);
    AddValueToCombo('', cbButtThickness);
    AddValueToCombo('', cbCuts);
    AddValueToCombo('', cbFurnitureName);
    AddValueToCombo('', cbHoles);

    batchProcessing.ForEachObjectInList(currentFileData.model,
        /**
         * Обратный вызов для обработки данных панели
         * @param {TFurnPanel} panel 
         */
        function (panel) {
            ParseFurnsAndHoles(panel);

            let matName = materialData.ExtractMaterialName(panel.MaterialName);
            AddValueToCombo(matName, cbMaterialName);

            let matArticle = materialData.ExtractMaterialCode(panel.MaterialName);
            AddValueToCombo(matArticle, cbMatArticle);

            let panelPos = panel.ArtPos;
            AddValueToCombo(panelPos, cbPanelPosition);

            let sign = panel.Designation;
            AddValueToCombo(sign, cbPanelDesignation);

            let panelThickness = panel.Thickness;
            AddValueToCombo(String(panelThickness), cbPanelThickess);

            let name = panel.Name;
            AddValueToCombo(name, cbPanelNames);

            for (let i = 0; i < panel.Plastics.Count; i++) {
                let plasticMatName = materialData.ExtractMaterialName(panel.Plastics[i].Material);
                AddValueToCombo(plasticMatName, cbPanelPlastic);
            }

            for (let i = 0; i < panel.UserPropCount; i++) {
                let propName = panel.UserPropertyName[i] + ' = "' + materialData.ExtractMaterialName(String(panel.UserProperty[i])) + '"';
                AddValueToCombo(propName, cbUserProperties);
            }

            for (let i = 0; i < panel.Butts.Count; i++) {
                let buttMatName = materialData.ExtractMaterialName(panel.Butts.Butts[i].Material);
                AddValueToCombo(buttMatName, cbButtMaterial);
                AddValueToCombo(panel.Butts.Butts[i].Sign, cbButtType);
                AddValueToCombo(panel.Butts[i].Thickness, cbButtThickness);
            }

            for (let i = 0; i < panel.Cuts.Count; i++) {
                let sign = panel.Cuts[i].Sign;
                AddValueToCombo(sign, cbCuts);
            }
        }, true, [objectTypeChecker.ObjectTypeValue.panel]);
}

/** Проверка текущего условия выбора и вызов выборки и выделения панелей */
function DoValueChanged() {
    conditionAnd = cbCondition.ItemIndex == AND_CONDITINON_INDEX;
    SelectMask();
}

/** Выбор панелей с не прямоугольным контуром */
function DoNonRectangularContourSelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, (panel) => {
        if (!panel.Contour.IsContourRectangle()) panel.Selected = true;
    }, true, [objectTypeChecker.ObjectTypeValue.panel])
}

/** Выбор панелей с округлым контуром */
function DoRoundContourSelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, (panel) => {
        for (let i = 0; i < panel.Contour.Count; i++) {
            switch (panel.Contour[i].ElType) {
                case 2:
                case 3:
                    panel.Selected = true;
                    break;
            }
        }
    }, true, [objectTypeChecker.ObjectTypeValue.panel]);
}

/** Выбор панелей с профилем */
function DoProfileSelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, (obj) => {
        obj.Selected = true;
    }, true, [objectTypeChecker.ObjectTypeValue.extrusion]);
}

/** Выбор тел по траектории */
function DoBodyTrajectorySelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, (obj) => {
        obj.Selected = true;
    }, true, [objectTypeChecker.ObjectTypeValue.trajectoryBody]);
}

/** Выбор тел вращения */
function DoRotationBodySelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, (obj) => {
        obj.Selected = true;
    }, true, [objectTypeChecker.ObjectTypeValue.rotationBody]);
}

/** Выбор габаритных рамок */
function DoGabaritFramesSelection() {
    let gabaritCount = 0;
    batchProcessing.ForEachObjectInList(currentFileData.model, (obj) => {
        obj.Selected = true;
        gabaritCount++;
    }, true, [objectTypeChecker.ObjectTypeValue.limits]);
    edtCount.Text = String(Number(edtCount.Text) + gabaritCount);
}

/** Отмена выделения */
function DoCancelSelection() {
    currentFileData.model.UnSelectAll();
    edtCount.Text = '0';
}

/** Инверсия выбора */
function DoInvertSelection() {
    pnCount.Visible = false;
    batchProcessing.ForEachObjectInList(currentFileData.model, obj => {
        obj.Selected = !obj.Selected;
    }, true, [objectTypeChecker.ObjectTypeValue.panel,
    objectTypeChecker.ObjectTypeValue.extrusion,
    objectTypeChecker.ObjectTypeValue.trajectoryBody,
    objectTypeChecker.ObjectTypeValue.fastener])
}

FillComponents();

execution.ContinueExecution();