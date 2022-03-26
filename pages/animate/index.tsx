import { Box, Button, Center, Container, Flex, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic'
import { MdBuild, MdCall } from "react-icons/md"

const TeamTrendsBarChart = dynamic(
    () => import('../../components/TeamTrendsBarChart'),
    { ssr: false }
);

export default () => {
    const vrtcl = useBreakpointValue({ md: 'left', lg: 'center' })
    console.log(vrtcl)
    return <>
        <Stack direction='row' spacing={4} mb={4}>
            <Button leftIcon={<MdBuild />} colorScheme='pink' variant='solid'>
                Pencil
            </Button>
            <Button rightIcon={<MdCall />} colorScheme='blue' variant='outline'>
                Eraser
            </Button>
        </Stack>
        <Flex justify={vrtcl}>
            <TeamTrendsBarChart />;
        </Flex>
    </>
}