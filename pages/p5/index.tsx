import React, { useEffect, useRef, useState } from 'react'
import Sketch from 'react-p5'
import dynamic from 'next/dynamic'
import { NumberInputField, NumberInput, NumberDecrementStepper, NumberInputStepper, NumberIncrementStepper, Box, Button, Center, Flex, HStack, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack, Text, useBreakpointValue, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverFooter, PopoverBody, PopoverArrow, Portal, Popover } from '@chakra-ui/react'
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
  const [playInterval, setPlayInterval] = useState<any>();
  const currentFps = useRef(24);
  const [pages, setPages] = useState<Array<SketchPage>>([]);

  useEffect(() => {
    setPages(oldArray => [...oldArray, {
      page: page,
      contentLines: []
    }])
  }, [])

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

  const duplicateCurrentPage = () => {
    // Devrait redécaller tout mais flemme la
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].page === page) {
        setPages(oldArray => [...oldArray, {
          page: page,
          contentLines: oldArray[page].contentLines
        }])
      }
    }
  }
  return <>
    <Flex justify={vrtcl} >
      <Box
        boxShadow={"lg"} m={4}    >
        <P5JsComponent page={page} pages={pages} />
        <Flex mt={2} justify="center">
          <HStack>
            <Button colorScheme='orange' onClick={duplicateCurrentPage}  >
              Duplicate current page
            </Button>
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
              <Flex direction={"column"} ml={2} key={i}>
                <Button boxSize={20} bg={"blue.300"} key={i} onClick={() => setPage(i)}>
                  Page {i + 1}
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
          <Button boxSize={20} bg={"blue.100"} onClick={() => setPages([...pages, {
            page: page,
            contentLines: []
          }])}>
            +
          </Button>

        </HStack >
      </Box >
    </Flex>
  </>
}