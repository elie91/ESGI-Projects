import 'package:flutter/material.dart';
import 'dart:convert';
import '../services/webservice.dart';
import 'product-model.dart';

class CatalogModel extends ChangeNotifier {
  static List<Product> _catalogProducts = [];

  List<Product> getProducts() => _catalogProducts;

  Product getById(int id) => _catalogProducts[id];

  void initCatalog() {
    WebService.getProducts().then((response) {
      Iterable list = json.decode(response.body);
      _catalogProducts = list.map((model) => Product.fromJson(model)).toList();
      notifyListeners();
    });
  }
}
