import React from 'react';
import styled from 'styled-components';

interface WatchButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

const WatchButton: React.FC<WatchButtonProps> = ({ label, onClick, className }) => {
  return (
    <StyledWrapper className={className}>
      <button className="btn" onClick={onClick}>
        {label}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    font-size: 1rem;
    padding: 0.75rem 1.75rem;
    border: none;
    outline: none;
    border-radius: 0.4rem;
    cursor: pointer;
    text-transform: uppercase;
    background-color: rgb(14, 14, 26);
    color: rgb(234, 234, 234);
    font-weight: 700;
    transition: 0.6s;
    box-shadow: 0px 0px 60px #1f4c65;
    -webkit-box-reflect: below 10px linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.4));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn:active {
    transform: scale(0.92);
  }

  .btn:hover {
    background: rgb(2,29,78);
    background: linear-gradient(270deg, rgba(2, 29, 78, 0.681) 0%, rgba(31, 215, 232, 0.873) 60%);
    color: rgb(4, 4, 38);
  }
`;

export default WatchButton;
