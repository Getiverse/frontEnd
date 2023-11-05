import Image from "next/image";
import ad from "public/test/nord-vpn.jpg";
import adLogo from "public/test/nord-vpn-logo.png";
import Text from "../Text";
import Button from "../buttons/Button";
import { useState } from "react";

function InstantAds() {
    const [showMore, setShowMore] = useState(false);
    const text = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad";
    return (
        <div className="relative h-full w-full snap-start">
            <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-40 z-20" />
            <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-40 z-20" />
            <Image src={ad} fill className="object-cover bg-center z-10" alt={"image ad"} />
            <div className="absolute left-4 bottom-24 z-20 px-2">
                <div className="flex items-center space-x-2">
                    <Image src={adLogo} width="36" height="36" className=" rounded-full" alt={"image ad"} />
                    <span>
                        <Text size="text-md" weight="font-medium" color="text-white" className="leading-none">Nord Vpn</Text>
                        <Text size="text-xs" weight="font-thin" color="text-gray-400" className="leading-2">Sponsored</Text>
                    </span>
                </div>
                <Text size="text-md" color="text-white" className="mt-2">
                    {showMore ? text : `${text.substring(0, 50)}`}
                </Text>
                <button onClick={() => setShowMore(!showMore)}>
                    <Text color="text-gray-500" size="text-md">
                        {showMore ? "...Show less" : "...Show more"}
                    </Text>
                </button>
                <div className="flex justify-center w-full pr-3">
                    <Button type="primary" onClick={() => console.log("learn more")} color="bg-blue-900" className="opacity-90 shadow-xl mt-4" text="Learn More" />
                </div>
            </div>
        </div>
    )
}

export default InstantAds;