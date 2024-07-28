import React, {useState, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

    const items = document.getElementsByClassName("title")

    const createButton = (openModal: () => void) => {
        const button = document.createElement('button');
        button.innerText = 'Click me';
        button.style.marginLeft = '10px';
        button.style.backgroundColor = 'blue';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
      
        // Добавляем обработчик событий для кнопки
        button.addEventListener('click', (event) => {
          event.preventDefault(); // Предотвращаем стандартное поведение ссылки
          openModal()
        });
      
        return button;
      };

const Modal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(prevState => !prevState);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <ModalWindow isOpen={isModalOpen} onClose={closeModal}/>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void  
}

const ModalWindow = ({isOpen, onClose} : ModalProps) => {
  let [selectedCity, setSelectedCity] = useState("Минск")
 
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
        setSelectedCity(msg)
    })
  }, [selectedCity])

  return (
    <div style={{background: 'red', display: `${isOpen ? 'block' : 'none'}`, width: '300px', height: '100px', position: 'fixed', left: '50%', top: '50%', zIndex: '9999'}} className="modal">
      <div className="modal-content" style={{width: '100%', height: '100%'}}>
        <button onClick={() => onClose()}>close</button>
        <p>{selectedCity}</p>
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
hydrateRoot(container, <Modal/>)
