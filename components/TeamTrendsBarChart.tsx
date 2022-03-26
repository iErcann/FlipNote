import Konva from 'konva';
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Image } from 'react-konva';

function draw(evt: Konva.KonvaEventObject<MouseEvent>, points: Array<Point>) {
    console.log(evt);
    const point = evt.target.getStage()?.getPointerPosition() as Point;
    points.push(point)
    evt.target.getStage()?.draw();
    const stage = document.getElementById("free")
}
interface Point {
    x: number;
    y: number;
}
const TeamTrendsBarChart = () => {
    const [points, setPoints] = useState<Array<Point>>([]);
    useEffect(() => {
        for (let i = 0; i < 10; i++) {
            setPoints(oldArray => [...oldArray, { x: i * 20, y: i }]);
        }
    }, []);


    console.log(points);
    return <> <canvas style={{position: "absolute"}} width={960} height={580} id="free" />
        <Stage width={960} height={580} onMouseDown={(e) => draw(e, points)} >
            <Layer>
                <Rect
                    x={0}
                    y={0}
                    width={1000}
                    height={1000}
                    fill="lightblue"
                    shadowBlur={10}

                />

                <Rect
                    x={20}
                    y={50}
                    width={100}
                    height={100}
                    fill="red"
                    shadowBlur={10}

                />
                <Circle x={200} y={100} radius={50} fill="green" />
                <Line
                    x={20}
                    y={200}
                    points={[0, 0, 100, 0, 100, 100]}
                    tension={0.5}
                    closed
                    stroke="black"
                    fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                    fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                    fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
                />
                <Text text="Draw! 🎨" fontSize={25} y={20} />
                {points.map((p, i) => {
                    return (
                        <Rect x={p.x} y={p.y} key={i} id={i.toString()} width={12} height={12} fill="yellow" />
                    );
                })}
            </Layer>
        </Stage>
    </>
};

export default TeamTrendsBarChart;