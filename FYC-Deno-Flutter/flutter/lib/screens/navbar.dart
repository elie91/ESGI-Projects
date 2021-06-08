import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user-model.dart';
import '../models/cart-model.dart';
import 'package:flutter_svg/svg.dart';
import '../services/flash-message.dart';

AppBar buildAppBar(
    context, Color color, Color iconColor, bool displayBackArrow) {
  var userJWT = Provider.of<UserModel>(context).jwt;
  var cartQuantity = Provider.of<CartModel>(context).getCartQuantity();
  var appBarIcons = <Widget>[
    Padding(
      padding: const EdgeInsets.all(10.0),
      child: Container(
        height: 150.0,
        width: 30.0,
        child: GestureDetector(
          onTap: () {},
          child: Stack(
            children: <Widget>[
              IconButton(
                  icon: const Icon(Icons.shopping_cart),
                  tooltip: 'Mon panier',
                  color: iconColor,
                  onPressed: () {
                    Navigator.pushNamed(context, '/cart');
                  }),
              cartQuantity == 0
                  ? Container()
                  : Positioned(
                child: Stack(
                  children: <Widget>[
                    Icon(Icons.brightness_1,
                        size: 20.0, color: Colors.black),
                    Positioned(
                      top: 3.0,
                      right: 5.5,
                      child: Center(
                        child: Text(
                          cartQuantity.toString(),
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 12.0,
                              fontWeight: FontWeight.w500),
                        ),
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    ),
    IconButton(
      icon: const Icon(Icons.account_box),
      tooltip: 'Mon profil',
      color: iconColor,
      onPressed: () {
        userJWT == "" ? Navigator.pushNamed(context, '/login') : Navigator.pushNamed(context, '/profile');
      },
    )
  ];
  if (userJWT != "") {
    appBarIcons.add(IconButton(
        icon: const Icon(Icons.logout),
        color: iconColor,
        tooltip: 'Déconnexion',
        onPressed: () {
          Provider.of<UserModel>(context).logout();
          FlashMessage.showCenterFlash(
              context: context, text: "Déconnexion réussie");
        }));
  }

  return AppBar(
      backgroundColor: color,
      elevation: 0,
      actions: appBarIcons,
      leading: displayBackArrow
          ? IconButton(
        icon: SvgPicture.asset(
          'assets/icons/back.svg',
          color: iconColor,
        ),
        onPressed: () => Navigator.pop(context),
      )
          : null);
}
