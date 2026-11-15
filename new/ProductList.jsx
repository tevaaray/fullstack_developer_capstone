import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './CartSlice';
import CartItem from './CartItem';
import './ProductList.css';

function ProductList() {
  const [showCart, setShowCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const plantsArray = [
    {
      category: "Air Purifying Plants",
      plants: [
        { name: "Snake Plant", image: "https://cdn.pixabay.com/photo/2021/01/22/06/04/snake-plant-5939187_1280.jpg", cost: "$15", description: "Produces oxygen at night, improving sleep quality." },
        { name: "Spider Plant", image: "https://cdn.pixabay.com/photo/2018/07/11/06/47/chlorophytum-3530413_1280.jpg", cost: "$12", description: "Resilient and excellent for filtering formaldehyde." },
        { name: "Peace Lily", image: "https://cdn.pixabay.com/photo/2018/02/23/11/09/peace-lily-3175055_1280.jpg", cost: "$18", description: "Beautiful white blooms and high toxin removal rate." },
        { name: "Boston Fern", image: "https://cdn.pixabay.com/photo/2020/04/30/19/52/fern-5114241_1280.jpg", cost: "$14", description: "Adds lush green texture and humidifies indoor air." },
        { name: "Rubber Plant", image: "https://cdn.pixabay.com/photo/2020/06/09/04/45/plant-5276707_1280.jpg", cost: "$20", description: "Features glossy leaves that trap household dust." },
        { name: "Bamboo Palm", image: "https://cdn.pixabay.com/photo/2019/06/07/13/21/palm-4258284_1280.jpg", cost: "$25", description: "Great for clearing indoor air pollutants and adding height." }
      ]
    },
    {
      category: "Aromatic Fragrant Plants",
      plants: [
        { name: "Lavender", image: "https://cdn.pixabay.com/photo/2016/04/19/19/27/lavender-1339671_1280.jpg", cost: "$15", description: "Calming scent, used in aromatherapy and relaxation." },
        { name: "Jasmine", image: "https://cdn.pixabay.com/photo/2017/04/09/19/33/jasmine-2216659_1280.jpg", cost: "$18", description: "Sweet fragrance that blooms during evenings." },
        { name: "Rosemary", image: "https://cdn.pixabay.com/photo/2016/09/10/11/41/rosemary-1658872_1280.jpg", cost: "$10", description: "Aromatic herb used for cooking and memory boosting." },
        { name: "Mint", image: "https://cdn.pixabay.com/photo/2016/01/07/18/09/mint-1126282_1280.jpg", cost: "$8", description: "Fast-growing, refreshing scent and great for teas." },
        { name: "Lemon Balm", image: "https://cdn.pixabay.com/photo/2019/07/16/20/04/lemon-balm-4342205_1280.jpg", cost: "$12", description: "Citrusy aroma that relieves stress and anxiety." },
        { name: "Geranium", image: "https://cdn.pixabay.com/photo/2017/05/12/16/19/geranium-2307137_1280.jpg", cost: "$14", description: "Rose-scented foliage with vibrant flowers." }
      ]
    },
    {
      category: "Low Maintenance Plants",
      plants: [
        { name: "ZZ Plant", image: "https://cdn.pixabay.com/photo/2021/04/07/15/48/zz-plant-6159239_1280.jpg", cost: "$22", description: "Thrives in low light and requires minimal watering." },
        { name: "Aloe Vera", image: "https://cdn.pixabay.com/photo/2018/04/11/17/30/aloe-vera-3311684_1280.jpg", cost: "$10", description: "Medicinal succulent plant with soothing gel." },
        { name: "Pothos", image: "https://cdn.pixabay.com/photo/2017/02/16/18/14/pothos-2071850_1280.jpg", cost: "$12", description: "Nearly indestructible trailing vine plant." },
        { name: "Cactus", image: "https://cdn.pixabay.com/photo/2016/03/30/01/18/cactus-1290071_1280.jpg", cost: "$9", description: "Stores water in thick stems, perfect for neglectful owners." },
        { name: "Cast Iron Plant", image: "https://cdn.pixabay.com/photo/2021/09/25/15/34/plant-6655160_1280.jpg", cost: "$24", description: "Extremely tough, tolerant of low light and dark corners." },
        { name: "Jade Plant", image: "https://cdn.pixabay.com/photo/2020/05/27/19/44/jade-plant-5228695_1280.jpg", cost: "$16", description: "Symbol of good luck with thick, woody stems." }
      ]
    }
  ];

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant));
    setAddedToCart(prevState => ({ ...prevState, [plant.name]: true }));
  };

  return (
    <div>
      <div className="navbar">
        <div className="brand" onClick={() => setShowCart(false)}>
          <h3>Paradise Nursery</h3>
        </div>
        <div className="nav-links">
          <span onClick={() => setShowCart(false)}>Plants</span>
          <span onClick={() => setShowCart(true)} className="cart-icon-container">
            🛒 Cart ({totalCartItems})
          </span>
        </div>
      </div>

      {!showCart ? (
        <div className="product-grid">
          {plantsArray.map((category, index) => (
            <div key={index} className="category-section">
              <h2>{category.category}</h2>
              <div className="plant-list">
                {category.plants.map((plant, plantIndex) => (
                  <div key={plantIndex} className="plant-card">
                    <img src={plant.image} alt={plant.name} className="plant-image" />
                    <h3>{plant.name}</h3>
                    <p>{plant.cost}</p>
                    <p>{plant.description}</p>
                    <button
                      className={`cart-btn ${addedToCart[plant.name] ? 'added' : ''}`}
                      onClick={() => handleAddToCart(plant)}
                      disabled={addedToCart[plant.name]}
                    >
                      {addedToCart[plant.name] ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CartItem onContinueShopping={() => setShowCart(false)} />
      )}
    </div>
  );
}

export default ProductList;