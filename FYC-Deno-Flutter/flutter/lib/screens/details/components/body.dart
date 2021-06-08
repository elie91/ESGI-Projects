import 'package:flutter/material.dart';
import '../../../models/product-model.dart';
import 'description.dart';
import 'command_with_add_to_cart.dart';
import 'product_title_with_price.dart';

class Body extends StatelessWidget {
  final Product product;

  const Body({Key key, this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // It provide us total height and width
    Size size = MediaQuery.of(context).size;
    return SingleChildScrollView(
      child: Column(
        children: <Widget>[
          Container(
            padding: EdgeInsets.only(top: 10),
            decoration: BoxDecoration(
              color: Colors.white,
            ),
            child: Container(
              height: size.height / 2.5,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(product.image),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          Container(
            //height: (size.height * 70) / 100,
            width: size.width,
            transform: Matrix4.translationValues(0.0, -50.0, 0.0),
            padding: EdgeInsets.only(
              left: 40,
              right: 40,
            ),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(40),
                topRight: Radius.circular(40),
              ),
            ),
            child: Column(
              children: [
                SizedBox(height: 30),
                ProductTitleWithPrice(product: product),
                SizedBox(height: 10),
                Description(product: product),
                SizedBox(height: 40),
                CommandWithAddToCart(product: product)
              ],
            ),
          )
          //ProductTitleWithImage(product: product)
        ],
      ),
    );
  }
}
