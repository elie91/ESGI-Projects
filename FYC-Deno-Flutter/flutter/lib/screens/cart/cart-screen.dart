import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/cart-model.dart';
import '../../models/user-model.dart';
import '../navbar.dart';
import 'components/cart-item.dart';
import '../../services/flash-message.dart';
import '../../services/webservice.dart';

class CartScreen extends StatefulWidget {
  @override
  createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  @override
  Widget build(BuildContext context) {
    var cartProducts = Provider.of<CartModel>(context).products;
    var totalPrice = Provider.of<CartModel>(context).getCartTotal();
    var userJWT = Provider.of<UserModel>(context).jwt;

    return Scaffold(
        appBar: buildAppBar(context, MAIN_COLOR, Colors.white, true),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: <Widget>[
              Text(
                "Mon panier",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 21.0),
              ),
              SizedBox(height: 18.0),
              for (var element in cartProducts)
                CartItem(
                  product: element["product"],
                  quantity: element["quantity"],
                ),
              SizedBox(height: 40.0),
              Divider(),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text("Total", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0)),
                  Text(totalPrice.toString(),
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16.0))
                ],
              ),
              Spacer(),
              MaterialButton(
                onPressed: () {
                  if (userJWT.length == 0) {
                    FlashMessage.showCenterFlash(
                        context: context,
                        text:
                        "Merci de vous connecter pour passer commande");
                    Navigator.pushNamed(context, '/login');
                  } else {
                    WebService.createOrder(userJWT, cartProducts)
                        .then((response) {
                      if (response.statusCode == 201) {
                        FlashMessage.showCenterFlash(
                            context: context, text: "Commande réussie");
                        Provider.of<CartModel>(context).removeAll();
                        Navigator.pushNamed(context, '/profile');
                      }
                    });
                  }
                },
                color: MAIN_COLOR,
                height: 50.0,
                minWidth: double.infinity,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                child: Text("COMMANDER",
                    style: TextStyle(
                        color: Colors.white, fontSize: 14.0, fontWeight: FontWeight.bold)),
              ),
              SizedBox(height: 18.0)
            ])));
  }
}
