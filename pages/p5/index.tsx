import React, { useEffect, useRef, useState } from 'react'
import Sketch from 'react-p5'
import dynamic from 'next/dynamic'
import { NumberInputField, NumberInput, NumberDecrementStepper, NumberInputStepper, NumberIncrementStepper, Box, Button, Center, Flex, HStack, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack, Text, useBreakpointValue, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverFooter, PopoverBody, PopoverArrow, Portal, Popover, Switch, FormControl, FormLabel, SimpleGrid, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb } from '@chakra-ui/react'
import { MdBuild, MdCall, MdArrowRight, MdStop, MdDraw, MdSettings } from "react-icons/md"
import Draggable from 'react-draggable';

const P5JsComponent = dynamic(
  () => import("../../components/Drawing"),
  { ssr: false }
)


function Settings({ drawingSettings, fps }: {
  drawingSettings: React.MutableRefObject<DrawingSettings>, fps: React.MutableRefObject<number>
}) {
  return <>
    <Popover>
      <PopoverTrigger>
        <Button leftIcon={<MdBuild />} variant='solid'>
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          Global settings
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <FPSInput fps={fps}></FPSInput>
          <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='hideF' mb='0'>
              Hide previous frame
            </FormLabel>
            <Switch id='hideF' onChange={() => drawingSettings.current.hidePreviousPage = !drawingSettings.current.hidePreviousPage} />
          </FormControl>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  </>
}
function DrawingTools({ drawingSettings }: { drawingSettings: React.MutableRefObject<DrawingSettings>, }) {
  const [sliderValue, setSliderValue] = React.useState(1)
  return <>
    <Popover onClose={() => { drawingSettings.current.brushSize = sliderValue }}>
      <PopoverTrigger>
        <Button>Brush Size</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Brush size: {sliderValue} </PopoverHeader>
        <PopoverBody>
          <Slider aria-label='slider-ex-4' min={0.01} max={100} step={0.1} defaultValue={1} onChange={(v) => setSliderValue(v)}
          >
            <SliderTrack bg='red.100'>
              <SliderFilledTrack bg='tomato' />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <Box color='tomato' as={MdDraw} />
            </SliderThumb>
          </Slider>

        </PopoverBody>
      </PopoverContent>
    </Popover>
  </>
}
function FPSInput({ fps }: {
  fps: React.MutableRefObject<number>
}) {
  return (
    <>
      <Text> FPS : </Text>
      <NumberInput w={"20"} defaultValue={24}
        step={1}
        onChange={(valueString) => fps.current = parseInt(valueString)}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </>
  )
}

function startRecording(duration: number) {
  const chunks: Array<any> = []; // here we will store our recorded media chunks (Blobs)
  const canvas = document.querySelector("canvas");
  const stream = canvas!.captureStream(); // grab our canvas MediaStream
  const rec = new MediaRecorder(stream); // init the recorder
  // every time the recorder has new data, we will store it in our array
  rec.ondataavailable = e => chunks.push(e.data);
  // only when the recorder stops, we construct a complete Blob from all the chunks
  rec.onstop = e => exportVid(new Blob(chunks, { type: 'video/webm' }));

  rec.start();
  setTimeout(() => rec.stop(), duration); // stop recording in 3s
}
function exportVid(blob: any) {
  const vid = document.createElement('video');
  vid.src = URL.createObjectURL(blob);
  vid.controls = true;
  document.getElementById("content")!.appendChild(vid);
  const a = document.createElement('a');
  a.download = 'myvid.webm';
  a.href = vid.src;
  a.textContent = 'download the video';
  document.getElementById("content")!.appendChild(a);
}


export default function App() {
  const vrtcl = useBreakpointValue({ md: 'left', lg: 'center' })
  const [page, setPage] = useState(0);
  const [playInterval, setPlayInterval] = useState<any>();
  const currentFps = useRef(24);
  const drawingSettings = useRef<DrawingSettings>({ brushSize: 1, hidePreviousPage: false });
  const [pages, setPages] = useState<Array<SketchPage>>([]);

  useEffect(() => {
    setPages(oldArray => [...oldArray, {
      page: page,
      contentLines: []
    }])
  }, [])

  const play = () => {
    drawingSettings.current.hidePreviousPage = true;
    const interval = setInterval(() => {
      setPage(page => (page + 1) % pages.length)
      console.log(page, pages.length);
    }, 1000 / currentFps.current)
    setPlayInterval(interval);
    return () => clearInterval(interval);
  }

  const stop = () => {
    clearInterval(playInterval);
    drawingSettings.current.hidePreviousPage = false;

  }

  const duplicateCurrentPage = () => {
    // Devrait redécaller tout mais flemme la
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].page === page) {
        setPages(oldArray => [...oldArray, {
          page: page + 1,
          // Deep clone of previous page array because we don't want a reference 
          contentLines: oldArray[page].contentLines.map(a => ({ ...a }))
        }])
        return;
      }
    }
  }
  return <>
    <Flex justify={vrtcl} >
      <Box
        boxShadow={"lg"} m={4} id="content"   >
        <P5JsComponent page={page} pages={pages} drawingSettings={drawingSettings} />
        <Flex mt={2} justify="center">
          <DrawingTools drawingSettings={drawingSettings} />
          <HStack>
            <Button colorScheme='orange' onClick={duplicateCurrentPage}  >
              Duplicate
            </Button>
            {/*        <FormLabel htmlFor='isChecked'>Hide previous frame:</FormLabel>
            <Switch id='isChecked' isChecked /> */}
            <Button leftIcon={<MdArrowRight />} colorScheme='linkedin' onClick={play}  >
              PLAY Page {page}
            </Button>
            <Button leftIcon={<MdStop />} colorScheme='red' onClick={stop}  >
              STOP
            </Button>
            <Button colorScheme='linkedin' onClick={() => { startRecording(pages.length * 1000 / currentFps.current); play(); setTimeout(() => { stop() }, pages.length * 1000 / currentFps.current) }}  >
              Export video
            </Button>

            <Settings fps={currentFps} drawingSettings={drawingSettings}></Settings>
          </HStack>
        </Flex>

        <HStack shouldWrapChildren={true} mt={4} wrap={"nowrap"} w={900} overflowX={"scroll"} overflowY={"hidden"}>

          {pages.map((p: SketchPage, i: number) => {
            console.log(p);
            return (
              <Flex direction={"column"} ml={2} key={i}>

                <Button boxSize={12} bg={p.page === page ? "orange" : "blue.300"} onClick={() => setPage(i)}>
                  Page {p.page}
                </Button>
                {/*         <Popover> FAIT RAMER DE FOU
                  <PopoverTrigger>
                    <Button>Edit</Button>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverHeader>Page {i + 1}</PopoverHeader>
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Button colorScheme='red'>Delete</Button>
                        <Button colorScheme='blue'>Duplicate</Button>
                      </PopoverBody>
                      <PopoverFooter>Duration: 1 frame</PopoverFooter>
                    </PopoverContent>
                  </Portal>
                </Popover> */}
              </Flex>
            );
          })}
          <Button boxSize={12} bg={"blue.100"} onClick={() => setPages([...pages, {
            page: pages.length,
            contentLines: []
          }])}>
            +
          </Button>

        </HStack >
      </Box >
    </Flex>
  </>
}