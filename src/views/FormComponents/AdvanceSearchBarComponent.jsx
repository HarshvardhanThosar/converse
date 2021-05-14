import { useState } from "react";
import { DropDownSelectComponent } from "../FormComponents";
import SearchIcon from "@material-ui/icons/Search";

export default function AdvanceSearchBarComponent(props) {
  const [localSearchKey, setLocalSearchKey] = useState("");
  const handleSearchKeyInputChange = (event) => {
    setLocalSearchKey(event.target.value);
    props.setError(null);
    props.setWarning(null);
    props.setSearchKey(event.target.value.trim());
  };

  const searchFunction = (event) => {
    event.preventDefault();
    props.searchFunction();
    setLocalSearchKey("");
  };

  return (
    <form className="advance--search--bar">
      <DropDownSelectComponent
        options={props.options}
        setSearchFilter={props.setSearchFilter}
      />
      <input
        type="text"
        placeholder="Search here"
        value={localSearchKey}
        onChange={handleSearchKeyInputChange}
      />
      <button className="cta icon--only" type="button" onClick={searchFunction}>
        <SearchIcon className="light icon" />
      </button>
    </form>
  );
}
