import React from "react";
import {ReactComponent as ShoppingIcon} from '../../images/shopping-bag.svg';
import useProducts from "../../hooks/useProducts";

const CartIcon = () => {
    const {selectors: productsSelectors, actions: productsActions} = useProducts();

    const count = productsSelectors.getCartItems().reduce(
        (accumulator, item) => accumulator + item.quantity, 0
    );
    return (
        <div className='cart-icon' onClick={() => productsActions.toggleCartHidden()}>
            <ShoppingIcon className='shopping-icon'/>
            <span className='item-count'>{count}</span>
        </div>
    );
}

export default React.memo(CartIcon);
