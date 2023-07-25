
import Link from "@docusaurus/Link";
import React, { useEffect } from "react"


export default function CustomNavbarItems(props) {
    
    const { items } = props;

    useEffect(() => {
        console.log(props);
        console.log(window.location);
    },[])

    return (
        items &&
        items.map((e,i) => 
            <Link href={window.location.origin + "/tutorial/" + e.docId} className="'navbar__item navbar__link'" key={i} target="_self"> 
                {e.label}
            </Link>
        )
    )
}
//  navbar__link navbar__link--active