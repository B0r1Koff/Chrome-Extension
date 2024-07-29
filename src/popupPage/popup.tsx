import React, {FC, useEffect, useState} from 'react'
import { hydrateRoot } from 'react-dom/client'

interface Props{

}

export const Popup: FC<Props> = () => {
    let [city, setCity] = useState<string>("Минск")

    const sendRequest = (value: string) => {
        chrome.storage.sync.set({ city: value })
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
            const currentTabId = tabs.length === 0 ? 0 : tabs[0].id!
            chrome.tabs.sendMessage(currentTabId, value, response => {
                console.log("Response from content: ", response);
            })
        })
    }

    const handleCityChange = (value: string) => {
        setCity(value)
        sendRequest(value)
    } 

    return(
        <div>
            <select name="" id="" value={city} onChange={(e) => {handleCityChange(e.target.value)}}>
                <option value="Минск">Минск</option>
                <option value="Брест">Брест</option>
                <option value="Витебск">Витебск</option>
            </select>
        </div>
    )
}

const container : any = document.getElementById("popup")
hydrateRoot(container, <Popup/>)