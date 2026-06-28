if (obj instanceof TFurnAsm){
    // код для сборки
}
else if (obj instanceof TDraftBlock){
    // код для полуфабриката
}
else if (obj instanceof TFurnBlock){
    if (obj.DatumMode == DatumMode.None){
        // код для блока
    }
    else if (obj.DatumMode == DatumMode.Scheme){
        // код для схемы крепежа
    }
    else {
        // Код для блока с типом установки, отличным от схемы и никакого - скорее всего, фрагмента
    }
}