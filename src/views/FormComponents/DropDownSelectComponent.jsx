import { useState } from "react";
import styled from "styled-components";

const DropDownContainer = styled("div")`
  width: 100%;
  position: relative;
  z-index: 10;
`;

const DropDownHeader = styled("div")`
  line-height: 40px;
  padding: 0 10px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  color: #7f7f7f;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(245, 245, 245, 0.05);
`;

const DropDownListContainer = styled("div")``;

const DropDownList = styled("ul")`
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 10px;
  padding: 0 10px;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #fff;
  font-weight: 500;
  position: absolute;
  z-index: 10;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: #151515;
`;

const ListItem = styled("li")`
  line-height: 40px;
  list-style: none;
`;

export default function DropDownSelectComponent(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const toggling = () => setIsOpen(!isOpen);
  const [options, setOptions] = useState(props.options);

  const onOptionClicked = (value) => () => {
    setSelectedOption(value.title);
    props.setSearchFilter(value.id);
    setIsOpen(false);
  };

  return (
    <DropDownContainer>
      <DropDownHeader onClick={toggling}>
        {selectedOption || "Select Filter"}
      </DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            {options.map((option) => (
              <ListItem onClick={onOptionClicked(option)} key={Math.random()}>
                {option.title}
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
}
