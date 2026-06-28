var kosyak = [];

Model.forEachPanel(function (obj) {
		if (obj.ContourWidth > 1100 && obj.ContourHeight > 1100) {
			kosyak.push(obj.Name + ' № поз. : ' + obj.ArtPos + ' - гиганская (' + obj.ContourWidth + 'x' + obj.ContourHeight + ')\n');
			obj.Selected = true;
		} else if (obj.ContourWidth <= 180 && obj.ContourHeight <= 180) {
			kosyak.push(obj.Name + ' № поз. : ' + obj.ArtPos + ' - мелкая (' + obj.ContourWidth + 'x' + obj.ContourHeight + ')\n');
			obj.Selected = true;
		} else if (obj.Cuts.Count > 0) {
			kosyak.push(obj.Name + ' № поз. : ' + obj.ArtPos + ' - с пазами,усами: ' + obj.Cuts.Count + ' пазов.\n');
			obj.Selected = true;
		} else if (obj.IsContourRectangle == false) {
			kosyak.push(obj.Name + ' № поз. : ' + obj.ArtPos + ' - Кривая.\n');
			obj.Selected = true;
		}
	}
);
if (kosyak != '') {
		alert('Записывайте, мистер \n\n' + kosyak);
	} else {
		alert('Поздравляем, ничего косячного нету.')
	}