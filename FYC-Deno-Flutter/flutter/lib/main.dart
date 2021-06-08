import 'package:flutter/material.dart';
import 'models/user-model.dart';
import 'package:provider/provider.dart';
import 'screens/home/home.dart';
import 'constants.dart';
import 'models/catalog-model.dart';
import 'models/cart-model.dart';
import 'screens/cart/cart-screen.dart';
import 'screens/login/login.dart';
import 'screens/signup/signup.dart';
import 'screens/profil/profil-screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (context) => CatalogModel()),
          ChangeNotifierProvider(create: (context) => CartModel()),
          ChangeNotifierProvider(create: (context) => UserModel()),
        ],
        child: MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'FYC Project',
          theme: ThemeData(
              textTheme: Theme
                  .of(context)
                  .textTheme
                  .apply(bodyColor: kTextColor),
              visualDensity: VisualDensity.adaptivePlatformDensity
          ),
          initialRoute: '/',
          routes: {
            '/': (context) => HomeScreen(),
            '/cart': (context) => CartScreen(),
            '/login': (context) => LoginScreen(),
            '/signup': (context) => SignUpScreen(),
            '/profile': (context) => ProfilScreen(),
          },
        )
    );
  }
}

