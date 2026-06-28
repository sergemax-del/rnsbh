Points = [];

function Profile()
{
  var C = NewContour();
  C.AddRectangle(0, 0, 10, 10);
  return C;
}

function MakePlintus()
{
  Prof = Profile();
  for (k = 1; k < Points.length; k++)
  {
    P1 = Points[k-1];
    P2 = Points[k];
    Dir = sub(P2, P1);;
    Length = length(Dir);
    if (Length < 1)
      continue;

    NormDir = unit(Dir);
    E = AddExtrusion('Профиль_' + k);
    E.Contour.Addition(Prof);
    E.Position = P1;
    E.Orient(NormDir, AxisY);
    E.Thickness = Length;

    system.log('Extrusion: ' + k + ' length = ' + Length);

    if (k > 1)
    {
      P0 = E.ToObject(Points[k - 2]);
      Dir0 = neg(P0);
      Dir0Norm = unit(Dir0);
      Dir0Norm.z = Dir0Norm.z + 1;
      MiddleDir = unit(Dir0Norm);
      E.Clip(NewVector(), MiddleDir);
      system.log('start clip');
      logdir('Plane=', MiddleDir);
    }

    if (k < Points.length - 1)
    {
      P3 = E.ToObject(Points[k + 1]);
      Dir2 = sub(P3, NewVector(0, 0, Length));
      Dir2Norm = unit(Dir2);
      Dir2Norm.z =  Dir2Norm.z + 1;
      MiddleDir = unit(Dir2Norm);
      E.Clip(NewVector(0, 0, Length), neg(MiddleDir));
      system.log('end clip');
      logdir('Plane=', MiddleDir);
    }


    system.log('success!');
    E.Build();
  }
}

StartP = GetPoint("Укажите точку 1");
Points.push(StartP);
NewButtonInput("Закончить").OnChange = function() { Action.Finish(); };
Index = 2;

while (true)
{
  P = GetPoint("Укажите точку " + Index);
  Index += 1;
  P.y = StartP.y;
  Points.push(P);
  DeleteNewObjects();
  MakePlintus();
}

function sub(a, b)
{
  return NewVector(a.x - b.x, a.y - b.y, a.z - b.z);
}

function add(a, b)
{
  return NewVector(a.x + b.x, a.y + b.y, a.z + b.z);
}

function length(a)
{
  return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
}

function neg(a)
{
  return NewVector(-a.x, -a.y, -a.z);
}

function unit(a)
{
  var l1 = 1.0 / length(a);
  return NewVector(a.x * l1, a.y * l1, a.z * l1);
}

function logdir(text, dir)
{
  system.log(text + ' (' + dir.x + ', ' + dir.y + ', ' + dir.z + ')');
}