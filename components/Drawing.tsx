import Sketch from "react-p5";
import p5Types from "p5";
import { useEffect, useState } from "react";
import React from "react";
//import p5 from "../pages/p5";

type InputParameterType = {};


function P5JsComponent({ page }: { page: number }) {
    const width = 960;
    const height = 580;
    const [pages, setPages] = useState<Array<SketchPage>>([]);
    let newPage = false;
    useEffect(() => {
        if (!pages[page]) {
            setPages(oldArray => [...oldArray, {
                page: page,
                contentLines: []
            }]);
        }
        console.log("User changed page")
        newPage = true;
    }, [page])

    //See annotations in JS for more information
    const setup = (p5: p5Types, canvasParentRef: Element) => {

        p5.createCanvas(width, height).parent(canvasParentRef);
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

    };
    const draw = (p5: p5Types) => {
        if (!pages[page]) return;
        const lines = pages[page].contentLines
        if (newPage) {
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

            for (let i = 0; i < lines.length; i++) {
                p5.line(lines[i].x1, lines[i].y1, lines[i].x2, lines[i].y2);
            }
            newPage = false;
        }
        if (p5.mouseIsPressed) {
            p5.strokeWeight(5);
            p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
            lines.push({ x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY })
        }
    };
    return <Sketch setup={setup} draw={draw} />;
}

export default P5JsComponent;