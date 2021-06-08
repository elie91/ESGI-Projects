import 'package:flutter/material.dart';
import '../../models/product-model.dart';
import 'components/body.dart';
import '../navbar.dart';

class DetailsScreen extends StatelessWidget {
  final Product product;

  const DetailsScreen({Key key, this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: buildAppBar(context, Colors.white, Colors.black, true),
      body: Body(product: product),
    );
  }
}
