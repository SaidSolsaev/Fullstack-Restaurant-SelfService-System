import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: ${({ theme }) => theme.cardBackground};
    padding: 20px;
    border-radius: 10px;
    box-shadow: ${({ theme }) => theme.boxShadow};
    max-width: 500px;
    width: 100%;
    position: relative;

    @media (max-width: 768px) {
        max-width: 90%;
    }

    @media (max-width: 480px) {
        max-width: 100%;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    background-coloer: none;
    border: none;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.secondaryText};
    cursor: pointer;

    &:hover {
        background: none;
        color: red;
    }
`;

const Modal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    <FaTimes />
                </CloseButton>

                {children}
            </ModalContainer>
        </Overlay>
    )
}

export default Modal;