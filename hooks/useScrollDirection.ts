import { useEffect, useState } from "react";

function useScrollDirection() {
    const [scrollY, setscrollY] = useState(0);
    let prevScroll = 0;
    useEffect(() => {
        if (scrollY > prevScroll) {
            console.log("down");
        }
        else {
            console.log("up");
        }
        prevScroll = scrollY ;
    }, [scrollY])


    return [scrollY, setscrollY];
};


export default useScrollDirection;