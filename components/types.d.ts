 interface LineInfo {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    styling: Styling;
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
    isSelected: boolean;
    posOffset: PointInfo;

}
interface LayerPage {
    index: number;
    isHidden: boolean = false;

}
interface SketchPage {
    page: number;
    contentLines: Array<LineInfo>;
    //contentVertices: Map<LayerPage, Array<VertexInfo>>;
    contentVertices: Array<VertexInfo>;

}
  
interface DrawingSettings {
    state: DrawingState;
    brushSize: number;
    brushColor: string; // hex
    hidePreviousPage: boolean;
}