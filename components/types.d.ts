interface LineInfo {
    x1: number;
    x2: number;
    y1: number;
    y2: number;

}


interface SketchPage {
    page: number;
    contentLines: Array<LineInfo>
}