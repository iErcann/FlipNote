 interface LineInfo {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    brushSize: number;
    brushColor: string; // hex
    isSelected: boolean;
}
interface PointInfo {
    x: number;
    y: number;
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