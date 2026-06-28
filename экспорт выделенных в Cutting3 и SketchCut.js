/*
экспорт в файл для Cutting3 в формате .tc3 - один файл на все панели и материалы.
файл загружать через "импорт текстовых файлов"
список материалов создается в нескольких размерностях листов для каждого из материалов,
неиспользуемые необходимо удалить в самой программе раскроя.
возможно выгружать только список панелей.

экспорт в файл для SketchCut в формате .sct - в зависимости от разнообразия материалов выделенных панелей,
будет создан комплект файлов, каждый для своего материала.

для использовании в Базис 8 и возможно в Базси 9-10 (нет возможности проверить) закомментировать "const fs = require('fs');" (3шт) и "fs.writeFileSync..........." (3шт)
и расскоментировать строки "system.writeTextFile......... (3шт)
*/
//***************************************************************************//
//путь к папке сохранения
var dir_file =  'D:/';
//***************************************************************************//
function ExtractMatNameBazis8(text){
    var text_out = text.split('\r');
    return text_out[0];
}
//***************************************************************************//
function ListSize(panel) {
	var res = {
        L1_thick: '',
        L2_thick: '',
        W1_thick: '',
        W2_thick: '',
        L_wb: 0,
        W_wb: 0,
		L_nb: 0,
		W_nb: 0,
		L_nbwa: 0,
		W_nbwa: 0
    };
    var copy_panel = AddCopy(panel);
    if ((copy_panel.TextureOrientation == 2) || ((copy_panel.TextureOrientation == 0) && (copy_panel.ContourHeight > copy_panel.ContourWidth))) {
        copy_panel.Contour.Rotate(0, 0, 90);
    }
    copy_panel.Build();
    var cont_x1 = -2000000;
    var cont_x2 = 2000000;
    var cont_y1 = -2000000;
    var cont_y2 = 2000000;
    for (var i = 0; i < copy_panel.Contour.Count; ++i) {
        if (copy_panel.Contour.Objects[i] instanceof T2DLine){
            cont_x1 = +Math.min(cont_x1, copy_panel.Contour.Objects[i].Pos1.x).toFixed(3);
            cont_x1 = +Math.min(cont_x1, copy_panel.Contour.Objects[i].Pos2.x).toFixed(3);
            cont_x2 = +Math.max(cont_x2, copy_panel.Contour.Objects[i].Pos1.x).toFixed(3);
            cont_x2 = +Math.max(cont_x2, copy_panel.Contour.Objects[i].Pos2.x).toFixed(3);
            cont_y1 = +Math.min(cont_y1, copy_panel.Contour.Objects[i].Pos1.y).toFixed(3);
            cont_y1 = +Math.min(cont_y1, copy_panel.Contour.Objects[i].Pos2.y).toFixed(3);
            cont_y2 = +Math.max(cont_y2, copy_panel.Contour.Objects[i].Pos1.y).toFixed(3);
            cont_y2 = +Math.max(cont_y2, copy_panel.Contour.Objects[i].Pos2.y).toFixed(3);
        }
    }
    for (var i = 0; i < copy_panel.Contour.Count; ++i) {
        if (copy_panel.Contour.Objects[i] instanceof T2DLine){
            var elem_x1 = +Math.min(copy_panel.Contour.Objects[i].Pos1.x, copy_panel.Contour.Objects[i].Pos2.x).toFixed(3);
            var elem_x2 = +Math.max(copy_panel.Contour.Objects[i].Pos1.x, copy_panel.Contour.Objects[i].Pos2.x).toFixed(3);
            var elem_y1 = +Math.min(copy_panel.Contour.Objects[i].Pos1.y, copy_panel.Contour.Objects[i].Pos2.y).toFixed(3);
            var elem_y2 = +Math.max(copy_panel.Contour.Objects[i].Pos1.y, copy_panel.Contour.Objects[i].Pos2.y).toFixed(3);
            var elem_length = +copy_panel.Contour.Objects[i].ObjLength().toFixed(3);
            var but_thick = 0;
            for (var r = 0; r < copy_panel.Butts.Count; ++r) {
                if(copy_panel.Butts[r].ElemIndex == i){
                but_thick = copy_panel.Butts[r].Thickness;
                }
            }
			if ((cont_x1 == elem_x1) && (cont_x2 == elem_x2) && (cont_y1 == elem_y1) && (cont_y1 == elem_y2) && (+copy_panel.ContourWidth.toFixed(3) == elem_length)) {
				res.L1_thick = but_thick;
			} else if ((cont_x1 == elem_x1) && (cont_x2 == elem_x2) && (cont_y2 == elem_y1) && (cont_y2 == elem_y2) && (+copy_panel.ContourWidth.toFixed(3) == elem_length)) {
				res.L2_thick = but_thick;
			} else if ((cont_x1 == elem_x1) && (cont_x1 == elem_x2) && (cont_y1 == elem_y1) && (cont_y2 == elem_y2) && (+copy_panel.ContourHeight.toFixed(3) == elem_length)) {
				res.W1_thick = but_thick;
			} else if ((cont_x2 == elem_x1) && (cont_x2 == elem_x2) && (cont_y1 == elem_y1) && (cont_y2 == elem_y2) && (+copy_panel.ContourHeight.toFixed(3) == elem_length)) {
				res.W2_thick = but_thick;
			}
        }
    }
    res.L_wb = +copy_panel.GSize.x.toFixed(3);
    res.W_wb = +copy_panel.GSize.y.toFixed(3);
    for (var i = 0; i < copy_panel.Butts.Count; ++i) {
        if (copy_panel.Butts[i].ClipPanel) {
            copy_panel.Butts[i].ClipPanel = false;
            copy_panel.Butts[i].Thickness = 0 - copy_panel.Butts[i].Thickness;
        } else {
            copy_panel.Butts[i].Thickness = 0;
        }
    }
    copy_panel.Build();
    res.L_nb = +copy_panel.GSize.x.toFixed(3);
    res.W_nb = +copy_panel.GSize.y.toFixed(3);
    for (var i = 0; i < panel.Butts.Count; ++i) {
        copy_panel.Butts[i].Thickness = copy_panel.Butts[i].Thickness + copy_panel.Butts[i].Allowance;
    }
    copy_panel.Build();
    res.L_nbwa = +copy_panel.GSize.x.toFixed(3);
    res.W_nbwa = +copy_panel.GSize.y.toFixed(3);
    DeleteObject(copy_panel);
    return res;
}
//***************************************************************************//
function ListBuild(){
    var num = 1;
    for (var i = 0; i < Model.SelectionCount; ++i) {
        if (Model.Selections[i] instanceof TFurnPanel) {
            var mask_material = ExtractMatNameBazis8(Model.Selections[i].MaterialName) + '//' + Model.Selections[i].Thickness;
            if (!list_material[mask_material]) {
                list_material[mask_material] = {material:ExtractMatNameBazis8(Model.Selections[i].MaterialName), thickness:Model.Selections[i].Thickness, num_material: num, count_sizes: 0, out_text: ''};
                ++num;
            }
            var panel_size = ListSize(Model.Selections[i]);
            if (Model.Selections[i].TextureOrientation == 0) {
                var texture_rotation = 1;
            } else {
                var texture_rotation = 0;
            }
            var pos_panel = '';
            if ((Model.Selections[i].Designation)&&(Model.Selections[i].Designation.length > 0)) {
                pos_panel = Model.Selections[i].Designation;
            } else {
                pos_panel = Model.Selections[i].ArtPos;
            }
            var mask_panel = list_material[mask_material].material + '//' + list_material[mask_material].thickness + '//' + list_material[mask_material].num_material + '//' + panel_size.L_nbwa + '//' + panel_size.W_nbwa + '//' + texture_rotation + '//' + pos_panel;
            if (list_panel[mask_panel]) {
                list_panel[mask_panel].count += 1;
            } else {
                list_panel[mask_panel] = {
                    name: Model.Selections[i].Name,
    				material: list_material[mask_material].material,
                    thickness: list_material[mask_material].thickness,
                    num_material: list_material[mask_material].num_material,
                    count: 1,
                    rotation: texture_rotation,
                    pos: pos_panel,
                    L: panel_size.L_nbwa,
                    W: panel_size.W_nbwa,
                    but_L1_thick: panel_size.L1_thick,
                    but_L2_thick: panel_size.L2_thick,
                    but_W1_thick: panel_size.W1_thick,
                    but_W2_thick: panel_size.W2_thick
                };
            }
            for (var r = 0; r < Model.Selections[i].Plastics.Count; ++r) {
                mask_material = ExtractMatNameBazis8(Model.Selections[i].Plastics[r].Material) + Model.Selections[i].Plastics[r].Thickness;
                if (!list_material[mask_material]) {
                    list_material[mask_material] = {material:ExtractMatNameBazis8(Model.Selections[i].Plastics[r].Material), thickness:Model.Selections[i].Plastics[r].Thickness, num_material: num};
                    ++num;
                }
                if (Model.Selections[i].Plastics[r].TextureOrientation == 0) {
                    texture_rotation = 1;
                } else {
                    texture_rotation = 0;
                }
                var pos_plastic = pos_panel + '_' + r;
                mask_panel = list_material[mask_material].material + '//' + list_material[mask_material].thickness + '//' + list_material[mask_material].num_material + '//' + panel_size.L_nbwa + '//' + panel_size.W_nbwa + '//' + texture_rotation + '//' + pos_plastic;
                if (list_panel[mask_panel]) {
                    list_panel[mask_panel].count += 1;
                } else {
                    list_panel[mask_panel] = {
    					name: Model.Selections[i].Name,
                        material: list_material[mask_material].material,
    					thickness: list_material[mask_material].thickness,
    					num_material: list_material[mask_material].num_material,
    					count: 1,
    					rotation: texture_rotation,
    					pos: pos_plastic,
    					L: panel_size.L_nbwa,
    					W: panel_size.W_nbwa,
    					but_L1_thick: panel_size.L1_thick,
    					but_L2_thick: panel_size.L2_thick,
    					but_W1_thick: panel_size.W1_thick,
    					but_W2_thick: panel_size.W2_thick
                    };
                }
            }
        }
    }
}
//***************************************************************************//
props = Action.Properties;
cutting_with_mat = props.NewButton('Cutting3 с материалами');
cutting_no_mat = props.NewButton('Cutting3 без материалов');
sketch_cut = props.NewButton('SketchCut');
cancel = props.NewButton('Отмена');
Action.Continue();
var list_panel = {};
var list_material = {};
var zakaz_name = Action.Control.Article.OrderName;
var model_name = Action.Control.Article.Name;
//***************************************************************************//
cutting_with_mat.OnClick = function() {
ListBuild();
var out_material = '[Material]\r\n';
var out_panel = '[Detail]\r\n';
//составляем список материалов
for (var i in list_material) {
    out_material += '2440' + ' ' + '1830' + ' ' + list_material[i].num_material + ' ' + '100' + ' ' + '0' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + list_material[i].material + '\r\n';
    out_material += '2750' + ' ' + '1830' + ' ' + list_material[i].num_material + ' ' + '100' + ' ' + '0' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + list_material[i].material + '\r\n';
    out_material += '2800' + ' ' + '2070' + ' ' + list_material[i].num_material + ' ' + '100' + ' ' + '0' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + list_material[i].material + '\r\n';
    out_material += '3500' + ' ' + '1750' + ' ' + list_material[i].num_material + ' ' + '100' + ' ' + '0' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + '20' + ' ' + list_material[i].material + '\r\n';
}
//составляем список панелей
for (var i in list_panel) {
out_panel += list_panel[i].L + ' ' + list_panel[i].W + ' ' + list_panel[i].num_material + ' ' + list_panel[i].count + ' ' + list_panel[i].rotation + ' ' + list_panel[i].pos + '\r\n';
}
//system.writeTextFile(dir_file + zakaz_name + '_' + model_name + '_' + '.tc3', out_material + out_panel);
const fs = require('fs');
fs.writeFileSync(dir_file + zakaz_name + '_' + model_name + '_' + '.tc3',  out_material + out_panel, {encoding: 'utf8'});
Action.Finish();
}
//***************************************************************************//
cutting_no_mat.OnClick = function() {
ListBuild();
var out_material = '[Material]\r\n';
var out_panel = '[Detail]\r\n';
//составляем список панелей
for (var i in list_panel) {
out_panel += list_panel[i].L + ' ' + list_panel[i].W + ' ' + list_panel[i].num_material + ' ' + list_panel[i].count + ' ' + list_panel[i].rotation + ' ' + list_panel[i].pos + '\r\n';
}
//system.writeTextFile(dir_file + zakaz_name + '_' + model_name + '_' + '.tc3',  out_material + out_panel);
const fs = require('fs');
fs.writeFileSync(dir_file + zakaz_name + '_' + model_name + '_' + '.tc3',  out_material + out_panel, {encoding: 'utf8'});
Action.Finish();
}
//***************************************************************************//
sketch_cut.OnClick = function() {
ListBuild();
var out_text = '';
for (var i in list_panel) {
    var mask_mat = list_panel[i].material + '//' + list_panel[i].thickness;

    list_material[mask_mat].count_sizes += 1;

    list_material[mask_mat].out_text += list_panel[i].L + 'X' + list_panel[i].W + 'X' + list_panel[i].count + '\r\n';

	if ((list_panel[i].but_L1_thick=='')&&(list_panel[i].but_L2_thick=='')){
		list_material[mask_mat].out_text += '0X'
	}
	else if ((list_panel[i].but_L1_thick>1)&&(list_panel[i].but_L2_thick=='')){
		list_material[mask_mat].out_text += '1X'
	}
	else if ((list_panel[i].but_L1_thick=='')&&(list_panel[i].but_L2_thick>1)){
		list_material[mask_mat].out_text += '1X'
	}
	else if ((list_panel[i].but_L1_thick>1)&&(list_panel[i].but_L2_thick>1)){
		list_material[mask_mat].out_text += '2X'
	}
	else if ((list_panel[i].but_L1_thick<1)&&(list_panel[i].but_L2_thick=='')){
		list_material[mask_mat].out_text += '3X'
	}
	else if ((list_panel[i].but_L1_thick=='')&&(list_panel[i].but_L2_thick<1)){
		list_material[mask_mat].out_text += '3X'
	}
	else if ((list_panel[i].but_L1_thick<1)&&(list_panel[i].but_L2_thick<1)){
		list_material[mask_mat].out_text += '4X'
	}
	else if ((list_panel[i].but_L1_thick<1)&&(list_panel[i].but_L2_thick>1)){
		list_material[mask_mat].out_text += '5X'
	}
	else if ((list_panel[i].but_L1_thick>1)&&(list_panel[i].but_L2_thick<1)){
		list_material[mask_mat].out_text += '5X'
	}
	else{
		list_material[mask_mat].out_text += '0X'
	}

	if ((list_panel[i].but_W1_thick=='')&&(list_panel[i].but_W2_thick=='')){
		list_material[mask_mat].out_text += '0_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick>1)&&(list_panel[i].but_W2_thick=='')){
		list_material[mask_mat].out_text += '1_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick=='')&&(list_panel[i].but_W2_thick>1)){
		list_material[mask_mat].out_text += '1_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick>1)&&(list_panel[i].but_W2_thick>1)){
		list_material[mask_mat].out_text += '2_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick<1)&&(list_panel[i].but_W2_thick=='')){
		list_material[mask_mat].out_text += '3_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick=='')&&(list_panel[i].but_W2_thick<1)){
		list_material[mask_mat].out_text += '3_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick<1)&&(list_panel[i].but_W2_thick<1)){
		list_material[mask_mat].out_text += '4_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick<1)&&(list_panel[i].but_W2_thick>1)){
		list_material[mask_mat].out_text += '5_0X0\r\n'
	}
	else if ((list_panel[i].but_W1_thick>1)&&(list_panel[i].but_W2_thick<1)){
		list_material[mask_mat].out_text += '5_0X0\r\n'
	}
	else{
		list_material[mask_mat].out_text += '0_0X0\r\n'
	}

	list_material[mask_mat].out_text += list_panel[i].rotation + '0' + list_panel[i].name + '\r\n';

	for (var r=0; r < list_panel[i].count; ++r){
		list_material[mask_mat].out_text += '000_-1X-1X-1\r\n';
	}
}
const fs = require('fs');
for (var i in list_material) {
    list_material[i].out_text = '<V3.0>\r\n1\r\n0X0_0\r\n1X5X10_True\r\n'+zakaz_name+'\r\n\r\n\r\n'+list_material[i].material+'\r\n'+list_material[i].thickness+'\r\n2\r\n\r\n0.4\r\n\r\n1\r\n'+model_name+'\r\n<Parts>'+list_material[i].count_sizes+'\r\n'+list_material[i].out_text;
    list_material[i].out_text += '<USnips>0\r\n<NSnips>0\r\n8\r\n15\r\n4\r\n';
    //system.writeTextFile(dir_file + zakaz_name + '_' + model_name + '_' + list_material[i].material + '.sct',  list_material[i].out_text);
    fs.writeFileSync(dir_file + zakaz_name + '_' + model_name + '_' + list_material[i].material + '.sct',  list_material[i].out_text, {encoding: 'utf8'});
}
Action.Finish();
}
//***************************************************************************//
cancel.OnClick = function() {
Action.Finish();
}