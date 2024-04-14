import styled from 'styled-components';
// import background from '../images/dropdown.png';
const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MyButtonStyled = styled.button`
  padding: 10px 20px;
  background-color: #354346;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CornerImage = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 20px; /* Adjust the size of the image as needed */
  height: 20px;
`;

const MyButton = () => {
  return (
    <ButtonContainer>
      <MyButtonStyled>Click me</MyButtonStyled>
      <CornerImage src="../images/dropdown.png" alt="Corner Image" />
    </ButtonContainer>
  );
};

export default MyButton;