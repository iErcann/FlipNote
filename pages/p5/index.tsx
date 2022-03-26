import React, { useState } from 'react'
import Sketch from 'react-p5'
import dynamic from 'next/dynamic'
import { Box, Button, Flex, HStack, Stack, useBreakpointValue } from '@chakra-ui/react'

const P5JsComponent = dynamic(
  () => import("../../components/Drawing"),
  { ssr: false }
)

export default () => {
  const vrtcl = useBreakpointValue({ md: 'left', lg: 'center' })
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(["test"]);

  return <>
    <Flex justify={vrtcl} >
      <Box
        boxShadow={"xs"}  >
        <P5JsComponent page={page} />
        <h2>
          Page {page + 1}
        </h2>
        <HStack mt={4} overflowX={"auto"} overflowY={"hidden"}>
          {pages.map((p, i) => {
            return (
              <Button w={40} h={40} bg={"blue.300"} key={i} onClick={() => setPage(i)}>
                Page {i + 1}
              </Button>
            );
          })}

          <Button w={40} h={40} bg={"blue.100"} onClick={() => setPages([...pages, "yo"])}>
            +
          </Button>

        </HStack >
      </Box >
    </Flex>
  </>
}