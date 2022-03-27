import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useRef, useState } from "react";
import React from "react";
//import p5 from "../pages/p5";


function P5JsComponent({ page, pages, drawingSettings }: { page: number, pages: any, drawingSettings: React.MutableRefObject<DrawingSettings> }) {
    const width = 960;
    const height = 580;
    const [newPage, setNewPage] = useState(false);

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

    const drawPage = (p5: p5Types, sketchPage: SketchPage) => {
        const lines = sketchPage.contentLines
        for (let i = 0; i < lines.length; i++) {
            p5.strokeWeight(lines[i].brushSize);
            p5.line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
        }
    }
    //See annotations in JS for more information
    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(width, height).parent(canvasParentRef);
        initSketch(p5);
    };
    const draw = (p5: p5Types) => {
        if (!pages[page]) return;
        const lines = pages[page].contentLines
        if (newPage) {
            initSketch(p5);
            // Set page content
            drawPage(p5, pages[page]);
            if (page > 0 && !drawingSettings.current.hidePreviousPage) {
                p5.push();
                p5.stroke(0, 50);
                drawPage(p5, pages[page - 1]);
                p5.pop();
            }
            setNewPage(false);
        }
        if (p5.mouseIsPressed) {
            const brushSize = drawingSettings.current.brushSize;
            p5.strokeWeight(brushSize);
            p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
            lines.push({ x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY, brushSize: brushSize })
        }
    };
    return <Sketch setup={setup} draw={draw} />;
}

export default P5JsComponent;