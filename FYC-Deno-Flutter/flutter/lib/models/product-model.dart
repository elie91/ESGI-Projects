class Product {
  int id;
  String name;
  String description;
  double price;
  String image;

  Product(int id, String name, String description, double price, String image) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
  }

  Product.fromJson(Map json)
      : id = json['id'],
        name = json['name'],
        description = json['description'],
        price = json['price'],
        image = json['image'];


  Map toJson() {
    return {'id': id, 'name': name, 'description': description, 'price': price, 'image': image };
  }
}
