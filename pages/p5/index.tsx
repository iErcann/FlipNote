import React, { useEffect, useRef, useState } from 'react'
import Sketch from 'react-p5'
import dynamic from 'next/dynamic'
import { NumberInputField, NumberInput, NumberDecrementStepper, NumberInputStepper, NumberIncrementStepper, Box, Button, Center, Flex, HStack, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { MdBuild, MdCall, MdArrowRight, MdStop } from "react-icons/md"
const P5JsComponent = dynamic(
  () => import("../../components/Drawing"),
  { ssr: false }
)

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
export default function App() {
  const vrtcl = useBreakpointValue({ md: 'left', lg: 'center' })
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(["test"]);
  const [playInterval, setPlayInterval] = useState<any>();
  const currentFps = useRef(24);

  const play = () => {
    const interval = setInterval(() => {
      setPage(page => (page + 1) % pages.length)
      console.log(page, pages.length);
    }, 1000 / currentFps.current)
    setPlayInterval(interval);
    return () => clearInterval(interval);
  }

  const stop = () => {
    clearInterval(playInterval);
  }

  return <>
    <Flex justify={vrtcl} >
      <Box
        boxShadow={"xs"}   >
        <P5JsComponent page={page} />
        <Flex mt={2} justify="center">
          <HStack>
            <Button leftIcon={<MdArrowRight />} colorScheme='linkedin' onClick={play}  >
              PLAY Page {page}
            </Button>
            <Button leftIcon={<MdStop />} colorScheme='red' onClick={stop}  >
              STOP
            </Button>
            <FPSInput fps={currentFps} />
          </HStack>
        </Flex>
        <HStack shouldWrapChildren={true} mt={4} wrap={"nowrap"} w={900} overflowX={"scroll"} overflowY={"hidden"}>
            {pages.map((p, i) => {
              return (
                <Button bg={"blue.300"} key={i} onClick={() => setPage(i)}>
                  Page {i + 1}
                </Button>
              );
            })}
          <Button bg={"blue.100"} onClick={() => setPages([...pages, "yo"])}>
            +
          </Button>

        </HStack >
      </Box >
    </Flex>
  </>
}