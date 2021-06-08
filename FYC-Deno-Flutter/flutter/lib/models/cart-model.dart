import 'package:flutter/foundation.dart';
import 'product-model.dart';
import 'dart:math';

double roundDouble(double value, int places) {
  double mod = pow(10.0, places);
  return ((value * mod).round().toDouble() / mod);
}

class CartModel extends ChangeNotifier {
  List<Map> _cartProducts = [];

  List<Map> get products => _cartProducts;

  double getCartTotal() {
    double total = 0;
    _cartProducts.forEach((element) {
      total = total + (element['product'].price * element['quantity']);
    });
    return roundDouble(total, 2);
  }

  int getCartQuantity() {
    int quantity = 0;
    _cartProducts.forEach((element) {
      quantity = quantity + element['quantity'];
    });
    return quantity;
  }

  add(Product productToAdd) {
    bool isExist = false;
    _cartProducts.forEach((element) {
      if (element['product'].id == productToAdd.id) {
        isExist = true;
        element['quantity'] = element['quantity'] + 1;
      }
    });
    if (isExist == false) {
      _cartProducts.add({"quantity": 1, "product": productToAdd});
    }
    notifyListeners();
  }

  remove(Product productToRemove) {
    int quantity;
    _cartProducts.forEach((element) {
      if (element['product'].id == productToRemove.id) {
        element['quantity'] = element['quantity'] - 1;
        quantity = element['quantity'];
      }
    });
    if (quantity == 0) {
      List<Map> newProducts = [];
      _cartProducts.forEach((element) {
        if (element['product'].id != productToRemove.id) {
          newProducts.add(element);
        }
      });
      _cartProducts = newProducts;
    }
    notifyListeners();
  }

  void removeAll() {
    _cartProducts.clear();
    notifyListeners();
  }
}
