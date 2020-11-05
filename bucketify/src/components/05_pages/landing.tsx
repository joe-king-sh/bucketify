import React from 'react';
import Box from "@material-ui/core/Box";


//Parallax
import { ParallaxBanner } from 'react-scroll-parallax';

const Landing: React.FC = () => {
    return (

<Box>            <ParallaxBanner
                // className="your-class"
                layers={[
                    {
                        image: 'images/bg-landing.jpg',
                        amount: 0.1,
                    }
                    ,                    {
                        image: 'images/favicon.ico',
                        amount: 0.1,
                    }
                ]}
                style={{
                    height: '700px',
                }}
            >
                <Box>
                   <h1>Banner Children</h1></Box>
            </ParallaxBanner>
         

            <Box>
 <br /> <br />
 <br />
 <br />
 <br />
 <br />
 <br />いろいろ

 <br />
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />
 説明を
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />

 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 <br />
 <br />
 <br />
 <br />ランディングでする
 <br />
 <br />
 </Box>

 </Box>

    );
}

export default Landing;