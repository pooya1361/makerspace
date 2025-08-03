"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsLoggedIn } from "../lib/features/auth/authSlice";

export default function WelcomeRibbon() {
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const [show, setShow] = useState(isLoggedIn);
    const loggedInUser = useSelector(selectCurrentUser)

    useEffect(() => {
        setShow(isLoggedIn)
    }, [isLoggedIn])

    return (
        <>
            {
                loggedInUser && show ?
                    <div className="hidden md:flex px-10 py-1 bg-white justify-between">
                        <span className="text-gray-800">Welcome {loggedInUser.firstName}! ({loggedInUser.userType})</span>
                        <button className="cursor-pointer border hover:border-gray-500 hover:bg-fuchsia-100 rounded w-6 h-6 text-center align-middle flex justify-center items-center" onClick={() => setShow(false)}>
                            <span className="text-gray-800 select-none text-2xl inline-flex">×</span>
                        </button>
                    </div >
                    : undefined
            }
        </>
    )
}