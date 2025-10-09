import './DisplayItems.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from "../../context/AppContext.jsx";
import Item from '../Item/Item.jsx';
import SearchBox from '../SearchBox/SearchBox.jsx';

const DisplayItems = ({ selectedCategory }) => {
    const { itemsData, addToCart } = useContext(AppContext);
    const [searchText, setSearchText] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Filter items
    const filteredItems = itemsData
        .filter(item => !selectedCategory || item.categoryId === selectedCategory)
        .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

    // How many items per row in the grid
    const itemsPerRow = 3; 

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (filteredItems.length === 0) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev + itemsPerRow < filteredItems.length
                            ? prev + itemsPerRow
                            : prev // stay if at bottom
                    );
                    break;

                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev - itemsPerRow >= 0 ? prev - itemsPerRow : prev
                    );
                    break;

                case "ArrowRight":
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < filteredItems.length - 1 ? prev + 1 : 0
                    );
                    break;

                case "ArrowLeft":
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : filteredItems.length - 1
                    );
                    break;

                case "Enter":
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
                        const selectedItem = filteredItems[selectedIndex];
                        addToCart({
                            itemId: selectedItem.itemId,
                            name: selectedItem.name,
                            price: selectedItem.price,
                            imgUrl: selectedItem.imgUrl,
                            quantity: 1,
                        });
                        setSearchText("");
                        setSelectedIndex(-1);
                    }
                    break;

                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredItems, selectedIndex, addToCart]);

    // Reset selection when typing new search
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchText]);

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div></div>
                <div>
                    <SearchBox onSearch={setSearchText} value={searchText} />
                </div>
            </div>

            <div className="row g-3">
                {filteredItems.map((item, index) => (
                    <div
                        key={item.itemId}
                        className={`col-md-4 col-sm-6 item-card-wrapper ${
                            index === selectedIndex ? "selected-item" : ""
                        }`}
                    >
                        <Item
                            itemName={item.name}
                            itemPrice={item.price}
                            itemImage={item.imgUrl}
                            itemId={item.itemId}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisplayItems;
