import 'package:flutter/material.dart';
import '../../../models/product-model.dart';

class Description extends StatelessWidget {
  const Description({
    Key key,
    @required this.product,
  }) : super(key: key);

  final Product product;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Flexible(
            child: RichText(
              text: TextSpan(
                text: "${product.description}",
                style: Theme.of(context)
                    .textTheme
                    .subtitle2
                    .copyWith(color: Colors.black, fontWeight: FontWeight.w400),
              ),
            ))
      ],
    );
  }
}
