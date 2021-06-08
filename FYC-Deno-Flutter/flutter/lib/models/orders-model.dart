class Order {
  int ID;
  DateTime date;
  double amount;

  Order(int ID, DateTime date, double amount) {
    this.ID = ID;
    this.date = date;
    this.amount = amount;
  }

  Order.fromJson(Map json)
      : ID = json['id'],
        date = DateTime.parse(json['createdAt']),
        amount = json['amount'];

  Map toJson() {
    return {'id': ID, 'date': date, 'amount': amount};
  }
}
