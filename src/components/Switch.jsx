import React from 'react';
import styled from 'styled-components';

const Switch = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <label className="switch">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
        />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
}

Switch.defaultProps = {
  checked: false,
  onChange: () => {}
};

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
    transition: transform 0.1s ease;
  }

  .switch:active {
    transform: scale(0.98);
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 34px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.6em;
    width: 1.6em;
    border-radius: 50%;
    left: 0.2em;
    bottom: 0.15em;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateX(0);
  }

  input:checked + .slider {
    background: linear-gradient(to bottom, #000000, #880808);
    border-color: #880808;
  }

  input:checked + .slider:before {
    transform: translateX(1.5em);
    background-color: #fff;
  }

  input:focus + .slider {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.25);
  }

  input:disabled + .slider {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Hover effects */
  .switch:not(:disabled):hover .slider:before {
    transform: ${props => props.checked ? 'translateX(1.5em) scale(1.1)' : 'scale(1.1)'};
  }
  `;

export default Switch;
