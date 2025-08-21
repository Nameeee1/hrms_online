import styled from 'styled-components';

export const StyledWrapper = styled.div`
position: fixed;
top: 0;
left: 0;  
right: 0;
bottom: 0;
display: flex;
justify-content: center;
align-items: center;
padding: 20px;
background-color: transparent;
background-image: radial-gradient(#000000 1px, #e5e5f7 1px);
background-size: 30px 30px;
width: 100%;
height: 100%;

.form_container {
  width: 100%;
  max-width: 400px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 50px 40px;
  background-color: #ffffff;
  box-shadow: 0px 106px 42px rgba(0, 0, 0, 0.01),
    0px 59px 36px rgba(0, 0, 0, 0.05), 0px 26px 26px rgba(0, 0, 0, 0.09),
    0px 7px 15px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 11px;
  font-family: "Inter", sans-serif;
}

.logo_container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  margin-bottom: 0;
}

.logo_image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.title_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: -10px;
  font-family: "Alfa Slab One", serif;
  letter-spacing: 2px;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #212121;
}

.subtitle {
  font-size: 0.9rem;
  max-width: 80%;
  text-align: center;
  line-height: 1.1rem;
  color: #8B8E98
}

.input_container {
  width: 100%;
  height: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.icon {
  width: 20px;
  position: absolute;
  z-index: 99;
  left: 12px;
  bottom: 9px;
}

.input_label {
  font-size: 0.75rem;
  color: #8B8E98;
  font-weight: 600;
}

.input_field {
  width: auto;
  height: 40px;
  padding: 0 0 0 40px;
  border-radius: 7px;
  outline: none;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.input_field:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 2px #242424;
  background-color: transparent;
}

.sign-in_btn {
  width: 100%;
  height: 40px;
  border: 0;
  background: #880808;
  border-radius: 7px;
  outline: none;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  transition: opacity 0.2s;
}

.sign-in_btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-toggle {
  text-align: center;
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
}

.toggle-btn {
  background: none;
  border: none;
  color: #880808;
  cursor: pointer;
  font-weight: 600;
  padding: 0 5px;
}

.toggle-btn:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  text-align: center;
}

.sign-in_ggl {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 7px;
  outline: none;
  color: #242424;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  cursor: pointer;
}

.sign-in_apl {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #212121;
  border-radius: 7px;
  outline: none;
  color: #ffffff;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  cursor: pointer;
}

.separator {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  color: #8B8E98;
}

.separator .line {
  display: block;
  width: 100%;
  height: 1px;
  border: 0;
  background-color: #e8e8e8;
}

.note {
  font-size: 0.75rem;
  color: #8B8E98;
  text-decoration: underline;
}`;
