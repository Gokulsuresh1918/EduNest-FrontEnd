import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";


interface Props {
    onClick: () => void;
}

const Like = ({ onClick }: Props) => {
    const [Liked, setLiked] = useState(true)
    function chage() {
        setLiked(!Liked);
        onClick()
    }

    return (
        <>
            {
                Liked ? <CiHeart onClick={chage} color="#ff6b81" size={30} /> :
                    <FaHeart onClick={chage} color="#ff6b81" size={30} />
            }
        </>
    )
}

export default Like