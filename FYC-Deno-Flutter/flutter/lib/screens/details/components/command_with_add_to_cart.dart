import 'package:flutter/material.dart';
import '../../../constants.dart';
import '../../../models/product-model.dart';
import 'package:provider/provider.dart';
import '../../../models/cart-model.dart';

class CommandWithAddToCart extends StatelessWidget {
  final Product product;

  const CommandWithAddToCart({Key key, this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Expanded(
          child: SizedBox(
            height: 50,
            child: FlatButton(
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18)),
              color: MAIN_COLOR,
              onPressed: () {
                Provider.of<CartModel>(context).add(product);
              },
              child: Text(
                "Ajouter au panier".toUpperCase(),
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        )
      ],
    );
  }
}
