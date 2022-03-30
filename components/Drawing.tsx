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

function P5JsComponent({ page, pages, drawingSettings }: { page: number, pages: any, drawingSettings: DrawingSettings }) {
    const width = 960;
    const height = 580;
    const [newPage, setNewPage] = useState(false);
    let clickedPoints: Array<PointInfo> = [];
    useEffect(() => {
        console.log("User changed page")
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

    const strokeLine = (p5: p5Types, line: LineInfo) => {
        p5.strokeWeight(line.brushSize);
        p5.stroke(line.brushColor);
    }
    const drawLine = (p5: p5Types, line: LineInfo) => {
        p5.line(line.x1, line.y1, line.x2, line.y2);
    }
    const drawPage = (p5: p5Types, sketchPage: SketchPage, opacity: number) => {
        const lines = sketchPage.contentLines
        for (let i = 0; i < lines.length; i++) {
            strokeLine(p5, lines[i]);
            if (opacity > 0) {
                p5.stroke(addAlpha(lines[i].brushColor, opacity));
            }
            drawLine(p5, lines[i]);
        }
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
            if (clickedPoints.length > 2) { clickedPoints = [] }
            clickedPoints.push({ x: x, y: y });
            if (clickedPoints.length === 2) {
                let lines = pages[page].contentLines;
                pages[page].contentLines = lines.filter((line: LineInfo) => !(line.x1 > clickedPoints[0].x && line.x1 < clickedPoints[1].x && line.y1 > clickedPoints[0].y && line.y1 < clickedPoints[1].y))
                setNewPage(true);
            }
        }
    }
    const draw = (p5: p5Types) => {
        if (!pages[page]) return;
        const lines = pages[page].contentLines;

        if (newPage) {
            initSketch(p5);
            // Set page content
            drawPage(p5, pages[page], 0);
            // Draw previous page with low opacity            
            if (page > 0 && !drawingSettings.hidePreviousPage) {
                p5.push();
                p5.stroke(0, 50);
                drawPage(p5, pages[page - 1], .1);
                p5.pop();
            }
            setNewPage(false);
        }

        if (p5.keyIsDown(p5.LEFT_ARROW)) {
            lines.pop();
            setNewPage(true);
        }

        if (drawingSettings.state === DrawingState.BRUSH && p5.mouseIsPressed) {
            const lines = pages[page].contentLines;
            const { brushSize, brushColor } = drawingSettings;
            const line: LineInfo = { x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY, brushSize: brushSize, brushColor: brushColor };
            strokeLine(p5, line);
            drawLine(p5, line);
            lines.push(line);
        }




    };
    return <Sketch setup={setup} draw={draw} mouseDragged={mouseDragged} mouseClicked={mouseClicked} />;
}

export default P5JsComponent;