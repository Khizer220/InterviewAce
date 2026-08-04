import { FaSearch } from "react-icons/fa";
import styles from "./SearchBar.module.css";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className={styles.searchContainer}>
      <FaSearch className={styles.icon} />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;