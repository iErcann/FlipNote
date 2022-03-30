 interface LineInfo {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    brushSize: number;
    brushColor: string; // hex
}

 interface SketchPage {
    page: number;
    contentLines: Array<LineInfo>
}


  
interface DrawingSettings {
    state: DrawingState;
    brushSize: number;
    brushColor: string; // hex
    hidePreviousPage: boolean;
}