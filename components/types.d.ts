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

interface Styling {
    brushSize: number;
    brushColor: string; // hex
}

interface VertexInfo {
    content: Array<PointInfo>;
    styling: Styling;
}
interface SketchPage {
    page: number;
    contentLines: Array<LineInfo>;
    contentVertices: Array<VertexInfo>;

}
  
interface DrawingSettings {
    state: DrawingState;
    brushSize: number;
    brushColor: string; // hex
    hidePreviousPage: boolean;
}