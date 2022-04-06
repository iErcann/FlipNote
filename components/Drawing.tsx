import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { DrawingState } from "../pages/p5";
//import p5 from "../pages/p5";

function addAlpha(color: string, opacity: number): string {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

function P5JsComponent({ page, pages, drawingSettings }: { page: number, pages: Array<SketchPage>, drawingSettings: DrawingSettings }) {
    const width = 960;
    const height = 580;
    const [newPage, setNewPage] = useState(false);
    const clickedPoints = useRef<Array<PointInfo>>([]);
    const selectedVertices = useRef<Array<VertexInfo>>([]);

    useEffect(() => {
        console.log("New page!")
        setNewPage(true);
    }, [page])

    const initSketch = (p5: p5Types) => {
        p5.background(255);
        p5.stroke(250, 250, 250, 255);
        p5.strokeWeight(5);

        for (let x = 0; x < width; x += 50) {
            p5.line(x, 0, x, height);
        }

        for (let y = 0; y < height; y += 50) {
            p5.line(0, y, width, y);
        }
        p5.stroke(0);
    }

    const strokeApply = (p5: p5Types, style: Styling, opacity: number) => {
        p5.strokeWeight(style.brushSize);
        if (opacity > 0) {
            p5.stroke(addAlpha(style.brushColor, opacity));
        } else {
            p5.stroke(style.brushColor);
        }
    }
    const drawLine = (p5: p5Types, line: LineInfo) => {
        p5.line(line.x1, line.y1, line.x2, line.y2);
    }
    const drawPage = (p5: p5Types, sketchPage: SketchPage, opacity: number) => {
        /*         const lines = sketchPage.contentLines
                for (let i = 0; i < lines.length; i++) {
                    strokeLine(p5, lines[i]);
                    if (opacity > 0) {
                        p5.stroke(addAlpha(lines[i].brushColor, opacity));
                    }
                    drawLine(p5, lines[i]);
                } */
        p5.push();
        const vertices = sketchPage.contentVertices;
        for (let i = 0; i < vertices.length; i++) {
            const vertex: VertexInfo = vertices[i];
            // add styling here
            // Looping over all vertex points
            p5.beginShape();
            p5.noFill();
            strokeApply(p5, vertex.styling, opacity);
            if (vertex.isSelected) {
                p5.stroke(255, 0, 0);
                console.log("selected found")
            }
            for (let j = 0; j < vertex.content.length; j++) {
                const point: PointInfo = vertex.content[j];
                p5.vertex(point.x + vertex.posOffset.x, point.y + vertex.posOffset.y);
            }
            p5.endShape();

        }
        p5.pop();

    }
    //See annotations in JS for more information
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(width, height).parent(canvasParentRef);
        initSketch(p5);
    };

    let last = Date.now();
    function mouseDragged(p5: p5Types) {
        // This is even worse since its independent from the p5 loop
        /*         if (!pages[page]) return;
                const now = Date.now();
                //if (now-last < 1000/16) return;
                // TODO: Dotted tool here with x and y modulo
                const lines = pages[page].contentLines;
                const { brushSize, brushColor } = drawingSettings;
                const line: LineInfo = { x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY, brushSize: brushSize, brushColor: brushColor };
                strokeLine(p5, line);
                drawLine(p5, line);
                lines.push(line);
                last = now; */

    }

    function mouseClicked(p5: p5Types) {
        const x = p5.mouseX;
        const y = p5.mouseY;
        if (x < 0 || x > width || y < 0 || y > height) return;
        if (drawingSettings.state === DrawingState.SELECTION) {
            if (clickedPoints.current.length >= 2) {
                console.log("reset");
                clickedPoints.current = [];
            }
            clickedPoints.current.push({ x: x, y: y })
            if (clickedPoints.current.length === 2) {
                let vertices = pages[page].contentVertices;
                for (let i = 0; i < vertices.length; i++) {
                    const vertex: VertexInfo = vertices[i];
                    const firstPoint: PointInfo = vertex.content[0];
                    firstPoint.x += vertex.posOffset.x;
                    firstPoint.y += vertex.posOffset.y;
                    console.log("ok");
                    if (firstPoint.x > clickedPoints.current[0].x && firstPoint.x < clickedPoints.current[1].x && firstPoint.y > clickedPoints.current[0].y && firstPoint.y < clickedPoints.current[1].y) {
                        vertex.isSelected = true;
                        selectedVertices.current.push(vertex);
                        console.log("selected found!");
                    }
                }
                setNewPage(true);
            }
        }

    }
    function moveSelectedContent(deltaX: number, deltaY: number) {
        const vertices = selectedVertices.current;
        console.log(vertices);
        for (let i = 0; i < vertices.length; i++) {
            const vertex: VertexInfo = vertices[i];
            if (vertex.isSelected) {
                vertex.posOffset.x += deltaX;
                vertex.posOffset.y += deltaY;
            }
        }

    }

    let currentVertexPath: VertexInfo = {
        content: [],
        styling: {
            brushColor: "#000000",
            brushSize: 10
        },
        isSelected: false,
        posOffset: {
            x: 0,
            y: 0
        }
    };
    function endCurrentVertex() {
        if (currentVertexPath.content.length == 0) return;
        pages[page].contentVertices.push(currentVertexPath);

        currentVertexPath = {
            content: [],
            styling: {
                brushColor: "#000000",
                brushSize: 10
            },
            isSelected: false,
            posOffset: {
                x: 0,
                y: 0
            }
        };


    }
    function mouseReleased(p5: p5Types) {
        if (!pages[page]) return;
        /*         for (let i = currentVertexPath.content.length - 1; i >= 0; i--) {
                    if (i % 2 == 0) {
                        currentVertexPath.content.splice(i, 1);
                    }
                } */
        endCurrentVertex();
        setNewPage(true);
    }
    const draw = (p5: p5Types) => {
        if (!pages[page]) return;

        if (newPage) {
            endCurrentVertex();
            /*       for (const selectedVertex of selectedVertices.current) {
                      selectedVertex.isSelected = false;
                  } */
            //selectedVertices.current = [];
            initSketch(p5);
            // Set page content
            drawPage(p5, pages[page], 0);
            // Draw previous page with low opacity            
            if (page > 0 && !drawingSettings.hidePreviousPage) {
                drawPage(p5, pages[page - 1], .1);
            }
            setNewPage(false);
        }
        /* 
                if (p5.keyIsDown(p5.DOWN_ARROW)) {
                    lines.pop();
                    setNewPage(true);
                } */
        if (p5.keyIsDown(p5.LEFT_ARROW)) {
            moveSelectedContent(-5, 0);
            setNewPage(true);
        }
        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            moveSelectedContent(5, 0);
            setNewPage(true);
        }
        if (p5.keyIsDown(p5.UP_ARROW)) {
            moveSelectedContent(0, -5);
            setNewPage(true);
        }
        if (p5.keyIsDown(p5.DOWN_ARROW)) {
            moveSelectedContent(0, 5);
            setNewPage(true);
        }

        if (drawingSettings.state === DrawingState.BRUSH && p5.mouseIsPressed) {
            const { brushSize, brushColor } = drawingSettings;
            const line: LineInfo = {
                x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY,
                isSelected: false, styling: {
                    brushSize: brushSize, brushColor: brushColor,
                }
            };
            strokeApply(p5, line.styling);
            drawLine(p5, line);
            currentVertexPath.styling = line.styling;
            currentVertexPath.content.push({
                x: p5.mouseX,
                y: p5.mouseY,
            })

        }
    };
    return <Sketch setup={setup} draw={draw} mouseReleased={mouseReleased} mouseDragged={mouseDragged} mouseClicked={mouseClicked} />;
}

export default P5JsComponent;