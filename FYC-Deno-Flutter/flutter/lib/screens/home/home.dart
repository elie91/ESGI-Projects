import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants.dart';
import '../../models/catalog-model.dart';
import '../navbar.dart';
import 'components/item_card.dart';
import '../details/details.dart';

class HomeScreen extends StatefulWidget {
  @override
  createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  initState() {
    super.initState();
    //se run uniquement la 1er fois que l'on charge la page
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<CatalogModel>(context, listen: false).initCatalog();
    });
  }

  @override
  build(context) {
    var products = Provider.of<CatalogModel>(context).getProducts();
    return Scaffold(
        appBar: buildAppBar(context, MAIN_COLOR, Colors.white, false),
        body: Column(
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.all(kDefaultPaddin),
              child: Text(
                "ShopOnline",
                style: Theme.of(context).textTheme.headline5.copyWith(fontWeight: FontWeight.bold),
              ),
            ),
            Expanded(
              child: Padding(
                  padding: const EdgeInsets.all(1),
                  child: products.length > 0
                      ? GridView.builder(
                          itemCount: products.length,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 1,
                            crossAxisSpacing: 1,
                            childAspectRatio: 0.75,
                          ),
                          itemBuilder: (context, index) => ItemCard(
                              product: products[index],
                              press: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => DetailsScreen(
                                      product: products[index],
                                    ),
                                  ))))
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text("Aucun produit"),
                          ],
                        )),
            )
          ],
        ));
  }
}
