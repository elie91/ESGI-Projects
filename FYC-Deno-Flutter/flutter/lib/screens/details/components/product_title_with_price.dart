import 'package:flutter/material.dart';
import '../../../models/product-model.dart';

class ProductTitleWithPrice extends StatelessWidget {
  const ProductTitleWithPrice({
    Key key,
    @required this.product,
  }) : super(key: key);

  final Product product;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: <Widget>[
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: "${product.name} \n",
                style: Theme.of(context)
                    .textTheme
                    .headline5
                    .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
              ),
              TextSpan(
                text: "${product.price}€",
                style: Theme.of(context)
                    .textTheme
                    .headline5
                    .copyWith(color: Colors.black, fontWeight: FontWeight.normal),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
