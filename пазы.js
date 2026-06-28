function Cut (pan,num){
	var cut = pan.AddCut('Паз (4х8x' + num +')'); // добавим паз
	var traj = cut.Trajectory; // траектория фрезы
	StartEditing(pan);  // редактировать панель
	switch (pan){
		case toppan:
			traj.AddLine(pan.GMin.x,- num, pan.GMax.x, - num);  // горизонтальная линия
			cut.Contour.AddRectangle(0, 0, -4, 8);
			break;
		case bottom:
			traj.AddLine(pan.GMin.x, - num, pan.GMax.x , - num);  // горизонтальная линия
			cut.Contour.AddRectangle(-4, 8, 0, 16); // нижний паз
			break;
		case panelL:
			traj.AddLine(num, 0, num , H);     // вертикальная линия
			cut.Contour.AddRectangle(0, 0, -4, 8); // левый паз
			break;
		case panelR:
			traj.AddLine(num, 0, num ,H);     // вертикальная линия
			cut.Contour.AddRectangle(-4, 8, 0, 16); // правый паз
			break;
	}
}