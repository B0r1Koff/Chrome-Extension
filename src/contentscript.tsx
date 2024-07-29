import React, {useState, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

    const items = document.getElementsByClassName("title")

    const createButton = (openModal: () => void) => {
        const button = document.createElement('button');
        button.innerText = 'Q';
        button.style.marginLeft = '10px';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = 'xx-large'
        button.style.height = '50px'
        button.style.width = '150px'
        button.style.fontWeight = '700'
      
        button.addEventListener('click', (event) => {
          event.preventDefault(); 
          openModal()
        });
      
        return button;
      };

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(prevState => !prevState);
  };

  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      const element = items[i] as HTMLElement;
      element.style.display = "flex"
      const button = createButton(openModal);
      element.appendChild(button);
    }
  }, []);

  return (
    <div>
      <ModalWindow isOpen={isModalOpen}/>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
}

const ModalWindow = ({isOpen} : ModalProps) => {
  let [selectedCity, setSelectedCity] = useState<string>("Минск")
  let [temperature, setTemperature] = useState(0)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
        setSelectedCity(message)
    })
    fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${getCity(selectedCity)}&sections=all&timezone=auto&language=en&units=metric&key=247mt6lo25aypjjn0m2qld5mv6e2hre0rnux057h`)
    .then(response => response.json())
    .then(data => {
        setTemperature(data.current.temperature)
    })
    .catch(error => alert('Ошибка при получении данных о погоде:' + error));
  }, [selectedCity])

  return (
    <div style={{background: 'rgb(255, 220, 220)', display: `${isOpen ? 'block' : 'none'}`, width: '300px', height: '120px', position: 'fixed', left: '50%', top: '50%', zIndex: '9999'}} className="modal">
      <div id="weather" className="modal-content" style={{width: '100%', height: '100%'}}>
        <p style={{fontSize: 'x-large', fontWeight: '700', color: 'black', padding: '5px 0 0 10px'}}>Погода в {selectedCity}е на сегодня <br/>{temperature > 0 && "+"}{Math.round(temperature)}</p>
      </div>
    </div>
  );
};

function getCity(city: string){
  if(city === "Минск") return "Minsk"
  if(city === "Брест") return "Brest"
  else return "Vitebsk"
}

const container = document.createElement('div');
document.body.appendChild(container);
hydrateRoot(container, <Modal/>)
