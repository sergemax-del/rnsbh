



ft = system.askReadTextFile('dxf')
ft = ft.replace(/\r/g, '')
izDXF(ft)


function izDXF(data) {



// l2_x1 = "6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbLine\n 10\n"
l2_x1 = "AcDbLine\n 10\n"
//alert(l2_x1)
l3_y1 = " 20\n"
l4_x2 = " 11\n"
l5_y2 = " 21\n"

a1_sloy = " 0\nARC\n 5\n110D2\n330\n1F\n100\nAcDbEntity\n 8\n"

// a2_cX = " 6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbCircle\n 10\n"
a2_cX = "AcDbCircle\n 10\n"
//alert(a2_cX)

a3_cY = " 20\n"
a4_R = " 40\n"
a5_p1A = "100\nAcDbArc\n 50\n"
a6_p2A = " 51\n"


c1_sloy = "0\nCIRCLE\n 5\n110D3\n330\n1F\n100\nAcDbEntity\n 8\n"
c2_cX = "6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbCircle\n 10\n"
c3_cY = " 20\n"
c4_R = " 40\n"

p = AddPanel(1, 1)
c = p.Contour
c.Clear();

////////////Линии

arL = data.toString().split(l2_x1)
system.log(JSON.stringify(arL))
system.log(arL.length)

for(i=1;i< arL.length;i++)
{
tt = arL[i]
artt= tt.toString().split(l3_y1)
p1x = +artt[0]
// system.log(p1x)
artt= artt[1].split(l4_x2)
p1y = +artt[0]
// system.log(p1y)
artt= artt[1].split(l5_y2)
p2x = +artt[0]
// system.log(p2x)
artt= artt[1].split('\n')
p2y = +artt[0]
// system.log(p2y)
c.AddLine(p1x, p1y, p2x, p2y)
}
////////////----Линии

////////////ДУГИ и Круги

arL = data.toString().split(a2_cX)
system.log(JSON.stringify(arL))
system.log(arL.length)


for(i=1;i< arL.length;i++)
{
tt = arL[i]
artt= tt.toString().split(a3_cY)
cx = +artt[0]
system.log('cx - '+cx)
artt= artt[1].split(a4_R)
cy = +artt[0]
system.log('cy - '+cy)
artt2 = artt
artt= artt[1].split(a5_p1A)
aR = +artt[0]
system.log('aR - '+aR)

if(isNaN(aR))
{


artt2= artt2[1].split('\n')
aR = +artt2[0]
system.log('aR - '+aR)

c.AddCircle(cx, cy, aR)
continue
}

artt= artt[1].split(a6_p2A)
p1A = +artt[0]
system.log('p1A - '+p1A)
artt= artt[1].split('\n')
p2A = +artt[0]
system.log('p2A - '+p2A)
/*
a1_sloy + sloy + "\n" +
a2_cX + c[i].Center.x + "\n" +
a3_cY + c[i].Center.y + "\n" +
a4_R + c[i].ArcRadius() + "\n" +
a5_p1A + p1A + "\n" +
a6_p2A + p2A + "\n"
*/

p1A = p1A/ (180 / Math.PI)
p2A = p2A/ (180 / Math.PI)
p1y = aR* Math.sin(p1A)
p1x = aR* Math.cos(p1A)
p2y = aR* Math.sin(p2A)
p2x = aR* Math.cos(p2A)

p1 = NewPoint(p1x+cx, p1y+cy)
p2 = NewPoint(p2x+cx, p2y+cy)
centre = NewPoint(cx, cy)
c.AddArc(p1, p2, centre, true)

}



////////////----------ДУГИ и Круги





p.Build()
/*


for(i=0;i< data.length;i++)
{
//alert('!!!'+data[i].sloy)
if(sloi.indexOf(data[i].sloy)== -1)
{
sloi.push(data[i].sloy)
}

}

tdxf = t1

for(i=0;i< sloi.length;i++)
{
tdxf = tdxf + t2_doSloya + sloi[i] + "\n" + t3_PosleSloya
}


tdxf = tdxf + t4_DoObjektov

for(ic=0;ic< data.length;ic++)
{
c = data[ic].c
sloy = data[ic].sloy
for (i = 0; i < c.Count; i++) {
if (c[i].ElType == 1) {

tdxf = tdxf

+ l1_sloy + sloy + "\n"
+ l2_x1 + c[i].Pos1.x + "\n"
+ l3_y1 + c[i].Pos1.y + "\n"
+ l4_x2 + c[i].Pos2.x + "\n"
+ l5_y2 + c[i].Pos2.y + "\n"






} else if (c[i].ElType == 2) {
p1A = c[i].Pos1Angle() * (180 / Math.PI)
p2A = c[i].Pos2Angle() * (180 / Math.PI)
if(!c[i].ArcDir)
{
pp=p1A
p1A = p2A
p2A = pp
}
//else {dir='1'}
tdxf = tdxf + a1_sloy + sloy + "\n" + a2_cX + c[i].Center.x + "\n" + a3_cY + c[i].Center.y + "\n" + a4_R + c[i].ArcRadius() + "\n" + a5_p1A + p1A + "\n" + a6_p2A + p2A + "\n"
} else if (c[i].ElType == 3) {
tdxf = tdxf + c1_sloy + sloy + "\n" + c2_cX + c[i].Center.x + "\n" + c3_cY + c[i].Center.y + "\n" + c4_R + c[i].CirRadius + "\n"
}
}
}
tdxf = tdxf + kanec
*/
// system.writeTextFile(ActiveFilePathNomenklatury()+ 'ЧПУ\\' + data[0].Pos + '.dxf', tdxf)
}

function DXF(data) {

t1 = "0\nVISION3D DXF\n0\nSECTION\n2\nHEADER\n9\n$ACADVER\n 1\nAC1015\n 9\n$ACADMAINTVER\n 70\n6\n 9\n$DWGCODEPAGE\n 3\nANSI_1251\n 9\n$INSBASE\n 10\n0.0\n 20\n0.0\n 30\n0.0\n 9\n$EXTMIN\n10\n0.0\n20\n0.0\n9\n$EXTMAX\n10\n1000.0\n20\n1000.0\n9\n$LINMIN\n10\n0.0\n20\n0.0\n9\n$LINMAX\n10\n1000.0\n20\n1000.0\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLTYPE\n70\n1\n0\nLTYPE\n2\nCONTINUOUS\n70\n64\n3\nSolid line\n72\n65\n73\n0\n40\n0.000000\n0\nENDTAB\n0\nTABLE\n2\n"
//alert(t1)
t2_doSloya = "LAYER\n70\n6\n0\nLAYER\n 5\n110D0\n330\n2\n100\nAcDbSymbolTableRecord\n100\nAcDbLayerTableRecord\n 2\n"
//alert(t2_doSloya)
t3_PosleSloya = "70\n64\n 62\n7\n 6\nCONTINUOUS\n0\n"
//alert(t3_PosleSloya)
t4_DoObjektov = "ENDTAB\n0\nTABLE\n2\nSTYLE\n70\n0\n0\nENDTAB\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n"
//alert(t4_DoObjektov)
l1_sloy = "0\nLINE\n 5\n110D1\n330\n1F\n100\nAcDbEntity\n 8\n"
//alert(l1_sloy)
l2_x1 = "6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbLine\n 10\n"
//alert(l2_x1)
l3_y1 = " 20\n"
l4_x2 = " 11\n"
l5_y2 = " 21\n"

a1_sloy = " 0\nARC\n 5\n110D2\n330\n1F\n100\nAcDbEntity\n 8\n"

a2_cX = " 6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbCircle\n 10\n"
//alert(a2_cX)

a3_cY = " 20\n"
a4_R = " 40\n"
a5_p1A = "100\nAcDbArc\n 50\n"
a6_p2A = " 51\n"


c1_sloy = "0\nCIRCLE\n 5\n110D3\n330\n1F\n100\nAcDbEntity\n 8\n"
c2_cX = "6\nCONTINUOUS\n 62\n7\n370\n60\n100\nAcDbCircle\n 10\n"
c3_cY = " 20\n"
c4_R = " 40\n"
kanec = "0\nENDSEC\n0\nEOF"


sloi = []
for(i=0;i< data.length;i++)
{
//alert('!!!'+data[i].sloy)
if(sloi.indexOf(data[i].sloy)== -1)
{
sloi.push(data[i].sloy)
}

}

tdxf = t1

for(i=0;i< sloi.length;i++)
{
tdxf = tdxf + t2_doSloya + sloi[i] + "\n" + t3_PosleSloya
}


tdxf = tdxf + t4_DoObjektov

for(ic=0;ic< data.length;ic++)
{
c = data[ic].c
sloy = data[ic].sloy
for (i = 0; i < c.Count; i++) {
if (c[i].ElType == 1) {

tdxf = tdxf

+ l1_sloy + sloy + "\n"
+ l2_x1 + c[i].Pos1.x + "\n"
+ l3_y1 + c[i].Pos1.y + "\n"
+ l4_x2 + c[i].Pos2.x + "\n"
+ l5_y2 + c[i].Pos2.y + "\n"






} else if (c[i].ElType == 2) {
p1A = c[i].Pos1Angle() * (180 / Math.PI)
p2A = c[i].Pos2Angle() * (180 / Math.PI)
if(!c[i].ArcDir)
{
pp=p1A
p1A = p2A
p2A = pp
}
//else {dir='1'}
tdxf = tdxf +

a1_sloy + sloy + "\n" +
a2_cX + c[i].Center.x + "\n" +
a3_cY + c[i].Center.y + "\n" +
a4_R + c[i].ArcRadius() + "\n" +
a5_p1A + p1A + "\n" +
a6_p2A + p2A + "\n"


} else if (c[i].ElType == 3) {
tdxf = tdxf +

c1_sloy + sloy + "\n" +
c2_cX + c[i].Center.x + "\n" +
c3_cY + c[i].Center.y + "\n" +
c4_R + c[i].CirRadius + "\n"

}
}
}
tdxf = tdxf + kanec

// system.writeTextFile(ActiveFilePathNomenklatury()+ 'ЧПУ\\' + data[0].Pos + '.dxf', tdxf)
}


