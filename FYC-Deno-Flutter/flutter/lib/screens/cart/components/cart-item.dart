import 'package:flutter/material.dart';
import '../../../models/product-model.dart';
import '../../../models/cart-model.dart';
import 'package:provider/provider.dart';

class CartItem extends StatelessWidget {
  const CartItem({
    Key key,
    this.product,
    this.quantity,
  }) : super(key: key);

  final Product product;
  final int quantity;

  @override
  Widget build(BuildContext context) {
    return Container(
        color: Colors.white,
        margin: EdgeInsets.symmetric(vertical: 8.0),
        child: Row(
          children: <Widget>[
            Container(
                width: 80.0,
                height: 80.0,
                child: Center(
                    child: Container(
                      width: 60.0,
                      height: 60.0,
                      decoration: BoxDecoration(
                          image: DecorationImage(
                              fit: BoxFit.scaleDown, image: NetworkImage(product.image))),
                    ))),
            SizedBox(width: 12.0),
            Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Container(
                      width: 100.0,
                      child: Text(
                        product.name,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                    SizedBox(height: 8.0),
                    Row(
                      children: <Widget>[
                        Container(
                          width: 20.0,
                          height: 20.0,
                          decoration: BoxDecoration(
                              color: Colors.grey[300], borderRadius: BorderRadius.circular(4.0)),
                          child: InkWell(
                              child: Icon(
                                Icons.remove,
                                color: Colors.white,
                                size: 20.0,
                              ),
                              onTap: () {
                                Provider.of<CartModel>(context).remove(product);
                              }),
                        ),
                        Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8.0),
                            child: Text(quantity.toString(),
                                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold))),
                        Container(
                            width: 20.0,
                            height: 20.0,
                            decoration: BoxDecoration(
                                color: Colors.blue[300], borderRadius: BorderRadius.circular(4.0)),
                            child: InkWell(
                                onTap: (){
                                  Provider.of<CartModel>(context).add(product);
                                },
                                child: Icon(
                                  Icons.add,
                                  color: Colors.white,
                                  size: 15.0,
                                ))),
                        Spacer(),
                        Text(product.price.toString(), style: TextStyle(fontWeight: FontWeight.bold))
                      ],
                    )
                  ],
                ))
          ],
        ));
  }
}
